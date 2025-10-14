import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function EssayResultsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-8 md:h-10 w-48 md:w-64 mb-2" />
        <Skeleton className="h-5 md:h-6 w-64 md:w-96" />
      </div>

      {/* Overall Score Card Skeleton */}
      <Card className="border-ocean-300 shadow-lg mb-6 md:mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-ocean-600 to-cyan-600 text-white p-6 md:p-8">
          <div className="text-center">
            <Skeleton className="h-6 w-48 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-20 md:h-24 w-32 md:w-40 mx-auto mb-2 bg-white/20" />
            <Skeleton className="h-4 w-40 mx-auto bg-white/20" />
          </div>
        </div>
      </Card>

      {/* Essay Content Skeleton */}
      <Card className="border-ocean-200 shadow-lg mb-6 md:mb-8">
        <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200 p-4 md:p-6">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <div className="bg-ocean-50 border border-ocean-200 rounded-md p-3 md:p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 md:p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Cards Skeleton */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-7 md:h-8 w-56 md:w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-ocean-200 shadow-lg">
              <CardHeader className="pb-3 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-7 w-12 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                <div className="bg-cyan-50 border border-cyan-200 rounded-md p-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="border border-green-200 rounded-md p-3 md:p-4">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Essay Improvement Skeleton */}
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-7 md:h-8 w-56 md:w-72 mb-4" />
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200 p-4 md:p-6">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 md:p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Guidance Skeleton */}
      <div className="mb-6 md:mb-8">
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200 p-4 md:p-6">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vocabulary Section Skeleton */}
      <Card className="border-ocean-200 shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-ocean-50 to-cyan-50 border-b border-ocean-200 p-4 md:p-6">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-full md:w-96 mt-2" />
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-full sm:w-48" />
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Footer Info Skeleton */}
      <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
        <Skeleton className="h-5 w-48 mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
