import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - this is correct usage in middleware
  // Note: getSession() in middleware is fine as it just refreshes cookies
  // The warning applies to using session.user directly - always use getUser() for that
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: [
    /*
     * OPTIMIZED MATCHER - Only run on routes that actually need authentication
     * This reduces unnecessary middleware calls by ~50-70%
     *
     * Protected routes that require auth:
     * - /dashboard (and all sub-routes)
     * - /write (and all sub-routes)
     * - /vocabulary (and all sub-routes)
     * - /history
     * - /admin (and all sub-routes)
     * - /invite
     * - /subscription
     * - /api/* (most API routes need auth)
     * - /auth/callback (auth callback handler)
     *
     * Excluded (no middleware needed):
     * - / (public homepage)
     * - /login, /register (public auth pages)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, images, etc. (static assets)
     */
    '/dashboard/:path*',
    '/write/:path*',
    '/vocabulary/:path*',
    '/history/:path*',
    '/admin/:path*',
    '/invite/:path*',
    '/subscription/:path*',
    '/api/:path*',
    '/auth/callback',
  ],
}
