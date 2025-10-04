'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientCardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
}

export function GradientCard({
  children,
  className,
  interactive = false,
}: GradientCardProps) {
  return (
    <div
      className={cn(
        'card-premium',
        interactive && 'card-interactive',
        className
      )}
    >
      {children}
    </div>
  )
}
