'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle, Clock, Crown, FileText, PenTool, Sparkles, Target, Zap, Award } from 'lucide-react'
import Link from 'next/link'
import { QuotaDisplay } from '@/components/QuotaDisplay'
import { createClient } from '@/lib/supabase/client'
import { checkGuestUsage, markGuestUsed } from '@/lib/guest-tracking'
import { getDeviceFingerprint } from '@/lib/fingerprint'
import { GuestLimitModal } from '@/components/guest/GuestLimitModal'
import { GuestBanner } from '@/components/guest/GuestBanner'

export default function WritePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [essay, setEssay] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showUpgradeButton, setShowUpgradeButton] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [showGuestLimit, setShowGuestLimit] = useState(false)
  const [existingEssayId, setExistingEssayId] = useState<string>()
  const [fingerprint, setFingerprint] = useState<string>('')

  // Check if user is guest and if they've used their trial
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsGuest(true)

        // Get fingerprint
        const fp = await getDeviceFingerprint()
        setFingerprint(fp)

        // Check if guest already used trial
        const guestCheck = await checkGuestUsage()
        if (guestCheck.hasUsed) {
          setShowGuestLimit(true)
          setExistingEssayId(guestCheck.essayId)
        }
      }
    }

    checkAuth()
  }, [])

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
          fingerprint: isGuest ? fingerprint : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if it's a guest limit error
        if (data.isGuestLimit) {
          setShowGuestLimit(true)
          setExistingEssayId(data.existingEssayId)
          setIsSubmitting(false)
          setProgress(0)
          return
        }

        // Check if it's an invalid essay error
        if (data.invalid) {
          setError(data.error || 'Please submit a valid IELTS Task 2 essay in English.')
          setIsSubmitting(false)
          setProgress(0)
          return
        }

        setShowUpgradeButton(data.showUpgradeButton || false)
        throw new Error(data.error || 'Failed to submit essay')
      }

      if (data.success && data.essay?.id) {
        // Mark guest as used if applicable
        if (data.isGuest) {
          await markGuestUsed(data.essay.id)
        }

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
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Floating shapes */}
        <div className="absolute top-20 left-1/4 h-4 w-4 rounded-full bg-cyan-400/30 animate-float" />
        <div className="absolute top-1/3 right-1/4 h-3 w-3 rounded-full bg-blue-400/30 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 h-5 w-5 rounded-full bg-sky-400/30 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative px-4">
        {/* Guest Banner */}
        {isGuest && !showGuestLimit && <GuestBanner />}

        {/* Hero Header Section */}
        <div className="mb-6 md:mb-8 space-y-4 md:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-cyan-700 shadow-lg border border-cyan-100">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            AI-Powered Essay Scoring
          </div>

          {/* Title and Quota */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 md:mb-3 leading-tight">
                Write Your <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent">Essay</span>
              </h1>
              <p className="text-base md:text-xl text-slate-600">Submit your IELTS Task 2 essay for instant AI-powered scoring</p>
            </div>
            {!isGuest && <QuotaDisplay />}
          </div>

          {/* Feature bullets */}
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 md:h-5 w-4 md:w-5 text-cyan-600" />
              <span className="text-xs md:text-sm font-medium">Instant detailed feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 md:h-5 w-4 md:w-5 text-cyan-600" />
              <span className="text-xs md:text-sm font-medium">4 IELTS criteria analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 md:h-5 w-4 md:w-5 text-cyan-600" />
              <span className="text-xs md:text-sm font-medium">Results in ~30 seconds</span>
            </div>
          </div>
        </div>

        {/* Main Essay Card */}
        <Card className="border-0 bg-gradient-to-br from-white to-sky-50/30 shadow-2xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-cyan-100 p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-2xl text-slate-900">Essay Submission</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Enter your prompt and essay below for AI analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 md:pt-8 p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Essay Prompt Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  <Label htmlFor="prompt" className="text-cyan-700 font-semibold text-base">
                    Essay Prompt
                  </Label>
                </div>
                <Textarea
                  id="prompt"
                  placeholder="Enter the IELTS Task 2 question or prompt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] border-2 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 resize-none bg-white/80 backdrop-blur-sm rounded-xl text-base"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-cyan-600">💡</span>
                  Paste the complete essay question you are responding to
                </p>
              </div>

              {/* Your Essay Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-cyan-600" />
                  <Label htmlFor="essay" className="text-cyan-700 font-semibold text-base">
                    Your Essay
                  </Label>
                </div>
                <Textarea
                  id="essay"
                  placeholder="Write or paste your IELTS Task 2 essay here..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  className="min-h-[400px] border-2 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 font-mono text-sm resize-none bg-white/80 backdrop-blur-sm rounded-xl"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-600">
                    Aim for 250-300 words for IELTS Task 2
                  </p>
                  <div className="flex items-center gap-3">
                    <p className={`text-base font-bold ${hasReachedTarget ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {wordCount} words
                    </p>
                    {hasReachedTarget && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
                        <CheckCircle className="h-3 w-3" />
                        Target reached
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className={`p-4 border-2 rounded-xl space-y-3 ${
                  error.includes('valid IELTS')
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {error.includes('valid IELTS') && (
                      <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        error.includes('valid IELTS') ? 'text-amber-900' : 'text-red-800'
                      }`}>
                        {error.includes('valid IELTS') ? 'Invalid Essay Format' : 'Error'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        error.includes('valid IELTS') ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {error}
                      </p>
                      {error.includes('valid IELTS') && (
                        <ul className="text-xs text-amber-600 mt-2 space-y-1">
                          <li>• Essay must be in English</li>
                          <li>• Length should be 150-500 words</li>
                          <li>• Must address the given IELTS Task 2 prompt</li>
                        </ul>
                      )}
                    </div>
                  </div>
                  {showUpgradeButton && (
                    <Link href="/subscription">
                      <Button
                        type="button"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        Learn More About Pro
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6 border-t border-cyan-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPrompt('')
                    setEssay('')
                    setError('')
                  }}
                  disabled={isSubmitting}
                  className="border-2 border-cyan-200 text-slate-700 hover:bg-cyan-50 px-4 py-3 md:px-6 md:py-5 text-sm md:text-base rounded-xl"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !prompt.trim() || !essay.trim()}
                  className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 px-6 py-3 md:px-10 md:py-5 text-sm md:text-base font-bold rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 md:h-5 w-4 md:w-5 animate-spin" />
                      <span className="hidden sm:inline">Analyzing Essay...</span>
                      <span className="sm:hidden">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 md:h-5 w-4 md:w-5 animate-pulse" />
                      Score My Essay
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading Progress - Show below form */}
        {isSubmitting && (
          <Card className="border-cyan-200 shadow-xl mt-6 bg-gradient-to-br from-white to-cyan-50/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Analyzing Your Essay</h3>
                      <p className="text-sm text-slate-600">AI is examining your writing...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 bg-white/60 px-3 py-1.5 rounded-full border border-cyan-200">
                    <Clock className="h-4 w-4 text-cyan-600" />
                    <span className="font-mono font-medium">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Processing essay content...</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className={`flex items-center gap-2 text-sm ${progress >= 25 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {progress >= 25 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                    <span>Task Response</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${progress >= 50 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {progress >= 50 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                    <span>Coherence</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${progress >= 75 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {progress >= 75 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                    <span>Vocabulary</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${progress >= 95 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {progress >= 95 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                    <span>Grammar</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-200 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-base md:text-lg">IELTS Scoring Criteria</h3>
          </div>
          <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">Your essay will be evaluated on four key criteria:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-cyan-100">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-cyan-100 text-cyan-700 font-bold text-sm flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Task Response</p>
                <p className="text-xs text-slate-600">How well you address the prompt</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-cyan-100">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Coherence & Cohesion</p>
                <p className="text-xs text-slate-600">Organization and logical flow</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-cyan-100">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-100 text-sky-700 font-bold text-sm flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Lexical Resource</p>
                <p className="text-xs text-slate-600">Vocabulary range and accuracy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-cyan-100">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-100 text-teal-700 font-bold text-sm flex-shrink-0">4</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Grammatical Accuracy</p>
                <p className="text-xs text-slate-600">Grammar and sentence structure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Limit Modal */}
        <GuestLimitModal
          open={showGuestLimit}
          onOpenChange={setShowGuestLimit}
          existingEssayId={existingEssayId}
        />
      </div>
    </div>
  )
}
