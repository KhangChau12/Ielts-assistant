import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cleanInviteCode, INVITE_BONUSES } from '@/lib/invite/utils'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('[Invite Apply] User auth check:', { userId: user?.id, hasError: !!authError })

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { inviteCode } = await request.json()
    console.log('[Invite Apply] Received invite code:', inviteCode)

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    const cleanCode = cleanInviteCode(inviteCode)
    console.log('[Invite Apply] Clean code:', cleanCode)

    // Get inviter's profile
    const { data: inviter, error: inviterError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('invite_code', cleanCode)
      .single()

    console.log('[Invite Apply] Inviter lookup:', { inviter, inviterError })

    if (inviterError || !inviter) {
      logger.auth('Invalid invite code')
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    // Can't use own invite code
    if (inviter.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot use your own invite code' },
        { status: 400 }
      )
    }

    // Check if already used an invite code
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('invited_by')
      .eq('id', user.id)
      .single()

    if (currentProfile?.invited_by) {
      return NextResponse.json(
        { error: 'You have already used an invite code' },
        { status: 400 }
      )
    }

    // Start transaction to apply bonuses
    logger.auth('Starting bonus application...')

    // 1. Update invited user (current user)
    const { error: invitedUpdateError } = await supabase
      .from('profiles')
      .update({
        invited_by: inviter.id,
        invite_bonus_essays: INVITE_BONUSES.INVITED
      })
      .eq('id', user.id)

    console.log('[Invite Apply] Invited user update:', {
      userId: user.id,
      bonus: INVITE_BONUSES.INVITED,
      error: invitedUpdateError
    })

    if (invitedUpdateError) {
      throw new Error('Failed to apply invited bonus: ' + invitedUpdateError.message)
    }

    // 2. Update inviter's bonus (increment their current bonus)
    const { data: currentInviter } = await supabase
      .from('profiles')
      .select('invite_bonus_essays')
      .eq('id', inviter.id)
      .single()

    console.log('[Invite Apply] Current inviter bonus:', currentInviter?.invite_bonus_essays)

    const newInviterBonus = (currentInviter?.invite_bonus_essays || 0) + INVITE_BONUSES.INVITER

    console.log('[Invite Apply] New inviter bonus:', newInviterBonus)

    const { error: inviterUpdateError } = await supabase
      .from('profiles')
      .update({
        invite_bonus_essays: newInviterBonus
      })
      .eq('id', inviter.id)

    console.log('[Invite Apply] Inviter update:', {
      inviterId: inviter.id,
      newBonus: newInviterBonus,
      error: inviterUpdateError
    })

    if (inviterUpdateError) {
      throw new Error('Failed to apply inviter bonus: ' + inviterUpdateError.message)
    }

    // 3. Record the invite
    const { error: inviteRecordError } = await supabase
      .from('invites')
      .insert({
        inviter_id: inviter.id,
        invited_id: user.id,
        bonus_applied: true
      })

    console.log('[Invite Apply] Invite record:', { error: inviteRecordError })

    if (inviteRecordError) {
      // Log but don't fail - bonuses already applied
      logger.error('[Invite Apply] Failed to record invite:', inviteRecordError)
    }

    logger.auth('SUCCESS! Bonus applied.')

    return NextResponse.json({
      success: true,
      message: `You received ${INVITE_BONUSES.INVITED} bonus essays!`,
      bonusEssays: INVITE_BONUSES.INVITED
    })

  } catch (error) {
    logger.error('[Invite Apply] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to apply invite bonus' },
      { status: 500 }
    )
  }
}