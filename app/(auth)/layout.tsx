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
    <>
      {children}
    </>
  )
}