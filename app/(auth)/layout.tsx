import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - IELTS4Life',
  description: 'Sign in or create an account to access IELTS4Life',
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