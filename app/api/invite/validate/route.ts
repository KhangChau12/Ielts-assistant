import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cleanInviteCode, isValidInviteCodeFormat } from '@/lib/invite/utils'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Invite code is required' },
        { status: 400 }
      )
    }

    // Validate format
    if (!isValidInviteCodeFormat(code)) {
      return NextResponse.json(
        { valid: false, message: 'Invalid code format' },
        { status: 400 }
      )
    }

    // Clean the code
    const cleanCode = cleanInviteCode(code)

    // Check if code exists in database
    const supabase = createServerClient()
    const { data: inviter, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('invite_code', cleanCode)
      .single()

    if (error || !inviter) {
      return NextResponse.json(
        { valid: false, message: 'Invalid invite code' },
        { status: 404 }
      )
    }

    // Don't expose full email, just show partial
    const emailParts = inviter.email.split('@')
    const maskedEmail = emailParts[0].substring(0, 3) + '***@' + emailParts[1]

    return NextResponse.json({
      valid: true,
      message: `Valid code from ${maskedEmail}`,
      inviterId: inviter.id
    })

  } catch (error) {
    console.error('Error validating invite code:', error)
    return NextResponse.json(
      { valid: false, message: 'Failed to validate code' },
      { status: 500 }
    )
  }
}