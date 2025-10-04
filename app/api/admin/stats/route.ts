import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch statistics
    const [
      { count: totalUsers },
      { count: totalEssays },
      { data: tokenUsage },
      { data: essays },
      { data: users },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('essays').select('*', { count: 'exact', head: true }),
      supabase.from('token_usage').select('*'),
      supabase.from('essays').select('overall_score, created_at').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, created_at, role').order('created_at', { ascending: false }),
    ])

    // Calculate token statistics
    const totalInputTokens = tokenUsage?.reduce((sum, t) => sum + (t.input_tokens || 0), 0) || 0
    const totalOutputTokens = tokenUsage?.reduce((sum, t) => sum + (t.output_tokens || 0), 0) || 0

    // Calculate score distribution
    const scoreDistribution: { [key: string]: number } = {}
    essays?.forEach((essay) => {
      if (essay.overall_score) {
        const score = Math.floor(essay.overall_score)
        scoreDistribution[score] = (scoreDistribution[score] || 0) + 1
      }
    })

    // Calculate average scores
    const validScores = essays?.filter((e) => e.overall_score !== null) || []
    const avgOverallScore =
      validScores.length > 0
        ? validScores.reduce((sum, e) => sum + (e.overall_score || 0), 0) / validScores.length
        : 0

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalEssays: totalEssays || 0,
      totalInputTokens,
      totalOutputTokens,
      scoreDistribution,
      avgOverallScore: Math.round(avgOverallScore * 10) / 10,
      recentUsers: users?.slice(0, 10) || [],
      essaysOverTime: essays || [],
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
