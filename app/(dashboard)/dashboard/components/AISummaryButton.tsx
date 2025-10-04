'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import type { ErrorSummary } from '@/types/user'

export function AISummaryButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<ErrorSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate summary')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      console.error('Error generating summary:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-cyan-600 to-ocean-600 hover:from-cyan-700 hover:to-ocean-700 text-white"
          onClick={handleGenerateSummary}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ocean-800 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-600" />
            AI Performance Summary
          </DialogTitle>
          <DialogDescription>
            Get personalized insights and recommendations based on your recent essays
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-cyan-600 animate-spin mb-4" />
            <p className="text-ocean-700 font-medium">Analyzing your essays...</p>
            <p className="text-ocean-600 text-sm mt-2">This may take a few moments</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && summary && (
          <div className="space-y-6">
            {/* Overall Summary */}
            <Card className="border-ocean-200 bg-gradient-to-br from-cyan-50 to-ocean-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-ocean-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                  Overall Summary
                </h3>
                <p className="text-ocean-700 leading-relaxed">{summary.summary}</p>
              </CardContent>
            </Card>

            {/* Strengths */}
            {summary.strengths && summary.strengths.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {summary.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-green-800"
                      >
                        <Badge className="bg-green-600 text-white mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="flex-1">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {summary.weaknesses && summary.weaknesses.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-orange-600" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {summary.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-orange-800"
                      >
                        <Badge className="bg-orange-600 text-white mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="flex-1">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {summary.recommendations && summary.recommendations.length > 0 && (
              <Card className="border-cyan-200 bg-cyan-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {summary.recommendations.map((recommendation, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-cyan-800"
                      >
                        <Badge className="bg-cyan-600 text-white mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="flex-1">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!isLoading && !error && !summary && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-ocean-300 mx-auto mb-4" />
            <p className="text-ocean-600">Click the button above to generate your AI summary</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
