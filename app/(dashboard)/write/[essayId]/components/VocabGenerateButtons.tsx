'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkles, CheckCircle, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface VocabGenerateButtonsProps {
  essayId: string
  initialHasParaphrase: boolean
  initialHasTopic: boolean
}

export function VocabGenerateButtons({
  essayId,
  initialHasParaphrase,
  initialHasTopic
}: VocabGenerateButtonsProps) {
  const router = useRouter()
  const [isGeneratingParaphrase, setIsGeneratingParaphrase] = useState(false)
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false)
  const [paraphraseProgress, setParaphraseProgress] = useState(0)
  const [topicProgress, setTopicProgress] = useState(0)
  const [hasParaphrase, setHasParaphrase] = useState(initialHasParaphrase)
  const [hasTopic, setHasTopic] = useState(initialHasTopic)
  const [error, setError] = useState('')

  const generateParaphrase = async () => {
    setIsGeneratingParaphrase(true)
    setParaphraseProgress(0)
    setError('')

    // Progress simulation - 8 seconds
    const interval = setInterval(() => {
      setParaphraseProgress(prev => {
        if (prev < 95) return prev + 1.19 // 95% in 8s
        return prev
      })
    }, 100)

    try {
      const response = await fetch('/api/vocabulary/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay_id: essayId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      setParaphraseProgress(100)
      setHasParaphrase(true)

      // Refresh after 500ms
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate paraphrase vocabulary')
      setParaphraseProgress(0)
    } finally {
      clearInterval(interval)
      setIsGeneratingParaphrase(false)
    }
  }

  const generateTopic = async () => {
    setIsGeneratingTopic(true)
    setTopicProgress(0)
    setError('')

    // Progress simulation - 8 seconds
    const interval = setInterval(() => {
      setTopicProgress(prev => {
        if (prev < 95) return prev + 1.19 // 95% in 8s
        return prev
      })
    }, 100)

    try {
      const response = await fetch('/api/vocabulary/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay_id: essayId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      setTopicProgress(100)
      setHasTopic(true)

      // Refresh after 500ms
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate topic vocabulary')
      setTopicProgress(0)
    } finally {
      clearInterval(interval)
      setIsGeneratingTopic(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Paraphrase Vocabulary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-ocean-700">Paraphrase Vocabulary</h4>
          {hasParaphrase ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Generated</span>
            </div>
          ) : (
            <Button
              onClick={generateParaphrase}
              disabled={isGeneratingParaphrase || isGeneratingTopic}
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-ocean-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingParaphrase ? 'Generating...' : 'Generate'}
            </Button>
          )}
        </div>
        {isGeneratingParaphrase && (
          <div className="space-y-1">
            <Progress value={paraphraseProgress} className="h-2" />
            <p className="text-xs text-ocean-600">Analyzing your essay...</p>
          </div>
        )}
      </div>

      {/* Topic Vocabulary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-ocean-700">Topic Vocabulary</h4>
          {hasTopic ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Generated</span>
            </div>
          ) : (
            <Button
              onClick={generateTopic}
              disabled={isGeneratingParaphrase || isGeneratingTopic}
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-ocean-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingTopic ? 'Generating...' : 'Generate'}
            </Button>
          )}
        </div>
        {isGeneratingTopic && (
          <div className="space-y-1">
            <Progress value={topicProgress} className="h-2" />
            <p className="text-xs text-ocean-600">Finding topic-specific vocabulary...</p>
          </div>
        )}
      </div>

      {/* View Vocabulary Button */}
      {(hasParaphrase || hasTopic) && (
        <Button
          onClick={() => router.push(`/vocabulary/${essayId}`)}
          variant="outline"
          className="w-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View Vocabulary
        </Button>
      )}
    </div>
  )
}
