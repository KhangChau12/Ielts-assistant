import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function HistoryLoading() {
  return (
    <div className="container mx-auto py-6 md:py-8 px-4">
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-8 md:h-10 w-48 md:w-64 mb-2" />
        <Skeleton className="h-5 md:h-6 w-64 md:w-80" />
      </div>

      {/* Essay Cards Skeleton */}
      <div className="space-y-3 md:space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-ocean-100 shadow-lg">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                <div className="flex-1">
                  <Skeleton className="h-5 md:h-6 w-full mb-2" />
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 md:space-y-4">
                {/* Criteria Scores Skeleton */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="rounded-lg bg-slate-50 p-2 md:p-3 text-center">
                      <Skeleton className="h-3 w-20 mx-auto mb-2" />
                      <Skeleton className="h-6 w-12 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Essay Preview Skeleton */}
                <div className="rounded-lg bg-slate-50 p-3 md:p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-full sm:w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Write New Essay Button Skeleton */}
      <div className="mt-6 md:mt-8 text-center">
        <Skeleton className="h-11 w-48 mx-auto" />
      </div>
    </div>
  )
}
