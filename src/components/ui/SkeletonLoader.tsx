import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white/[0.06]',
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  )
}

export function WalletSkeleton() {
  return (
    <div className="flex flex-col gap-0">

      {/* Balance section */}
      <div className="flex flex-col items-center gap-3 px-5 py-8 bg-[#111118] border-b border-white/[0.05]">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-10 w-44 rounded-2xl" />
        <Skeleton className="h-2.5 w-28" />
        <Skeleton className="h-7 w-36 rounded-full mt-1" />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-4 gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>

      {/* Section label */}
      <div className="px-5 py-3">
        <Skeleton className="h-2.5 w-14" />
      </div>

      {/* Asset rows */}
      <div className="flex flex-col gap-0 border-t border-white/[0.05]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]"
          >
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-2 w-14" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-2 w-10" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]"
        >
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-2 w-20" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}