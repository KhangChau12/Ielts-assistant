import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - IELTS Assistant',
  description: 'Write and review your IELTS essays',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Allow guest access to /write page (for guest mode)
  // All other pages in (dashboard) require authentication
  const isGuestAllowed = typeof window === 'undefined' &&
    (global as any).__NEXT_ROUTER_BASEPATH !== undefined

  // For server-side, we can't easily check the current path in layout
  // So we allow the layout to render, and individual pages handle their own auth
  // Only redirect if user is missing AND it's not a guest-allowed page

  // Remove strict redirect from layout - let individual pages handle it
  // This allows /write to be accessed by guests while other pages can still require auth

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  )
}
