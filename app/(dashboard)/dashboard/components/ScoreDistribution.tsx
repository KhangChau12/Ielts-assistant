'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Target } from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ScoreDistributionProps {
  scoreDistribution: {
    overall: { [key: number]: number }
    taskResponse: { [key: number]: number }
    coherence: { [key: number]: number }
    lexical: { [key: number]: number }
    grammar: { [key: number]: number }
  }
  hasEssays: boolean
}

export function ScoreDistribution({ scoreDistribution, hasEssays }: ScoreDistributionProps) {
  if (!hasEssays) {
    return null // Don't show if no essays
  }

  // Prepare overall band distribution data
  const overallData = Object.entries(scoreDistribution.overall || {})
    .map(([band, count]) => ({
      band: `Band ${band}`,
      count,
      fill: getBandColor(parseInt(band)),
    }))
    .sort((a, b) => parseInt(a.band.split(' ')[1]) - parseInt(b.band.split(' ')[1]))

  // Prepare criteria comparison data (average scores) - lighter pastel colors
  const criteriaData = [
    {
      name: 'Task Response',
      score: calculateAverage(scoreDistribution.taskResponse || {}),
      fill: '#67e8f9', // cyan-300
    },
    {
      name: 'Coherence',
      score: calculateAverage(scoreDistribution.coherence || {}),
      fill: '#7dd3fc', // sky-300
    },
    {
      name: 'Vocabulary',
      score: calculateAverage(scoreDistribution.lexical || {}),
      fill: '#c4b5fd', // violet-300
    },
    {
      name: 'Grammar',
      score: calculateAverage(scoreDistribution.grammar || {}),
      fill: '#93c5fd', // blue-300
    },
  ]

  const hasOverallData = overallData.length > 0
  const hasCriteriaData = criteriaData.some(c => c.score > 0)

  // Don't render if no data at all
  if (!hasOverallData && !hasCriteriaData) {
    return null
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Overall Band Distribution */}
      {hasOverallData && (
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Band Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBarChart data={overallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis dataKey="band" tick={{ fill: '#0c4a6e', fontSize: 12 }} />
                <YAxis tick={{ fill: '#0c4a6e', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #cffafe',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
            <p className="text-xs text-ocean-600 text-center mt-2">
              How your essays are distributed across band scores
            </p>
          </CardContent>
        </Card>
      )}

      {/* Criteria Breakdown */}
      <Card className="border-ocean-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Criteria Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasCriteriaData ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={criteriaData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis type="number" domain={[0, 9]} tick={{ fill: '#0c4a6e', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#0c4a6e', fontSize: 11 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #cffafe',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`Band ${value.toFixed(1)}`, 'Average Score']}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {criteriaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
              <p className="text-xs text-ocean-600 text-center mt-2">
                Your average performance across all 4 IELTS criteria
              </p>
            </>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <div className="text-center text-ocean-500">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No criteria scores yet</p>
                <p className="text-xs mt-1">Submit essays to see your performance</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getBandColor(band: number): string {
  if (band >= 8) return '#10b981' // green-500
  if (band >= 7) return '#06b6d4' // cyan-500
  if (band >= 6) return '#3b82f6' // blue-500
  if (band >= 5) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
}

function calculateAverage(distribution: { [key: number]: number }): number {
  const entries = Object.entries(distribution)
  if (entries.length === 0) return 0

  const sum = entries.reduce((acc, [band, count]) => acc + parseInt(band) * count, 0)
  const total = entries.reduce((acc, [, count]) => acc + count, 0)

  return total > 0 ? sum / total : 0
}
