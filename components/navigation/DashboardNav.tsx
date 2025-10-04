'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, BookOpen, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/write',
      label: 'Write Essay',
      icon: FileText,
    },
    {
      href: '/vocabulary',
      label: 'Vocabulary',
      icon: BookOpen,
    },
  ]

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b border-ocean-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent">
              IELTS Assistant
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={
                      isActive
                        ? 'bg-gradient-to-r from-ocean-600 to-cyan-600 text-white'
                        : 'text-ocean-700 hover:bg-ocean-50'
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-red-600 hover:bg-red-50 ml-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
