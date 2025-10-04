import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, BrainCircuit, ArrowLeft } from 'lucide-react'
import type { VocabularyItem } from '@/types/vocabulary'
import type { Essay } from '@/types/essay'
import { HighlightedEssay } from './components/HighlightedEssay'

interface VocabularyPageProps {
  params: {
    essayId: string
  }
}

async function getVocabularyData(essayId: string) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get the essay
  const { data: essay, error: essayError } = await supabase
    .from('essays')
    .select('*')
    .eq('id', essayId)
    .eq('user_id', user.id)
    .single()

  if (essayError || !essay) {
    notFound()
  }

  // Get all vocabulary for this essay
  const { data: vocabulary, error: vocabError } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('essay_id', essayId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (vocabError) {
    console.error('Error fetching vocabulary:', vocabError)
    return { essay, paraphraseVocab: [], topicVocab: [] }
  }

  const paraphraseVocab = vocabulary?.filter(v => v.vocab_type === 'paraphrase') || []
  const topicVocab = vocabulary?.filter(v => v.vocab_type === 'topic') || []

  return {
    essay,
    paraphraseVocab,
    topicVocab,
  }
}

function VocabCard({ item }: { item: VocabularyItem }) {
  return (
    <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all">
      <CardContent className="pt-6">
        <div className="space-y-2">
          {item.original_word && (
            <div>
              <p className="text-xs text-ocean-600 uppercase tracking-wider">Original</p>
              <p className="text-sm text-ocean-700 font-medium">{item.original_word}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-ocean-600 uppercase tracking-wider">
              {item.original_word ? 'Suggested' : 'Word'}
            </p>
            <p className="text-lg font-bold bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">{item.suggested_word}</p>
          </div>
          <div>
            <p className="text-xs text-ocean-600 uppercase tracking-wider">Definition</p>
            <p className="text-sm text-ocean-700">{item.definition}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function VocabularyDetailPage({ params }: VocabularyPageProps) {
  const { essay, paraphraseVocab, topicVocab } = await getVocabularyData(params.essayId)

  const hasParaphraseVocab = paraphraseVocab.length > 0
  const hasTopicVocab = topicVocab.length > 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fadeInUp">
        <Link href="/vocabulary">
          <Button variant="ghost" className="mb-4 text-ocean-600 hover:text-ocean-800 hover:bg-ocean-50 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vocabulary
          </Button>
        </Link>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent mb-2">Vocabulary</h1>
        <p className="text-ocean-600">
          {essay.prompt.length > 150 ? essay.prompt.substring(0, 150) + '...' : essay.prompt}
        </p>
      </div>

      {/* No vocabulary state */}
      {!hasParaphraseVocab && !hasTopicVocab && (
        <Card className="card-premium shadow-colored animate-fadeInUp">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-gradient-to-br from-ocean-500 to-cyan-600 p-6 shadow-lg">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">No Vocabulary Generated</h3>
              <p className="text-ocean-600 max-w-md">
                Generate vocabulary for this essay to start practicing.
              </p>
              <Link href="/vocabulary">
                <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white mt-4 shadow-md hover:shadow-colored transition-all">
                  Generate Vocabulary
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs with vocabulary */}
      {(hasParaphraseVocab || hasTopicVocab) && (
        <Tabs defaultValue={hasParaphraseVocab ? 'paraphrase' : 'topic'} className="w-full animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-ocean-100 shadow-subtle">
            <TabsTrigger
              value="paraphrase"
              disabled={!hasParaphraseVocab}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all"
            >
              Paraphrase ({paraphraseVocab.length})
            </TabsTrigger>
            <TabsTrigger
              value="topic"
              disabled={!hasTopicVocab}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white transition-all"
            >
              Topic ({topicVocab.length})
            </TabsTrigger>
          </TabsList>

          {/* Paraphrase Tab */}
          <TabsContent value="paraphrase" className="mt-6">
            <div className="space-y-6">
              {/* Original Essay with Highlights */}
              <HighlightedEssay
                essayContent={essay.essay_content}
                vocabularyItems={paraphraseVocab}
              />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/vocabulary/${params.essayId}/flashcards?type=paraphrase`}>
                  <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create Flashcards
                  </Button>
                </Link>
                <Link href={`/vocabulary/${params.essayId}/quiz?type=paraphrase`}>
                  <Button variant="outline" className="border-ocean-300 text-ocean-700 hover:bg-ocean-50">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Start Quiz
                  </Button>
                </Link>
              </div>

              {/* Vocabulary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paraphraseVocab.map((item) => (
                  <VocabCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Topic Tab */}
          <TabsContent value="topic" className="mt-6">
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/vocabulary/${params.essayId}/flashcards?type=topic`}>
                  <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white shadow-md hover:shadow-colored transition-all">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create Flashcards
                  </Button>
                </Link>
                <Link href={`/vocabulary/${params.essayId}/quiz?type=topic`}>
                  <Button variant="outline" className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 transition-all">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Start Quiz
                  </Button>
                </Link>
              </div>

              {/* Vocabulary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topicVocab.map((item) => (
                  <VocabCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg shadow-subtle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-semibold text-ocean-800 mb-2">Learning Tips</h3>
        <ul className="text-sm text-ocean-700 space-y-1">
          <li className="flex items-start">
            <span className="text-cyan-600 mr-2">•</span>
            <span>Use flashcards for spaced repetition learning</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-600 mr-2">•</span>
            <span>Take quizzes to test your retention</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-600 mr-2">•</span>
            <span>Practice using new vocabulary in your own sentences</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
