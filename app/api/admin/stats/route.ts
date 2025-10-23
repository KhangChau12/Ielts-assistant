import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate date range for 14 days ago
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    fourteenDaysAgo.setHours(0, 0, 0, 0)
    const fourteenDaysAgoISO = fourteenDaysAgo.toISOString()

    // Fetch statistics
    const [
      { count: totalUsers },
      { count: totalEssays },
      { data: tokenUsage },
      { data: allEssaysForScoring },
      { data: essaysLast14Days },
      { data: recentUsers },
      { data: allUsers },
      { count: totalVocabulary },
      { data: quizAttempts },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('essays').select('*', { count: 'exact', head: true }),
      supabase.from('token_usage').select('*'),
      // Get all essays for score distribution and average
      supabase.from('essays').select('overall_score').order('created_at', { ascending: false }),
      // Get essays from last 14 days for chart
      supabase.from('essays').select('created_at').gte('created_at', fourteenDaysAgoISO).order('created_at', { ascending: true }),
      // Get recent 10 users for table
      supabase.from('profiles').select('id, email, created_at, role').order('created_at', { ascending: false }).limit(10),
      // Get all users for growth chart and counts
      supabase.from('profiles').select('id, email, created_at').order('created_at', { ascending: true }),
      supabase.from('vocabulary').select('*', { count: 'exact', head: true }),
      supabase.from('vocabulary_quiz_attempts').select('score, total_questions, vocab_type, created_at'),
    ])

    // Calculate token statistics
    const totalInputTokens = tokenUsage?.reduce((sum, t) => sum + (t.input_tokens || 0), 0) || 0
    const totalOutputTokens = tokenUsage?.reduce((sum, t) => sum + (t.output_tokens || 0), 0) || 0

    // Calculate score distribution (merge Band 8 & 9)
    const scoreDistribution: { [key: string]: number } = {}
    allEssaysForScoring?.forEach((essay) => {
      if (essay.overall_score) {
        const score = Math.floor(essay.overall_score)
        // Merge Band 8 and 9 together
        const displayScore = score >= 8 ? 8 : score
        scoreDistribution[displayScore] = (scoreDistribution[displayScore] || 0) + 1
      }
    })

    // Calculate average scores
    const validScores = allEssaysForScoring?.filter((e) => e.overall_score !== null) || []
    const avgOverallScore =
      validScores.length > 0
        ? validScores.reduce((sum, e) => sum + (e.overall_score || 0), 0) / validScores.length
        : 0

    // Calculate vocabulary statistics
    const totalCorrectAnswers = quizAttempts?.reduce((sum, q) => sum + (q.score || 0), 0) || 0
    const totalQuestions = quizAttempts?.reduce((sum, q) => sum + (q.total_questions || 0), 0) || 0
    const avgQuizScore = totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0

    // Quiz performance by vocab type
    const paraphraseQuizzes = quizAttempts?.filter(q => q.vocab_type === 'paraphrase') || []
    const topicQuizzes = quizAttempts?.filter(q => q.vocab_type === 'topic') || []

    const paraphraseCorrect = paraphraseQuizzes.reduce((sum, q) => sum + (q.score || 0), 0)
    const paraphraseTotal = paraphraseQuizzes.reduce((sum, q) => sum + (q.total_questions || 0), 0)
    const avgParaphraseScore = paraphraseTotal > 0 ? (paraphraseCorrect / paraphraseTotal) * 100 : 0

    const topicCorrect = topicQuizzes.reduce((sum, q) => sum + (q.score || 0), 0)
    const topicTotal = topicQuizzes.reduce((sum, q) => sum + (q.total_questions || 0), 0)
    const avgTopicScore = topicTotal > 0 ? (topicCorrect / topicTotal) * 100 : 0

    // Quiz attempts over time
    const quizAttemptsOverTime = quizAttempts?.map(q => ({
      score: q.score,
      total_questions: q.total_questions,
      vocab_type: q.vocab_type,
      created_at: q.created_at,
      percentage: q.total_questions > 0 ? (q.score / q.total_questions) * 100 : 0
    })) || []

    // Calculate user tier statistics
    const ptnkUsers = allUsers?.filter(u => u.email?.endsWith('@ptnk.edu.vn')).length || 0
    // Pro users who are NOT PTNK (future paid subscribers)
    const paidProUsers = 0 // Currently we don't have paid subscriptions yet

    // User growth over last 14 days (CUMULATIVE - total users up to each day)
    const today = new Date()
    const userGrowthData: Array<{ date: string; count: number }> = []

    // Generate 14 days range
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(23, 59, 59, 999) // End of day
      const dateKey = date.toISOString().split('T')[0]

      // Count all users created up to this date (cumulative)
      const count = allUsers?.filter(user => {
        const userDate = new Date(user.created_at)
        return userDate <= date
      }).length || 0

      userGrowthData.push({ date: dateKey, count })
    }

    // Essays over time - last 14 days (CUMULATIVE)
    const essaysGrowthData: Array<{ date: string; count: number }> = []

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(23, 59, 59, 999)
      const dateKey = date.toISOString().split('T')[0]

      // Count all essays created up to this date (cumulative)
      const count = essaysLast14Days?.filter(essay => {
        const essayDate = new Date(essay.created_at)
        return essayDate <= date
      }).length || 0

      essaysGrowthData.push({ date: dateKey, count })
    }

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      ptnkUsers,
      paidProUsers,
      totalEssays: totalEssays || 0,
      totalInputTokens,
      totalOutputTokens,
      scoreDistribution,
      avgOverallScore: Math.round(avgOverallScore * 10) / 10,
      recentUsers: recentUsers || [],
      essaysOverTime: essaysGrowthData,
      // Vocabulary stats
      totalVocabulary: totalVocabulary || 0,
      totalQuizAttempts: quizAttempts?.length || 0,
      totalCorrectAnswers,
      totalQuestions,
      avgQuizScore: Math.round(avgQuizScore * 10) / 10,
      avgParaphraseScore: Math.round(avgParaphraseScore * 10) / 10,
      avgTopicScore: Math.round(avgTopicScore * 10) / 10,
      quizAttemptsOverTime,
      usersOverTime: userGrowthData,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
