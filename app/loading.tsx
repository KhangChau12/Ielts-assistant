import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-ocean-600" />
        <p className="text-sm md:text-base text-ocean-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}
