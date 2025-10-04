import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { createServerClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IELTS Assistant - AI-Powered Writing Coach',
  description: 'Improve your IELTS Writing Task 2 with AI-powered scoring, feedback, and vocabulary enhancement tools.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  let user = null
  if (session?.user) {
    // Try to get profile, but fallback to session user data if profile doesn't exist yet
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, role')
      .eq('id', session.user.id)
      .single()

    user = profile || {
      email: session.user.email || '',
      role: 'student' as const
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
