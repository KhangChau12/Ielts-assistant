'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ErrorsByCriterion {
  taskResponse: string[]
  coherenceCohesion: string[]
  lexicalResource: string[]
  grammaticalAccuracy: string[]
}

interface ErrorHistoryProps {
  errors: ErrorsByCriterion
}

interface CriterionSectionProps {
  title: string
  errors: string[]
  color: string
}

function CriterionSection({ title, errors, color }: CriterionSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const initialCount = 3
  const hasMore = errors.length > initialCount
  const displayedErrors = showAll ? errors : errors.slice(0, initialCount)

  if (errors.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={`${color} text-white`}>{title}</Badge>
          <span className="text-sm text-ocean-600">No errors found</span>
        </div>
        <div className="pl-4 border-l-2 border-green-300 ml-2">
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
            Great work! No issues detected in this criterion.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className={`${color} text-white`}>{title}</Badge>
        <span className="text-sm text-ocean-600">
          {errors.length} {errors.length === 1 ? 'issue' : 'issues'} found
        </span>
      </div>
      <div className="pl-4 border-l-2 border-ocean-200 ml-2 space-y-2">
        {displayedErrors.map((error, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm text-ocean-700 bg-ocean-50 border border-ocean-200 rounded-md p-3"
          >
            <span className="text-red-600 mt-0.5 font-bold">•</span>
            <span>{error}</span>
          </div>
        ))}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More ({errors.length - initialCount} more)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function ErrorHistory({ errors }: ErrorHistoryProps) {
  const totalErrors =
    errors.taskResponse.length +
    errors.coherenceCohesion.length +
    errors.lexicalResource.length +
    errors.grammaticalAccuracy.length

  if (totalErrors === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 inline-block">
          <p className="text-lg font-semibold text-green-800 mb-2">
            Excellent Work!
          </p>
          <p className="text-sm text-green-700">
            No errors detected across your essays. Keep up the great work!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CriterionSection
        title="Task Response"
        errors={errors.taskResponse}
        color="bg-blue-600"
      />
      <CriterionSection
        title="Coherence & Cohesion"
        errors={errors.coherenceCohesion}
        color="bg-purple-600"
      />
      <CriterionSection
        title="Lexical Resource"
        errors={errors.lexicalResource}
        color="bg-orange-600"
      />
      <CriterionSection
        title="Grammatical Accuracy"
        errors={errors.grammaticalAccuracy}
        color="bg-red-600"
      />
    </div>
  )
}
