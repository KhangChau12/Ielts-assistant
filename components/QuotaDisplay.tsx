'use client'

import { useEffect, useState } from 'react'
import type { UserTier } from '@/lib/user/quota'

interface QuotaInfo {
  email: string
  tier: UserTier
  daily: {
    quota: number
    used: number
    remaining: number
  }
  total: {
    quota: number | null
    used: number
    remaining: number | null
    baseQuota?: number | null
    bonusEssays?: number
  }
}

export function QuotaDisplay() {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuota()
  }, [])

  const fetchQuota = async () => {
    try {
      const response = await fetch('/api/user/quota')
      if (response.ok) {
        const data = await response.json()
        setQuotaInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !quotaInfo) {
    return null
  }

  const isPro = quotaInfo.tier === 'pro'
  const hasRemaining = quotaInfo.daily.remaining > 0

  return (
    <div className="bg-white rounded-lg border border-ocean-200 shadow-sm px-4 py-2.5">
      <div className="flex items-center gap-3">
        {/* Tier badge */}
        <div className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
          isPro
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
            : 'bg-gradient-to-r from-ocean-100 to-cyan-100 text-ocean-700 border border-ocean-200'
        }`}>
          {isPro ? 'Pro' : 'Free'}
        </div>

        {/* Quota info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${
              hasRemaining ? 'text-ocean-800' : 'text-red-600'
            }`}>
              {quotaInfo.daily.remaining}/{quotaInfo.daily.quota}
            </span>
            <span className="text-xs text-ocean-600">essays today</span>
          </div>

          {/* Total remaining for free users */}
          {!isPro && quotaInfo.total.quota !== null && (
            <span className="text-xs text-ocean-500">
              {quotaInfo.total.remaining}/{quotaInfo.total.quota} total
              {quotaInfo.total.bonusEssays && quotaInfo.total.bonusEssays > 0 && (
                <span className="text-green-600 font-medium ml-1">
                  (+{quotaInfo.total.bonusEssays} bonus)
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
