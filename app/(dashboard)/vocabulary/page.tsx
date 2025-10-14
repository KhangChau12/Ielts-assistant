import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, FileText } from 'lucide-react'
import { VocabularyList } from './components/VocabularyList'

interface EssayWithVocab {
  id: string
  prompt: string
  created_at: string
  overall_score: number | null
  hasParaphraseVocab: boolean
  hasTopicVocab: boolean
  paraphraseStatus: {
    hasViewed: boolean
    quizScore: number | null
    totalQuestions: number | null
  }
  topicStatus: {
    hasViewed: boolean
    quizScore: number | null
    totalQuestions: number | null
  }
}

async function getEssaysWithVocabulary(): Promise<EssayWithVocab[]> {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all essays for the user
  const { data: essays, error: essaysError } = await supabase
    .from('essays')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (essaysError) {
    console.error('Error fetching essays:', essaysError)
    return []
  }

  if (!essays || essays.length === 0) {
    return []
  }

  // Get vocabulary, views, and quiz attempts for each essay
  const essaysWithVocab: EssayWithVocab[] = await Promise.all(
    essays.map(async (essay) => {
      // Get vocabulary
      const { data: vocab } = await supabase
        .from('vocabulary')
        .select('vocab_type')
        .eq('essay_id', essay.id)
        .eq('user_id', user.id)

      const hasParaphraseVocab = vocab?.some(v => v.vocab_type === 'paraphrase') || false
      const hasTopicVocab = vocab?.some(v => v.vocab_type === 'topic') || false

      // Get view status
      const { data: views } = await supabase
        .from('vocabulary_views')
        .select('vocab_type')
        .eq('essay_id', essay.id)
        .eq('user_id', user.id)

      const hasViewedParaphrase = views?.some(v => v.vocab_type === 'paraphrase') || false
      const hasViewedTopic = views?.some(v => v.vocab_type === 'topic') || false

      // Get latest quiz scores
      const { data: paraphraseQuiz } = await supabase
        .from('vocabulary_quiz_attempts')
        .select('score, total_questions')
        .eq('essay_id', essay.id)
        .eq('user_id', user.id)
        .eq('vocab_type', 'paraphrase')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { data: topicQuiz } = await supabase
        .from('vocabulary_quiz_attempts')
        .select('score, total_questions')
        .eq('essay_id', essay.id)
        .eq('user_id', user.id)
        .eq('vocab_type', 'topic')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...essay,
        hasParaphraseVocab,
        hasTopicVocab,
        paraphraseStatus: {
          hasViewed: hasViewedParaphrase,
          quizScore: paraphraseQuiz?.score || null,
          totalQuestions: paraphraseQuiz?.total_questions || null,
        },
        topicStatus: {
          hasViewed: hasViewedTopic,
          quizScore: topicQuiz?.score || null,
          totalQuestions: topicQuiz?.total_questions || null,
        },
      }
    })
  )

  return essaysWithVocab
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function VocabularyPage() {
  const essays = await getEssaysWithVocabulary()

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6 md:mb-8 animate-fadeInUp">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent mb-2">Vocabulary Builder</h1>
        <p className="text-sm md:text-base text-ocean-600">
          Generate and practice vocabulary from your essays
        </p>
      </div>

      {essays.length === 0 ? (
        <Card className="border-ocean-200 card-premium shadow-colored animate-fadeInUp">
          <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12 text-center px-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-gradient-to-br from-ocean-100 to-cyan-100 p-4 md:p-6 shadow-md">
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-ocean-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent">No Essays Yet</h3>
              <p className="text-sm md:text-base text-ocean-600 max-w-md px-4">
                You need to submit at least one essay before you can generate vocabulary.
                Head over to the Write page to get started!
              </p>
              <Link href="/write">
                <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white mt-4 shadow-md hover:shadow-lg transition-all text-sm md:text-base">
                  <FileText className="mr-2 h-4 w-4" />
                  Write an Essay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <VocabularyList essays={essays} />
      )}

      <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg shadow-sm animate-fadeInUp">
        <h3 className="text-base md:text-lg font-semibold bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent mb-3">About Vocabulary Builder</h3>
        <div className="text-xs md:text-sm text-ocean-700 space-y-2 md:space-y-3">
          <p>
            <strong>Paraphrase Vocabulary:</strong> Generates alternative words and phrases for vocabulary used in your essay,
            helping you expand your lexical resource.
          </p>
          <p>
            <strong>Topic Vocabulary:</strong> Provides relevant vocabulary related to your essay topic,
            enhancing your ability to discuss similar subjects.
          </p>
        </div>
      </div>
    </div>
  )
}
