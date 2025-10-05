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

    // Fetch user's vocabulary
    const { data: vocabulary } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('user_id', user.id)

    // Fetch user's quiz attempts
    const { data: quizAttempts } = await supabase
      .from('vocabulary_quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch user's essays with scores
    const { data: essays } = await supabase
      .from('essays')
      .select('overall_score, task_response_score, coherence_cohesion_score, lexical_resource_score, grammatical_accuracy_score')
      .eq('user_id', user.id)

    // Calculate vocabulary stats
    const totalVocabulary = vocabulary?.length || 0

    // Group vocabulary by essay_id to find essays without vocabulary
    const vocabularyByEssay = vocabulary?.reduce((acc: { [key: string]: number }, vocab) => {
      if (vocab.essay_id) {
        acc[vocab.essay_id] = (acc[vocab.essay_id] || 0) + 1
      }
      return acc
    }, {}) || {}

    const { data: allEssays } = await supabase
      .from('essays')
      .select('id')
      .eq('user_id', user.id)

    const essaysWithoutVocab = allEssays?.filter(essay => !vocabularyByEssay[essay.id]).length || 0

    // Calculate quiz stats
    const totalQuizzes = quizAttempts?.length || 0
    const totalCorrectAnswers = quizAttempts?.reduce((sum, q) => sum + (q.score || 0), 0) || 0
    const totalQuestions = quizAttempts?.reduce((sum, q) => sum + (q.total_questions || 0), 0) || 0
    const avgQuizScore = totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0

    // Separate paraphrase and topic quizzes
    const paraphraseQuizzes = quizAttempts?.filter(q => q.vocab_type === 'paraphrase') || []
    const topicQuizzes = quizAttempts?.filter(q => q.vocab_type === 'topic') || []

    const paraphraseCorrect = paraphraseQuizzes.reduce((sum, q) => sum + (q.score || 0), 0)
    const paraphraseTotal = paraphraseQuizzes.reduce((sum, q) => sum + (q.total_questions || 0), 0)
    const avgParaphraseScore = paraphraseTotal > 0 ? (paraphraseCorrect / paraphraseTotal) * 100 : 0

    const topicCorrect = topicQuizzes.reduce((sum, q) => sum + (q.score || 0), 0)
    const topicTotal = topicQuizzes.reduce((sum, q) => sum + (q.total_questions || 0), 0)
    const avgTopicScore = topicTotal > 0 ? (topicCorrect / topicTotal) * 100 : 0

    // Calculate score distribution for each criterion
    const scoreDistribution = {
      overall: {} as { [key: number]: number },
      taskResponse: {} as { [key: number]: number },
      coherence: {} as { [key: number]: number },
      lexical: {} as { [key: number]: number },
      grammar: {} as { [key: number]: number },
    }

    essays?.forEach(essay => {
      if (essay.overall_score) {
        const score = Math.floor(essay.overall_score)
        scoreDistribution.overall[score] = (scoreDistribution.overall[score] || 0) + 1
      }
      if (essay.task_response_score) {
        const score = Math.floor(essay.task_response_score)
        scoreDistribution.taskResponse[score] = (scoreDistribution.taskResponse[score] || 0) + 1
      }
      if (essay.coherence_cohesion_score) {
        const score = Math.floor(essay.coherence_cohesion_score)
        scoreDistribution.coherence[score] = (scoreDistribution.coherence[score] || 0) + 1
      }
      if (essay.lexical_resource_score) {
        const score = Math.floor(essay.lexical_resource_score)
        scoreDistribution.lexical[score] = (scoreDistribution.lexical[score] || 0) + 1
      }
      if (essay.grammatical_accuracy_score) {
        const score = Math.floor(essay.grammatical_accuracy_score)
        scoreDistribution.grammar[score] = (scoreDistribution.grammar[score] || 0) + 1
      }
    })

    return NextResponse.json({
      vocabulary: {
        total: totalVocabulary,
        essaysWithoutVocab,
      },
      quiz: {
        totalAttempts: totalQuizzes,
        totalCorrect: totalCorrectAnswers,
        totalQuestions,
        avgScore: Math.round(avgQuizScore * 10) / 10,
        avgParaphraseScore: Math.round(avgParaphraseScore * 10) / 10,
        avgTopicScore: Math.round(avgTopicScore * 10) / 10,
      },
      scoreDistribution,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
