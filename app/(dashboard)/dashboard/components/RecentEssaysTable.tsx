'use client'

import { Essay } from '@/types/essay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'

interface RecentEssaysTableProps {
  essays: Essay[]
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'bg-gray-500'
  if (score >= 7) return 'bg-green-600'
  if (score >= 5.5) return 'bg-yellow-600'
  return 'bg-red-600'
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function RecentEssaysTable({ essays }: RecentEssaysTableProps) {
  const router = useRouter()

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-ocean-200 bg-ocean-50">
            <th className="text-left py-3 px-4 text-sm font-semibold text-ocean-800">
              Prompt
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-ocean-800">
              Score
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-ocean-800">
              Date
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-ocean-800">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {essays.map((essay) => (
            <tr
              key={essay.id}
              className="border-b border-ocean-100 hover:bg-ocean-50 transition-colors"
            >
              <td className="py-3 px-4">
                <p className="text-sm text-ocean-700 max-w-md">
                  {truncateText(essay.prompt, 80)}
                </p>
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={`${getScoreColor(
                    essay.overall_score
                  )} text-white font-bold px-3 py-1`}
                >
                  {essay.overall_score !== null
                    ? essay.overall_score.toFixed(1)
                    : 'N/A'}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-ocean-600">
                  {format(new Date(essay.created_at), 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-ocean-500">
                  {format(new Date(essay.created_at), 'h:mm a')}
                </p>
              </td>
              <td className="py-3 px-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/write/${essay.id}`)}
                  className="border-ocean-300 text-ocean-700 hover:bg-ocean-100"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
