'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Target } from 'lucide-react'
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts'

interface ScoreDistributionProps {
  scoreDistribution: {
    overall: { [key: number]: number }
    taskResponse: { [key: number]: number }
    coherence: { [key: number]: number }
    lexical: { [key: number]: number }
    grammar: { [key: number]: number }
  }
  criteriaOverTime?: Array<{
    essayNumber: number
    taskResponse: number | null
    coherence: number | null
    vocabulary: number | null
    grammar: number | null
  }>
  hasEssays: boolean
}

export function ScoreDistribution({ scoreDistribution, criteriaOverTime, hasEssays }: ScoreDistributionProps) {
  console.log('[ScoreDistribution] Props received:', { scoreDistribution, criteriaOverTime, hasEssays })

  if (!hasEssays) {
    console.log('[ScoreDistribution] No essays, returning null')
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

  const hasOverallData = overallData.length > 0
  const hasCriteriaData = criteriaOverTime && criteriaOverTime.length > 0

  console.log('[ScoreDistribution] Data check:', {
    overallData,
    criteriaOverTime,
    hasOverallData,
    hasCriteriaData
  })

  // Don't render if no data at all
  if (!hasOverallData && !hasCriteriaData) {
    console.log('[ScoreDistribution] No data at all, returning null')
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
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
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
                  <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {overallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-ocean-600 text-center mt-2">
              How your essays are distributed across band scores
            </p>
          </CardContent>
        </Card>
      )}

      {/* Criteria Performance Over Time */}
      <Card className="border-ocean-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Criteria Performance Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasCriteriaData ? (
            <>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={criteriaOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis
                      dataKey="essayNumber"
                      tick={{ fill: '#0c4a6e', fontSize: 12 }}
                      label={{ value: 'Essay Number', position: 'insideBottom', offset: -5, fill: '#0c4a6e' }}
                    />
                    <YAxis
                      domain={[5, 9]}
                      ticks={[5, 6, 7, 8]}
                      tick={{ fill: '#0c4a6e', fontSize: 12 }}
                      label={{ value: 'Band Score', angle: -90, position: 'insideLeft', fill: '#0c4a6e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #cffafe',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="taskResponse"
                      stroke="#93c5fd"
                      strokeWidth={2}
                      dot={{ fill: '#93c5fd', r: 4 }}
                      name="Task Response"
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="coherence"
                      stroke="#6ee7b7"
                      strokeWidth={2}
                      dot={{ fill: '#6ee7b7', r: 4 }}
                      name="Coherence"
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="vocabulary"
                      stroke="#fcd34d"
                      strokeWidth={2}
                      dot={{ fill: '#fcd34d', r: 4 }}
                      name="Vocabulary"
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="grammar"
                      stroke="#f9a8d4"
                      strokeWidth={2}
                      dot={{ fill: '#f9a8d4', r: 4 }}
                      name="Grammar"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-ocean-600 text-center mt-2">
                Track how each criteria score changes across your essays
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
  if (band >= 8) return '#6ee7b7' // emerald-300 - pastel green
  if (band >= 7) return '#67e8f9' // cyan-300 - light cyan
  if (band >= 6) return '#93c5fd' // blue-300 - soft blue
  if (band >= 5) return '#fcd34d' // amber-300 - pastel yellow
  return '#fca5a5' // red-300 - soft red
}

function calculateAverage(distribution: { [key: number]: number }): number {
  const entries = Object.entries(distribution)
  if (entries.length === 0) return 0

  const sum = entries.reduce((acc, [band, count]) => acc + parseInt(band) * count, 0)
  const total = entries.reduce((acc, [, count]) => acc + count, 0)

  return total > 0 ? sum / total : 0
}
