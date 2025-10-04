'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Loader2, Sparkles, Lightbulb, Clock, CheckCircle, Eye, Target, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

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
  }
  topicStatus: {
    hasViewed: boolean
    quizScore: number | null
  }
}

interface VocabularyListProps {
  essays: EssayWithVocab[]
}

export function VocabularyList({ essays }: VocabularyListProps) {
  const router = useRouter()
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [progress, setProgress] = useState<{ [key: string]: number }>({})
  const [elapsedTime, setElapsedTime] = useState<{ [key: string]: number }>({})
  const [currentLoadingKey, setCurrentLoadingKey] = useState<string | null>(null)

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentLoadingKey) {
      interval = setInterval(() => {
        setElapsedTime(prev => ({
          ...prev,
          [currentLoadingKey]: (prev[currentLoadingKey] || 0) + 1
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentLoadingKey])

  // Simulate progress - 10 seconds total for vocabulary
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentLoadingKey && (progress[currentLoadingKey] || 0) < 95) {
      interval = setInterval(() => {
        setProgress(prev => {
          const current = prev[currentLoadingKey] || 0
          // 10 seconds = 10000ms, update every 150ms = ~67 updates
          // Each update = ~1.4% to reach 95% in 10s
          if (current < 95) {
            return { ...prev, [currentLoadingKey]: current + 1.4 }
          }
          return prev
        })
      }, 150)
    }
    return () => clearInterval(interval)
  }, [currentLoadingKey, progress])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number = 120): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const getStatusBadge = (status: { hasViewed: boolean; quizScore: number | null }, hasVocab: boolean) => {
    if (!hasVocab) return null

    if (status.quizScore !== null) {
      return (
        <Badge className="bg-green-600 text-white border-green-700">
          <Award className="h-3 w-3 mr-1" />
          {status.quizScore}/20
        </Badge>
      )
    }

    if (status.hasViewed) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
          <Eye className="h-3 w-3 mr-1" />
          Viewed
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="border-slate-300 text-slate-600">
        <Target className="h-3 w-3 mr-1" />
        Not viewed
      </Badge>
    )
  }

  const handleGenerateVocab = async (essayId: string, type: 'paraphrase' | 'topic') => {
    const key = `${essayId}-${type}`
    setLoadingStates(prev => ({ ...prev, [key]: true }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    setCurrentLoadingKey(key)
    setProgress(prev => ({ ...prev, [key]: 0 }))
    setElapsedTime(prev => ({ ...prev, [key]: 0 }))

    try {
      const endpoint = type === 'paraphrase'
        ? '/api/vocabulary/paraphrase'
        : '/api/vocabulary/topic'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essay_id: essayId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate vocabulary')
      }

      setProgress(prev => ({ ...prev, [key]: 100 }))
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error('Error generating vocabulary:', error)
      setErrors(prev => ({
        ...prev,
        [key]: error instanceof Error ? error.message : 'Failed to generate vocabulary'
      }))
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }))
      setCurrentLoadingKey(null)
    }
  }

  return (
    <div className="space-y-4">
      {essays.map((essay) => {
        const paraphraseKey = `${essay.id}-paraphrase`
        const topicKey = `${essay.id}-topic`
        const paraphraseLoading = loadingStates[paraphraseKey]
        const topicLoading = loadingStates[topicKey]

        return (
          <Card key={essay.id} className="border-ocean-200 card-premium shadow-colored hover-lift animate-fadeInUp">
            <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent mb-2">
                    {truncateText(essay.prompt)}
                  </CardTitle>
                  <CardDescription className="text-ocean-600">
                    Submitted on {formatDate(essay.created_at)}
                    {essay.overall_score && (
                      <span className="ml-3 text-ocean-700 font-semibold">
                        Overall Score: {essay.overall_score}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  {essay.hasParaphraseVocab && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ocean-600 font-medium">Paraphrase:</span>
                      {getStatusBadge(essay.paraphraseStatus, essay.hasParaphraseVocab)}
                    </div>
                  )}
                  {essay.hasTopicVocab && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cyan-600 font-medium">Topic:</span>
                      {getStatusBadge(essay.topicStatus, essay.hasTopicVocab)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Buttons - always show */}
                <div className="flex flex-wrap gap-3">
                  {/* View Vocabulary Button - shown if any vocab exists */}
                  {(essay.hasParaphraseVocab || essay.hasTopicVocab) && (
                    <Link href={`/vocabulary/${essay.id}`}>
                      <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Vocabulary
                      </Button>
                    </Link>
                  )}

                  {/* Generate Paraphrase Button */}
                  {!essay.hasParaphraseVocab && (
                    <Button
                      onClick={() => handleGenerateVocab(essay.id, 'paraphrase')}
                      disabled={paraphraseLoading}
                      variant="outline"
                      className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 hover:border-ocean-400 shadow-sm hover:shadow-md transition-all"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Paraphrase Vocab
                    </Button>
                  )}

                  {/* Generate Topic Button */}
                  {!essay.hasTopicVocab && (
                    <Button
                      onClick={() => handleGenerateVocab(essay.id, 'topic')}
                      disabled={topicLoading}
                      variant="outline"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400 shadow-sm hover:shadow-md transition-all"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Topic Vocab
                    </Button>
                  )}

                  {/* Status if both exist */}
                  {essay.hasParaphraseVocab && essay.hasTopicVocab && (
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      All vocabulary generated
                    </div>
                  )}
                </div>

                {/* Loading State - show below buttons */}
                {(paraphraseLoading || topicLoading) && (
                  <Card className="border-ocean-300 bg-gradient-to-br from-ocean-50 to-cyan-50">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-ocean-800">
                            Generating {paraphraseLoading ? 'Paraphrase' : 'Topic'} Vocabulary
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-ocean-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {Math.floor((elapsedTime[paraphraseLoading ? paraphraseKey : topicKey] || 0) / 60)}:
                              {((elapsedTime[paraphraseLoading ? paraphraseKey : topicKey] || 0) % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        <Progress value={progress[paraphraseLoading ? paraphraseKey : topicKey] || 0} className="h-2" />
                        <div className="grid grid-cols-3 gap-3">
                          <div className={`flex items-center gap-2 text-sm ${(progress[paraphraseLoading ? paraphraseKey : topicKey] || 0) >= 33 ? 'text-green-600' : 'text-slate-400'}`}>
                            {(progress[paraphraseLoading ? paraphraseKey : topicKey] || 0) >= 33 ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-current" />
                            )}
                            <span>Analyzing</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${(progress[paraphraseLoading ? paraphraseKey : topicKey] || 0) >= 66 ? 'text-green-600' : 'text-slate-400'}`}>
                            {(progress[paraphraseLoading ? paraphraseKey : topicKey] || 0) >= 66 ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-current" />
                            )}
                            <span>Processing</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${(progress[paraphraseLoading ? paraphraseKey : topicKey] || 0) >= 95 ? 'text-green-600' : 'text-slate-400'}`}>
                            {(progress[paraphraseLoading ? paraphraseKey : topicKey] || 0) >= 95 ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-current" />
                            )}
                            <span>Finalizing</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Error Messages */}
                {errors[paraphraseKey] && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    {errors[paraphraseKey]}
                  </div>
                )}
                {errors[topicKey] && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    {errors[topicKey]}
                  </div>
                )}

                {/* Info Box */}
                {!essay.hasParaphraseVocab || !essay.hasTopicVocab ? (
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 text-sm text-cyan-800 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold mb-2 text-cyan-700">
                      <Lightbulb className="w-4 h-4" />
                      <span>Vocabulary Types:</span>
                    </div>
                    <ul className="space-y-2 ml-6 list-disc text-cyan-900">
                      <li><strong>Paraphrase:</strong> Suggests better alternatives for low-level words in your essay</li>
                      <li><strong>Topic:</strong> Provides C1-C2 vocabulary specific to this essay's topic</li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
