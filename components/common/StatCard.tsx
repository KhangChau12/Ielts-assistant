'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'
import { GradientCard } from './GradientCard'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  trend?: 'up' | 'down'
  trendValue?: number
  decimals?: number
  suffix?: string
  className?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  decimals = 0,
  suffix = '',
  className,
}: StatCardProps) {
  return (
    <GradientCard className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Icon className="h-5 w-5 text-ocean-500" />
            <p className="text-sm font-medium">{label}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">
              <AnimatedNumber value={value} decimals={decimals} />
              {suffix && <span className="text-2xl ml-1">{suffix}</span>}
            </h3>
          </div>

          {trend && trendValue !== undefined && (
            <div className="flex items-center gap-1 mt-3">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                <AnimatedNumber value={trendValue} decimals={1} />%
              </span>
              <span className="text-xs text-slate-500 ml-1">vs last period</span>
            </div>
          )}
        </div>

        <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </GradientCard>
  )
}
