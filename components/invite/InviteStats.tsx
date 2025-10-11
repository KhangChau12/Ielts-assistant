'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Gift, TrendingUp } from 'lucide-react'
import { INVITE_BONUSES } from '@/lib/invite/utils'

interface InviteStatsProps {
  totalInvited: number
  bonusEssays: number
}

export function InviteStats({ totalInvited, bonusEssays }: InviteStatsProps) {
  const potentialEssays = totalInvited * INVITE_BONUSES.INVITER

  return (
    <Card className="border-ocean-200">
      <CardHeader>
        <CardTitle className="text-ocean-800">Your Stats</CardTitle>
        <CardDescription>Track your invitation progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ocean-100 mb-2">
              <Users className="h-6 w-6 text-ocean-600" />
            </div>
            <p className="text-2xl font-bold text-ocean-800">{totalInvited}</p>
            <p className="text-xs text-ocean-600">Friends Invited</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 mb-2">
              <Gift className="h-6 w-6 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold text-cyan-700">{bonusEssays}</p>
            <p className="text-xs text-ocean-600">Essays Earned</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ocean-100 mb-2">
              <TrendingUp className="h-6 w-6 text-ocean-700" />
            </div>
            <p className="text-2xl font-bold text-ocean-700">{potentialEssays}</p>
            <p className="text-xs text-ocean-600">Total Earned</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-ocean-600">
            <span>Next milestone</span>
            <span>{totalInvited < 5 ? `${5 - totalInvited} more to go` : 'Achieved!'}</span>
          </div>
          <div className="w-full bg-ocean-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-ocean-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalInvited / 5) * 100, 100)}%` }}
            />
          </div>
          {totalInvited >= 5 && (
            <p className="text-xs text-cyan-600 text-center font-medium mt-2">
              Amazing! You have invited 5+ friends
            </p>
          )}
        </div>

        <div className="mt-6 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
          <h4 className="text-xs font-semibold text-cyan-900 mb-1">Pro tip:</h4>
          <p className="text-xs text-cyan-700">
            {totalInvited === 0 && 'Start by sharing your code with classmates preparing for IELTS'}
            {totalInvited > 0 && totalInvited < 3 && 'You are doing great! Keep sharing to unlock more essays'}
            {totalInvited >= 3 && 'Excellent work! Your network is growing'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
