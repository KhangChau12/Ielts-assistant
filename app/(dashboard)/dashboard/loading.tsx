import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4">
      {/* Welcome Section Skeleton */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-8 md:h-10 w-64 md:w-80 mb-2" />
        <Skeleton className="h-5 md:h-6 w-48 md:w-64" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-ocean-200 shadow-lg bg-gradient-to-br from-ocean-100 to-cyan-100">
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 md:h-10 w-16" />
              </div>
              <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-lg bg-gradient-to-br from-emerald-100 to-teal-100">
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 md:h-10 w-16" />
              </div>
              <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Skeleton */}
      <Card className="border-ocean-200 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 md:h-80 w-full" />
        </CardContent>
      </Card>

      {/* Vocabulary Progress Skeleton */}
      <Card className="border-ocean-200 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-56 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Essays Skeleton */}
      <Card className="border-ocean-200 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          {/* Mobile Card View Skeleton */}
          <div className="md:hidden space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-ocean-200 rounded-lg p-4">
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Desktop Table Skeleton */}
          <div className="hidden md:block space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b border-ocean-100">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
