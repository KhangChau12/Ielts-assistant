'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, CheckCircle2, AlertCircle, Target } from 'lucide-react'

interface GrammarImprovement {
  type: 'sentence_combining' | 'error_correction' | 'variety_suggestion'
  original?: string
  improved?: string
  explanation?: string
  impact?: string
  location?: string
  error?: string
  correction?: string
  rule?: string
  severity?: 'MAJOR' | 'MINOR'
  observation?: string
  missing_structures?: string[]
  try_next?: string
}

interface CoherenceImprovement {
  type: 'transition_missing' | 'positive_feedback' | 'sentence_connection'
  location?: string
  issue?: string
  suggestion?: string
  impact?: string
  strength?: string
  keep_doing?: string
  current?: string
  smoother?: string
  why?: string
}

interface TaskResponseDepth {
  type: 'underdeveloped_idea' | 'missing_element' | 'positive_feedback'
  location?: string
  idea?: string
  issue?: string
  how_to_develop?: string
  why_important?: string
  requirement?: string
  missing?: string
  fix?: string
  impact?: string
  strength?: string
  evidence?: string
  keep_doing?: string
}

interface OverallAssessment {
  first_impression: string
  strongest_aspect: string
  maintain_this: string
  priority_fixes: string[]
  next_essay_goals: {
    grammar?: string
    structure?: string
    task?: string
    vocabulary?: string
  }
  encouragement: string
}

interface DetailedGuidanceData {
  grammar_improvements?: GrammarImprovement[]
  coherence_improvements?: CoherenceImprovement[]
  task_response_depth?: TaskResponseDepth[]
  overall_assessment?: OverallAssessment
}

interface DetailedGuidanceProps {
  essayId: string
  hasImprovedEssay: boolean
  initialGuidance?: DetailedGuidanceData | null
}

export function DetailedGuidance({ essayId, hasImprovedEssay, initialGuidance }: DetailedGuidanceProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [guidance, setGuidance] = useState<DetailedGuidanceData | null>(initialGuidance || null)
  const [error, setError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(!!initialGuidance)

  // Auto-generate when improved essay is ready (and guidance doesn't exist yet)
  useEffect(() => {
    if (hasImprovedEssay && !hasStarted && !guidance) {
      setHasStarted(true)
      generateGuidance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasImprovedEssay])

  useEffect(() => {
    // Simulate progress - 5 seconds total
    let interval: NodeJS.Timeout
    if (isGenerating && progress < 95) {
      interval = setInterval(() => {
        setProgress(prev => {
          // 5 seconds = 5000ms, update every 100ms = 50 updates
          // Each update = ~1.9% to reach 95% in 5s
          if (prev < 95) {
            return prev + 1.9
          }
          return prev
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isGenerating, progress])

  const generateGuidance = async () => {
    setIsGenerating(true)
    setProgress(0)
    setError(null)

    try {
      const response = await fetch('/api/essays/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay_id: essayId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate guidance')
      }

      setGuidance(data.guidance)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  // Don't show if improved essay doesn't exist yet
  if (!hasImprovedEssay) {
    return null
  }

  return (
    <Card className="border-ocean-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-ocean-600" />
          <CardTitle className="text-ocean-800">Detailed Writing Guidance</CardTitle>
        </div>
        <CardDescription>
          Personalized feedback and actionable tips to improve your next essay
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ocean-700">Analyzing your essay and generating personalized guidance...</span>
              <span className="font-semibold text-ocean-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Failed to generate guidance</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {guidance && (
          <div className="space-y-6">
            {/* Overall Assessment */}
            {guidance.overall_assessment && (
              <div className="bg-gradient-to-br from-ocean-50 to-cyan-50 border border-ocean-200 rounded-lg p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-ocean-800 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-ocean-600" />
                    Overall Assessment
                  </h3>
                  <p className="text-sm text-ocean-700 leading-relaxed">
                    {guidance.overall_assessment.first_impression}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Strongest Aspect - Green */}
                  <div className="bg-white rounded-md p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">✓ Strongest Aspect</p>
                    <p className="text-sm text-ocean-800 font-medium">{guidance.overall_assessment.strongest_aspect}</p>
                    <p className="text-xs text-ocean-600 mt-2">{guidance.overall_assessment.maintain_this}</p>
                  </div>

                  {/* Priority Fixes - Ocean Blue */}
                  <div className="bg-white rounded-md p-3 border border-ocean-200">
                    <p className="text-xs font-semibold text-ocean-700 mb-1">→ Priority Improvements</p>
                    <ul className="space-y-1">
                      {guidance.overall_assessment.priority_fixes.map((fix, idx) => (
                        <li key={idx} className="text-sm text-ocean-800 flex items-start gap-1">
                          <span className="text-ocean-500 mt-0.5">•</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Next Essay Goals */}
                {guidance.overall_assessment.next_essay_goals && (
                  <div className="bg-white rounded-md p-3 border border-ocean-200">
                    <p className="text-xs font-semibold text-ocean-700 mb-2">🎯 Next Essay Goals</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      {Object.entries(guidance.overall_assessment.next_essay_goals).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-ocean-600 mt-0.5 flex-shrink-0" />
                          <span className="text-ocean-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Encouragement - Green */}
                <div className="bg-green-50 rounded-md p-3 border border-green-200">
                  <p className="text-sm text-green-800">
                    💪 {guidance.overall_assessment.encouragement}
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Sections */}
            <Accordion type="multiple" className="space-y-3">
              {/* Grammar Improvements - Ocean Blue for improvements, Red for errors, Green for positive */}
              {guidance.grammar_improvements && guidance.grammar_improvements.length > 0 && (
                <AccordionItem value="grammar" className="border border-ocean-200 rounded-lg">
                  <AccordionTrigger className="px-4 hover:bg-ocean-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-ocean-600">
                        {guidance.grammar_improvements.length}
                      </Badge>
                      <span className="font-semibold text-ocean-800">Grammar Enhancements</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-3">
                      {guidance.grammar_improvements.map((item, idx) => (
                        <div key={idx}>
                          {/* Sentence Combining - Ocean Blue (improvement) */}
                          {item.type === 'sentence_combining' && (
                            <div className="bg-ocean-50 rounded-md p-3 border border-ocean-200">
                              <p className="text-xs font-semibold text-ocean-700 mb-2">→ Sentence Combining</p>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <p className="text-xs text-ocean-600 mb-1">Original:</p>
                                  <p className="text-ocean-700">&quot;{item.original}&quot;</p>
                                </div>
                                <div>
                                  <p className="text-xs text-ocean-600 mb-1">Improved:</p>
                                  <p className="text-ocean-800 font-medium">&quot;{item.improved}&quot;</p>
                                </div>
                                <p className="text-xs text-ocean-600">
                                  <span className="font-semibold">Why:</span> {item.explanation}
                                </p>
                                {item.impact && (
                                  <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-1 border border-green-200">
                                    ✓ {item.impact}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Error Correction - Red (error) */}
                          {item.type === 'error_correction' && (
                            <div className="bg-red-50 rounded-md p-3 border border-red-200">
                              <p className="text-xs font-semibold text-red-700 mb-2">
                                ⚠️ Error Correction
                                {item.severity && (
                                  <Badge variant={item.severity === 'MAJOR' ? 'destructive' : 'secondary'} className="ml-2 text-xs">
                                    {item.severity}
                                  </Badge>
                                )}
                              </p>
                              <div className="space-y-2 text-sm">
                                {item.location && <p className="text-xs text-ocean-600">{item.location}</p>}
                                <div>
                                  <p className="text-xs text-ocean-600 mb-1">Error:</p>
                                  <p className="text-red-700 line-through">&quot;{item.error}&quot;</p>
                                </div>
                                <div>
                                  <p className="text-xs text-ocean-600 mb-1">Correction:</p>
                                  <p className="text-green-700 font-medium">&quot;{item.correction}&quot;</p>
                                </div>
                                {item.rule && (
                                  <p className="text-xs text-ocean-700 bg-white rounded px-2 py-1 border border-ocean-200">
                                    <span className="font-semibold">Rule:</span> {item.rule}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Variety Suggestion - Ocean Blue (suggestion) */}
                          {item.type === 'variety_suggestion' && (
                            <div className="bg-ocean-50 rounded-md p-3 border border-ocean-200">
                              <p className="text-xs font-semibold text-ocean-700 mb-2">→ Add Sentence Variety</p>
                              <div className="space-y-2 text-sm">
                                <p className="text-ocean-700">{item.observation}</p>
                                {item.missing_structures && item.missing_structures.length > 0 && (
                                  <div>
                                    <p className="text-xs text-ocean-600 mb-1">Try these structures:</p>
                                    <ul className="space-y-1">
                                      {item.missing_structures.map((structure, i) => (
                                        <li key={i} className="text-ocean-800 flex items-start gap-2">
                                          <span className="text-ocean-500">•</span>
                                          <span>{structure}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {item.try_next && (
                                  <p className="text-xs text-ocean-700 bg-white rounded px-2 py-1 border border-ocean-200">
                                    🎯 {item.try_next}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Coherence Improvements */}
              {guidance.coherence_improvements && guidance.coherence_improvements.length > 0 && (
                <AccordionItem value="coherence" className="border border-ocean-200 rounded-lg">
                  <AccordionTrigger className="px-4 hover:bg-ocean-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-ocean-600">
                        {guidance.coherence_improvements.length}
                      </Badge>
                      <span className="font-semibold text-ocean-800">Coherence & Flow</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-3">
                      {guidance.coherence_improvements.map((item, idx) => (
                        <div key={idx}>
                          {/* Positive Feedback - Green */}
                          {item.type === 'positive_feedback' && (
                            <div className="bg-green-50 rounded-md p-3 border border-green-200">
                              <p className="text-xs font-semibold text-green-700 mb-2">✓ What&apos;s Working</p>
                              <div className="space-y-2 text-sm">
                                {item.location && <p className="text-xs text-ocean-600">{item.location}</p>}
                                <p className="text-green-800 font-medium">{item.strength}</p>
                                {item.keep_doing && (
                                  <p className="text-xs text-green-700 bg-white rounded px-2 py-1 border border-green-200">
                                    → {item.keep_doing}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Improvements - Ocean Blue */}
                          {(item.type === 'transition_missing' || item.type === 'sentence_connection') && (
                            <div className="bg-ocean-50 rounded-md p-3 border border-ocean-200">
                              <p className="text-xs font-semibold text-ocean-700 mb-2">
                                {item.type === 'transition_missing' ? '→ Add Transition' : '→ Smoother Connection'}
                              </p>
                              <div className="space-y-2 text-sm">
                                {item.location && <p className="text-xs text-ocean-600">{item.location}</p>}
                                {item.issue && <p className="text-ocean-700">{item.issue}</p>}
                                {item.current && (
                                  <div>
                                    <p className="text-xs text-ocean-600 mb-1">Current:</p>
                                    <p className="text-ocean-700">&quot;{item.current}&quot;</p>
                                  </div>
                                )}
                                {(item.suggestion || item.smoother) && (
                                  <div className="bg-white rounded px-2 py-1 border border-ocean-200">
                                    <p className="text-xs text-ocean-600 mb-1">Suggestion:</p>
                                    <p className="text-ocean-800 font-medium">&quot;{item.suggestion || item.smoother}&quot;</p>
                                  </div>
                                )}
                                {(item.impact || item.why) && (
                                  <p className="text-xs text-ocean-600">💡 {item.impact || item.why}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Task Response Depth */}
              {guidance.task_response_depth && guidance.task_response_depth.length > 0 && (
                <AccordionItem value="task" className="border border-ocean-200 rounded-lg">
                  <AccordionTrigger className="px-4 hover:bg-ocean-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-ocean-600">
                        {guidance.task_response_depth.length}
                      </Badge>
                      <span className="font-semibold text-ocean-800">Task Response & Depth</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-3">
                      {guidance.task_response_depth.map((item, idx) => (
                        <div key={idx}>
                          {/* Positive Feedback - Green */}
                          {item.type === 'positive_feedback' && (
                            <div className="bg-green-50 rounded-md p-3 border border-green-200">
                              <p className="text-xs font-semibold text-green-700 mb-2">✓ Well Done</p>
                              <div className="space-y-2 text-sm">
                                <p className="text-green-800 font-medium">{item.strength}</p>
                                {item.evidence && (
                                  <p className="text-xs text-ocean-600">{item.evidence}</p>
                                )}
                                {item.keep_doing && (
                                  <p className="text-xs text-green-700 bg-white rounded px-2 py-1 border border-green-200">
                                    → {item.keep_doing}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Missing Element - Red */}
                          {item.type === 'missing_element' && (
                            <div className="bg-red-50 rounded-md p-3 border border-red-200">
                              <p className="text-xs font-semibold text-red-700 mb-2">⚠️ Missing Required Element</p>
                              <div className="space-y-2 text-sm">
                                <p className="text-ocean-700">{item.requirement}</p>
                                <p className="text-red-700 font-medium">{item.missing}</p>
                                {item.fix && (
                                  <div className="bg-white rounded px-2 py-1 border border-red-200">
                                    <p className="text-xs text-ocean-600 mb-1">How to fix:</p>
                                    <p className="text-ocean-800">&quot;{item.fix}&quot;</p>
                                  </div>
                                )}
                                {item.impact && (
                                  <p className="text-xs text-red-700">💡 {item.impact}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Underdeveloped Idea - Ocean Blue */}
                          {item.type === 'underdeveloped_idea' && (
                            <div className="bg-ocean-50 rounded-md p-3 border border-ocean-200">
                              <p className="text-xs font-semibold text-ocean-700 mb-2">→ Develop This Idea Further</p>
                              <div className="space-y-2 text-sm">
                                {item.location && <p className="text-xs text-ocean-600">{item.location}</p>}
                                <p className="text-ocean-700 font-medium">{item.idea}</p>
                                {item.issue && <p className="text-xs text-ocean-600">{item.issue}</p>}
                                {item.how_to_develop && (
                                  <div className="bg-white rounded px-2 py-1 border border-ocean-200">
                                    <p className="text-xs text-ocean-600 mb-1">How to develop:</p>
                                    <p className="text-ocean-800">&quot;{item.how_to_develop}&quot;</p>
                                  </div>
                                )}
                                {item.why_important && (
                                  <p className="text-xs text-ocean-600">💡 {item.why_important}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
