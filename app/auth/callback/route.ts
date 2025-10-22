import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cleanInviteCode, INVITE_BONUSES } from '@/lib/invite/utils'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  logger.auth('Received request with code:', code?.substring(0, 10) + '...')

  // Exchange code for session (middleware handles PKCE automatically)
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // This will handle PKCE verification automatically via cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      logger.error('Exchange error:', error.message)
      logger.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      logger.error('User error:', userError)
      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
    }

    logger.auth('✅ User authenticated:', user.id)
    logger.auth('User metadata:', user.user_metadata)

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, created_at, invited_by')
      .eq('id', user.id)
      .single()

    // Allow invite code application if:
    // 1. Profile doesn't exist (new signup) OR
    // 2. Profile was created less than 1 hour ago AND doesn't have invite applied yet
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const isNewProfile = !existingProfile
    const isRecentProfile = existingProfile && new Date(existingProfile.created_at) > oneHourAgo
    const hasNoInvite = existingProfile && !existingProfile.invited_by
    const canApplyInvite = isNewProfile || (isRecentProfile && hasNoInvite)

    logger.auth('Profile status:', {
      exists: !!existingProfile,
      createdAt: existingProfile?.created_at,
      isRecent: isRecentProfile,
      hasInvite: !hasNoInvite,
      canApplyInvite
    })

    if (!existingProfile) {
      logger.auth('🆕 Creating new profile')

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata.full_name || null,
        role: 'student',
      })

      if (profileError) {
        logger.error('❌ Profile creation error:', profileError)
      } else {
        logger.auth('✅ Profile created')
      }

      // Apply invite code if provided
      const inviteCode = user.user_metadata.invite_code
      logger.auth('Invite code from metadata:', inviteCode)

      if (inviteCode) {
        try {
          const cleanCode = cleanInviteCode(inviteCode)
          logger.auth('🎁 Processing invite code:', cleanCode)

          // Find inviter
          const { data: inviter, error: inviterError } = await supabase
            .from('profiles')
            .select('id, email, invite_bonus_essays')
            .eq('invite_code', cleanCode)
            .single()

          if (inviterError) {
            logger.auth('❌ Inviter not found:', inviterError.message)
          } else if (inviter.id === user.id) {
            logger.auth('❌ Self-invite blocked')
          } else {
            logger.auth('✅ Inviter found:', inviter.email)

            // Update invited user (new user gets +3 essays)
            const { error: invitedUpdateError } = await supabase
              .from('profiles')
              .update({
                invited_by: inviter.id,
                invite_bonus_essays: INVITE_BONUSES.INVITED  // +3 essays
              })
              .eq('id', user.id)

            if (invitedUpdateError) {
              logger.error('❌ Failed to update invited user:', invitedUpdateError)
            } else {
              logger.auth('✅ Invited user got +${INVITE_BONUSES.INVITED} essays')

              // Update inviter (inviter gets +6 essays) using SECURITY DEFINER function
              const { error: inviterUpdateError } = await supabase.rpc('increment_inviter_bonus', {
                inviter_user_id: inviter.id,
                bonus_amount: INVITE_BONUSES.INVITER
              })

              if (inviterUpdateError) {
                logger.error('❌ Failed to update inviter:', inviterUpdateError)
              } else {
                const newInviterBonus = (inviter.invite_bonus_essays || 0) + INVITE_BONUSES.INVITER
                logger.auth('✅ Inviter got +${INVITE_BONUSES.INVITER} essays (total: ${newInviterBonus})')

                // Record invite
                const { error: recordError } = await supabase
                  .from('invites')
                  .insert({
                    inviter_id: inviter.id,
                    invited_id: user.id,
                    bonus_applied: true
                  })

                if (recordError) {
                  logger.error('❌ Failed to record invite:', recordError)
                } else {
                  logger.auth('🎉 INVITE BONUS SUCCESS!')
                  logger.auth('📊 ${inviter.email} → ${user.email}')
                }
              }
            }
          }
        } catch (error) {
          logger.error('❌ Invite processing error:', error)
        }
      } else {
        logger.auth('ℹ️  No invite code provided')
      }
    } else if (canApplyInvite) {
      // Profile exists but was created recently and has no invite yet
      logger.auth('🆕 Recent profile - can still apply invite code')

      const inviteCode = user.user_metadata.invite_code
      logger.auth('Invite code from metadata:', inviteCode)

      if (inviteCode) {
        try {
          const cleanCode = cleanInviteCode(inviteCode)
          logger.auth('🎁 Processing invite code:', cleanCode)

          // Find inviter
          const { data: inviter, error: inviterError } = await supabase
            .from('profiles')
            .select('id, email, invite_bonus_essays')
            .eq('invite_code', cleanCode)
            .single()

          if (inviterError) {
            logger.auth('❌ Inviter not found:', inviterError.message)
          } else if (inviter.id === user.id) {
            logger.auth('❌ Self-invite blocked')
          } else {
            logger.auth('✅ Inviter found:', inviter.email)

            // Update invited user (gets +3 essays)
            const { error: invitedUpdateError } = await supabase
              .from('profiles')
              .update({
                invited_by: inviter.id,
                invite_bonus_essays: INVITE_BONUSES.INVITED
              })
              .eq('id', user.id)

            if (invitedUpdateError) {
              logger.error('❌ Failed to update invited user:', invitedUpdateError)
            } else {
              logger.auth('✅ Invited user got +${INVITE_BONUSES.INVITED} essays')

              // Update inviter (gets +6 essays) using SECURITY DEFINER function
              const { error: inviterUpdateError } = await supabase.rpc('increment_inviter_bonus', {
                inviter_user_id: inviter.id,
                bonus_amount: INVITE_BONUSES.INVITER
              })

              if (inviterUpdateError) {
                logger.error('❌ Failed to update inviter:', inviterUpdateError)
              } else {
                const newInviterBonus = (inviter.invite_bonus_essays || 0) + INVITE_BONUSES.INVITER
                logger.auth('✅ Inviter got +${INVITE_BONUSES.INVITER} essays (total: ${newInviterBonus})')

                // Record invite
                const { error: recordError } = await supabase
                  .from('invites')
                  .insert({
                    inviter_id: inviter.id,
                    invited_id: user.id,
                    bonus_applied: true
                  })

                if (recordError) {
                  logger.error('❌ Failed to record invite:', recordError)
                } else {
                  logger.auth('🎉 INVITE BONUS SUCCESS!')
                  logger.auth('📊 ${inviter.email} → ${user.email}')
                }
              }
            }
          }
        } catch (error) {
          logger.error('❌ Invite processing error:', error)
        }
      } else {
        logger.auth('ℹ️  No invite code in metadata')
      }
    } else {
      logger.auth('ℹ️  Profile exists - cannot apply invite (too old or already has invite)')
    }

    // Redirect to dashboard
    logger.auth('→ Redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // No code provided
  logger.auth('❌ No code provided')
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
}
