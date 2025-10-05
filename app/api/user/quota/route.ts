import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getDailyQuota, getUserTier, getTotalQuota } from '@/lib/user/quota'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile with quota info
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, daily_essays_count, last_reset_date, total_essays_count')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Reset if new day
    const today = new Date().toISOString().split('T')[0]
    let dailyCount = profile.daily_essays_count || 0

    if (profile.last_reset_date !== today) {
      dailyCount = 0
      await supabase
        .from('profiles')
        .update({
          daily_essays_count: 0,
          last_reset_date: today
        })
        .eq('id', user.id)
    }

    const dailyQuota = getDailyQuota(profile.email)
    const totalQuota = getTotalQuota(profile.email)
    const tier = getUserTier(profile.email)
    const dailyRemaining = dailyQuota - dailyCount
    const totalCount = profile.total_essays_count || 0
    const totalRemaining = totalQuota !== null ? totalQuota - totalCount : null

    return NextResponse.json({
      email: profile.email,
      tier,
      daily: {
        quota: dailyQuota,
        used: dailyCount,
        remaining: Math.max(0, dailyRemaining),
      },
      total: {
        quota: totalQuota,
        used: totalCount,
        remaining: totalRemaining !== null ? Math.max(0, totalRemaining) : null,
      },
    })
  } catch (error) {
    console.error('Error fetching quota:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    )
  }
}
