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

  if (authError || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  )
}
