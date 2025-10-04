import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - IELTS Assistant',
  description: 'Sign in or create an account to access IELTS Assistant',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
