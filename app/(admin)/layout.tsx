import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - IELTS Assistant',
  description: 'Administrative panel for IELTS Assistant',
}

export default async function AdminLayout({
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

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  )
}
