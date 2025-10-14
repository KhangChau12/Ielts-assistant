import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function VocabularyLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-8 md:h-10 w-56 md:w-72 mb-2" />
        <Skeleton className="h-5 md:h-6 w-48 md:w-64" />
      </div>

      {/* Filter Controls Skeleton */}
      <Card className="border-ocean-200 shadow-sm mb-4">
        <CardContent className="pt-4 md:pt-6 px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full md:w-[220px]" />
            <Skeleton className="h-4 w-32 md:ml-auto" />
          </div>
        </CardContent>
      </Card>

      {/* Essay Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-ocean-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                <div className="flex-1">
                  <Skeleton className="h-5 md:h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-48 md:w-64" />
                </div>
                <div className="flex flex-row gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
              <div className="space-y-3">
                {/* Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 md:gap-3">
                  <Skeleton className="h-10 w-full sm:w-40" />
                  <Skeleton className="h-10 w-full sm:w-48" />
                  <Skeleton className="h-10 w-full sm:w-48" />
                </div>

                {/* Info Box Skeleton */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-3 md:p-4">
                  <Skeleton className="h-5 w-36 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* About Section Skeleton */}
      <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg shadow-sm">
        <Skeleton className="h-5 md:h-6 w-48 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}
