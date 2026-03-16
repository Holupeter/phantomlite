import { cn } from '@/lib/utils'
import { TransactionStatus } from '@/types'

interface StatusBadgeProps {
  status: TransactionStatus
  animated?: boolean
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, animated = true, size = 'md' }: StatusBadgeProps) {
  const configs = {
    pending: {
      label: 'Pending',
      dot: 'bg-amber-400',
      badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    },
    success: {
      label: 'Confirmed',
      dot: 'bg-emerald-400',
      badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    },
    failed: {
      label: 'Failed',
      dot: 'bg-red-400',
      badge: 'bg-red-400/10 text-red-400 border-red-400/20',
    },
  }

  const { label, dot, badge } = configs[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        badge,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      <span
        className={cn(
          'rounded-full flex-shrink-0',
          dot,
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          status === 'pending' && animated && 'animate-pulse'
        )}
      />
      {label}
    </span>
  )
}