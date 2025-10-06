'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function GuestBanner() {
  return (
    <Alert className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-300 shadow-sm mb-6">
      <Sparkles className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm text-amber-900 font-medium mb-1">
            Guest Mode - Your progress won't be saved
          </p>
          <p className="text-xs text-amber-700">
            Sign up FREE to save your work, track improvement with charts, and get 3 essays per day (9 total)!
          </p>
        </div>
        <Link href="/login">
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md"
          >
            Sign Up FREE
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  )
}
