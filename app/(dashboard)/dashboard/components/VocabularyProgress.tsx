'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, BookOpen, CheckCircle, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface VocabularyProgressProps {
  totalWords: number
  essaysWithoutVocab: number
  quizScore: number
  paraphraseScore: number
  topicScore: number
  totalCorrect: number
  totalQuestions: number
}

export function VocabularyProgress({
  totalWords,
  essaysWithoutVocab,
  quizScore,
  paraphraseScore,
  topicScore,
  totalCorrect,
  totalQuestions,
}: VocabularyProgressProps) {
  // Pie chart data for quiz performance
  const quizData = [
    { name: 'Correct', value: totalCorrect, color: '#10b981' },
    { name: 'Incorrect', value: totalQuestions - totalCorrect, color: '#f59e0b' },
  ]

  // Empty state
  if (totalWords === 0 && totalQuestions === 0) {
    return (
      <Card className="border-ocean-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Vocabulary Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-ocean-600">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Start Your Vocabulary Journey!</p>
            <p className="text-sm">Submit essays and practice quizzes to build your word bank</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-ocean-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-ocean-800 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Vocabulary Learning Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Word Collection Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-ocean-50 to-cyan-50 rounded-lg p-4 border border-ocean-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ocean-700">Words Collected</span>
                <BookOpen className="h-4 w-4 text-ocean-600" />
              </div>
              <div className="text-3xl font-bold text-ocean-800">{totalWords}</div>
              <p className="text-xs text-ocean-600 mt-1">vocabulary words learned</p>
            </div>

            {essaysWithoutVocab > 0 && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      {essaysWithoutVocab} essay{essaysWithoutVocab > 1 ? 's' : ''} without vocabulary
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Generate vocabulary to expand your word bank!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Type Breakdown */}
            {totalQuestions > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-ocean-700 mb-3">Quiz Performance by Type</p>

                <div className="bg-green-50 rounded-md p-3 border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-800">Paraphrase Quizzes</span>
                    <span className="text-lg font-bold text-green-700">{paraphraseScore}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${paraphraseScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-teal-50 rounded-md p-3 border border-teal-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-teal-800">Topic Quizzes</span>
                    <span className="text-lg font-bold text-teal-700">{topicScore}%</span>
                  </div>
                  <div className="w-full bg-teal-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${topicScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quiz Performance Pie Chart */}
          {totalQuestions > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={quizData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {quizData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-ocean-800">{quizScore}%</p>
                <p className="text-sm text-ocean-600">Overall Quiz Accuracy</p>
                <p className="text-xs text-ocean-500 mt-1">
                  {totalCorrect} / {totalQuestions} questions correct
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-ocean-500">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Take quizzes to track your progress</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
