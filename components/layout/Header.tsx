'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Home, FileText, BookOpen, User, LogOut, Settings, History, Crown, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  user?: {
    email: string
    role: 'student' | 'admin'
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  // Check if user is Pro (PTNK email)
  const isPro = user?.email.endsWith('@ptnk.edu.vn') || false

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-ocean-900 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">IELTS4Life</span>
        </Link>

        {/* Navigation */}
        <TooltipProvider>
          <nav className="flex items-center space-x-1">
            {/* Dashboard - Show for all, tooltip for guests */}
            {user ? (
              <Link href="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                  className={isActive('/dashboard') ? 'text-ocean-700' : 'text-white hover:bg-ocean-800'}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      className="text-white/60 hover:bg-ocean-800 cursor-not-allowed"
                      disabled
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Sign up to access Dashboard & track your progress</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Write Essay - Always accessible */}
            <Link href="/write">
              <Button
                variant={isActive('/write') ? 'secondary' : 'ghost'}
                className={isActive('/write') ? 'text-ocean-700' : 'text-white hover:bg-ocean-800'}
              >
                <FileText className="mr-2 h-4 w-4" />
                Write Essay
              </Button>
            </Link>

            {/* History - Show for all, tooltip for guests */}
            {user ? (
              <Link href="/history">
                <Button
                  variant={isActive('/history') ? 'secondary' : 'ghost'}
                  className={isActive('/history') ? 'text-ocean-700' : 'text-white hover:bg-ocean-800'}
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
              </Link>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      className="text-white/60 hover:bg-ocean-800 cursor-not-allowed"
                      disabled
                    >
                      <History className="mr-2 h-4 w-4" />
                      History
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Sign up to access History & review past essays</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Vocabulary - Show for all, tooltip for guests */}
            {user ? (
              <Link href="/vocabulary">
                <Button
                  variant={isActive('/vocabulary') ? 'secondary' : 'ghost'}
                  className={isActive('/vocabulary') ? 'text-ocean-700' : 'text-white hover:bg-ocean-800'}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Vocabulary
                </Button>
              </Link>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      className="text-white/60 hover:bg-ocean-800 cursor-not-allowed"
                      disabled
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Vocabulary
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Sign up to access your Vocabulary collection</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Invite - Show for Free tier users only (not Pro/PTNK) */}
            {user && !isPro && (
              <Link href="/invite">
                <Button
                  variant={isActive('/invite') ? 'secondary' : 'ghost'}
                  className={isActive('/invite') ? 'text-ocean-700' : 'text-white hover:bg-ocean-800'}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              </Link>
            )}

            {/* Admin - Show for admin only */}
            {user?.role === 'admin' && (
              <Link href="/admin">
                <Button
                  variant={isActive('/admin') ? 'secondary' : 'ghost'}
                  className={isActive('/admin') ? 'text-ocean-700' : 'text-white hover:bg-ocean-800'}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </TooltipProvider>

        {/* User Menu or Auth Buttons */}
        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-ocean-800">
                  <User className="mr-2 h-4 w-4" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm text-slate-600">
                  {user.role === 'admin' ? 'Administrator' : 'Student'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="cursor-pointer">
                    <Crown className="mr-2 h-4 w-4" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-ocean-800">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
