import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-slate-100 p-6">
          <Icon className="h-12 w-12 text-slate-400" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-600">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-ocean-600 hover:bg-ocean-700">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
