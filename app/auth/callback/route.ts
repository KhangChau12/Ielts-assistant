import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })

    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (!sessionError && session) {
      // Check if profile exists, if not create it
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (!existingProfile) {
        // Create profile for the user
        await supabase.from('profiles').insert({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata.full_name || null,
          role: 'student',
        })
      }

      // Redirect to dashboard on successful verification
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // If there's an error, redirect to login with error message
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
}
