'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ChartDataPoint {
  essayNumber: number
  score: number | null
  date: string
}

interface ScoreChartProps {
  data: ChartDataPoint[]
}

export function ScoreChart({ data }: ScoreChartProps) {
  // Format data for recharts
  const formattedData = data.map((point) => ({
    essay: `Essay ${point.essayNumber}`,
    score: point.score,
    date: point.date,
  }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis
            dataKey="essay"
            stroke="#0c4a6e"
            tick={{ fill: '#0c4a6e', fontSize: 12 }}
          />
          <YAxis
            domain={[4, 9]}
            ticks={[4, 5, 6, 7, 8]}
            stroke="#0c4a6e"
            tick={{ fill: '#0c4a6e', fontSize: 12 }}
            tickFormatter={(value) => value === 8 ? '8-9' : value.toString()}
            label={{
              value: 'Band Score',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#0c4a6e', fontSize: 14, fontWeight: 500 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #06b6d4',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: '#0c4a6e', fontWeight: 600 }}
            formatter={(value: number, name: string, props: any) => {
              const date = props.payload.date
              // Display Band 8 and 9 as "8-9"
              const displayScore = value >= 8 ? '8-9' : value.toFixed(1)
              return [
                <div key="tooltip" className="space-y-1">
                  <div className="text-cyan-700 font-bold text-lg">
                    Band: {displayScore}
                  </div>
                  <div className="text-ocean-600 text-xs">
                    {format(new Date(date), 'MMM d, yyyy')}
                  </div>
                </div>,
              ]
            }}
            labelFormatter={() => ''}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{
              fill: '#06b6d4',
              strokeWidth: 2,
              r: 5,
              stroke: '#ffffff',
            }}
            activeDot={{
              fill: '#0891b2',
              strokeWidth: 2,
              r: 7,
              stroke: '#ffffff',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
