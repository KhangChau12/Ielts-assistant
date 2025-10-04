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

    // Fetch statistics
    const [
      { count: totalUsers },
      { count: totalEssays },
      { data: tokenUsage },
      { data: essays },
      { data: users },
      { count: totalVocabulary },
      { data: quizAttempts },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('essays').select('*', { count: 'exact', head: true }),
      supabase.from('token_usage').select('*'),
      supabase.from('essays').select('overall_score, created_at').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, created_at, role').order('created_at', { ascending: false }),
      supabase.from('vocabulary').select('*', { count: 'exact', head: true }),
      supabase.from('vocabulary_quiz_attempts').select('score, total_questions, vocab_type, created_at'),
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

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalEssays: totalEssays || 0,
      totalInputTokens,
      totalOutputTokens,
      scoreDistribution,
      avgOverallScore: Math.round(avgOverallScore * 10) / 10,
      recentUsers: users?.slice(0, 10) || [],
      essaysOverTime: essays || [],
      // Vocabulary stats
      totalVocabulary: totalVocabulary || 0,
      totalQuizAttempts: quizAttempts?.length || 0,
      totalCorrectAnswers,
      totalQuestions,
      avgQuizScore: Math.round(avgQuizScore * 10) / 10,
      avgParaphraseScore: Math.round(avgParaphraseScore * 10) / 10,
      avgTopicScore: Math.round(avgTopicScore * 10) / 10,
      quizAttemptsOverTime,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
