import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { Essay } from '@/types/essay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AlertCircle, CheckCircle2, FileText, BookOpen, ArrowRight, Sparkles } from 'lucide-react'

interface CriterionData {
  name: string
  score: number | null
  comment: string | null
  errors: string[] | null
  strengths: string[] | null
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'bg-gray-500'
  if (score >= 7) return 'bg-green-600'
  if (score >= 5.5) return 'bg-yellow-600'
  return 'bg-red-600'
}

function CriterionCard({ criterion }: { criterion: CriterionData }) {
  const hasErrors = criterion.errors && criterion.errors.length > 0
  const hasStrengths = criterion.strengths && criterion.strengths.length > 0

  return (
    <Card className="border-ocean-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-ocean-800">{criterion.name}</CardTitle>
          <Badge
            className={`${getScoreColor(criterion.score)} text-white font-bold px-3 py-1 text-sm`}
          >
            {criterion.score !== null ? criterion.score.toFixed(1) : 'N/A'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {criterion.comment && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-md p-3">
            <p className="text-sm text-ocean-700 leading-relaxed">{criterion.comment}</p>
          </div>
        )}

        {/* Strengths Section */}
        {hasStrengths && (
          <Accordion type="single" collapsible className="border border-green-200 rounded-md">
            <AccordionItem value="strengths" className="border-0">
              <AccordionTrigger className="px-4 hover:bg-green-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-ocean-800">
                    Strengths ({criterion.strengths!.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {criterion.strengths!.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Errors Section */}
        {hasErrors && (
          <Accordion type="single" collapsible className="border border-red-200 rounded-md">
            <AccordionItem value="errors" className="border-0">
              <AccordionTrigger className="px-4 hover:bg-red-50 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-ocean-800">
                    Areas for Improvement ({criterion.errors!.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-2">
                  {criterion.errors!.map((error, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {!hasErrors && !hasStrengths && (
          <div className="flex items-center gap-2 text-ocean-700 bg-ocean-50 border border-ocean-200 rounded-md p-3">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">No detailed feedback available</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function EssayResultsPage({
  params,
}: {
  params: { essayId: string }
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: essay, error } = await supabase
    .from('essays')
    .select('*')
    .eq('id', params.essayId)
    .single()

  if (error || !essay) {
    redirect('/write')
  }

  // Check if user owns this essay
  if (essay.user_id !== session.user.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      redirect('/write')
    }
  }

  const typedEssay = essay as Essay

  const criteria: CriterionData[] = [
    {
      name: 'Task Response',
      score: typedEssay.task_response_score,
      comment: typedEssay.task_response_comment,
      errors: typedEssay.task_response_errors,
      strengths: typedEssay.task_response_strengths,
    },
    {
      name: 'Coherence & Cohesion',
      score: typedEssay.coherence_cohesion_score,
      comment: typedEssay.coherence_cohesion_comment,
      errors: typedEssay.coherence_cohesion_errors,
      strengths: typedEssay.coherence_cohesion_strengths,
    },
    {
      name: 'Lexical Resource',
      score: typedEssay.lexical_resource_score,
      comment: typedEssay.lexical_resource_comment,
      errors: typedEssay.lexical_resource_errors,
      strengths: typedEssay.lexical_resource_strengths,
    },
    {
      name: 'Grammatical Accuracy',
      score: typedEssay.grammatical_accuracy_score,
      comment: typedEssay.grammatical_accuracy_comment,
      errors: typedEssay.grammatical_accuracy_errors,
      strengths: typedEssay.grammatical_accuracy_strengths,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ocean-800 mb-2">Essay Results</h1>
        <p className="text-ocean-600">Detailed scoring and feedback for your IELTS essay</p>
      </div>

      {/* Overall Score Card */}
      <Card className="border-ocean-300 shadow-lg mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-ocean-600 to-cyan-600 text-white p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 opacity-90">Overall Band Score</h2>
            <div className="text-7xl font-bold mb-2">
              {typedEssay.overall_score !== null ? typedEssay.overall_score.toFixed(1) : 'N/A'}
            </div>
            <p className="text-ocean-100 text-sm">
              IELTS Writing Task 2
            </p>
          </div>
        </div>
      </Card>

      {/* Essay Content */}
      <Card className="border-ocean-200 shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-ocean-600" />
            <CardTitle className="text-ocean-800">Your Essay</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-ocean-800 mb-2">Prompt</h3>
              <div className="bg-ocean-50 border border-ocean-200 rounded-md p-4">
                <p className="text-ocean-700 leading-relaxed">{typedEssay.prompt}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-ocean-800 mb-2">Your Response</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {typedEssay.essay_content}
                </p>
              </div>
              <p className="text-sm text-ocean-600 mt-2">
                Word count: {typedEssay.essay_content.trim().split(/\s+/).filter(word => word.length > 0).length} words
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ocean-800 mb-4">Detailed Criteria Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {criteria.map((criterion, index) => (
            <CriterionCard key={index} criterion={criterion} />
          ))}
        </div>
      </div>

      {/* Next Steps - Vocabulary */}
      <Card className="border-ocean-200 shadow-lg mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-ocean-800 text-lg mb-1">Improve Your Vocabulary</h3>
                <p className="text-sm text-ocean-600 mb-3">
                  Generate paraphrase suggestions and discover topic-specific advanced vocabulary to enhance your writing.
                </p>
                <Link href={`/vocabulary/${params.essayId}`}>
                  <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white">
                    Go to Vocabulary <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-ocean-800 mb-2">Understanding Your Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ocean-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span><strong>7.0+:</strong> Good to Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span><strong>5.5-6.5:</strong> Moderate to Competent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span><strong>&lt;5.5:</strong> Needs Improvement</span>
          </div>
        </div>
      </div>
    </div>
  )
}
