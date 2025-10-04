import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  )
}

interface SuccessMessageProps {
  message: string
  className?: string
}

export function SuccessMessage({ message, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  )
}
