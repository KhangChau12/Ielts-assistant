'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle, Clock } from 'lucide-react'

export default function WritePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [essay, setEssay] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSubmitting) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    } else {
      setElapsedTime(0)
    }
    return () => clearInterval(interval)
  }, [isSubmitting])

  // Simulate progress - 4 seconds total (Groq is fast!)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSubmitting && progress < 95) {
      interval = setInterval(() => {
        setProgress(prev => {
          // 4 seconds = 4000ms, update every 100ms = 40 updates
          // Each update = ~2.375% to reach 95% in 4s
          if (prev < 95) return prev + 2.375
          return prev
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isSubmitting, progress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!prompt.trim() || !essay.trim()) {
      setError('Please provide both a prompt and your essay.')
      return
    }

    setIsSubmitting(true)
    setProgress(0)

    try {
      const response = await fetch('/api/essays/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          essay_content: essay.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit essay')
      }

      if (data.success && data.essay?.id) {
        setProgress(100)
        setTimeout(() => {
          router.push(`/write/${data.essay.id}`)
        }, 500)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your essay')
      setIsSubmitting(false)
      setProgress(0)
    }
  }

  const wordCount = essay.trim().split(/\s+/).filter(word => word.length > 0).length
  const hasReachedTarget = wordCount >= 250

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ocean-800 mb-2">Write Your Essay</h1>
        <p className="text-ocean-600">Submit your IELTS Task 2 essay for AI-powered scoring and feedback</p>
      </div>

      <Card className="border-ocean-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200">
          <CardTitle className="text-ocean-800">Essay Submission</CardTitle>
          <CardDescription>
            Enter the essay prompt and your response below. Our AI will analyze your writing across all IELTS criteria.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-ocean-800 font-semibold text-base">
                Essay Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Enter the IELTS Task 2 question or prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] border-ocean-300 focus:border-ocean-500 focus:ring-ocean-500 resize-none"
                disabled={isSubmitting}
              />
              <p className="text-sm text-ocean-600">
                Paste the complete essay question you are responding to.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="essay" className="text-ocean-800 font-semibold text-base">
                Your Essay
              </Label>
              <Textarea
                id="essay"
                placeholder="Write or paste your IELTS Task 2 essay here..."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="min-h-[400px] border-ocean-300 focus:border-ocean-500 focus:ring-ocean-500 font-mono text-sm resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-ocean-600">
                  Aim for 250-300 words for IELTS Task 2.
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${hasReachedTarget ? 'text-green-600' : 'text-ocean-700'}`}>
                    {wordCount} words
                  </p>
                  {hasReachedTarget && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                      ✓ Target reached
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4 border-t border-ocean-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPrompt('')
                  setEssay('')
                  setError('')
                }}
                disabled={isSubmitting}
                className="border-ocean-300 text-ocean-700 hover:bg-ocean-50"
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !prompt.trim() || !essay.trim()}
                className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Submit for Scoring'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading Progress - Show below form */}
      {isSubmitting && (
        <Card className="border-ocean-200 shadow-lg mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 text-ocean-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean-800">Analyzing Your Essay</h3>
                    <p className="text-sm text-ocean-600">AI is examining your writing...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-ocean-700">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-ocean-600">
                  <span>Processing essay content...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className={`flex items-center gap-2 text-sm ${progress >= 25 ? 'text-green-600' : 'text-slate-400'}`}>
                  {progress >= 25 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span>Task Response</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${progress >= 50 ? 'text-green-600' : 'text-slate-400'}`}>
                  {progress >= 50 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span>Coherence</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${progress >= 75 ? 'text-green-600' : 'text-slate-400'}`}>
                  {progress >= 75 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span>Vocabulary</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${progress >= 95 ? 'text-green-600' : 'text-slate-400'}`}>
                  {progress >= 95 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span>Grammar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 p-5 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-ocean-800 mb-3 text-base">Scoring Criteria</h3>
        <p className="text-sm text-ocean-700 mb-3">Your essay will be evaluated on four key criteria:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-ocean-700">
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 font-bold">1.</span>
            <span><strong>Task Response:</strong> How well you address the prompt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 font-bold">2.</span>
            <span><strong>Coherence & Cohesion:</strong> Organization and flow</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 font-bold">3.</span>
            <span><strong>Lexical Resource:</strong> Vocabulary range and accuracy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 font-bold">4.</span>
            <span><strong>Grammatical Accuracy:</strong> Grammar and sentence structure</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
