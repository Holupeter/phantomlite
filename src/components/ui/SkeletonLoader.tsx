import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/[0.06]',
        className
      )}
    />
  )
}

export function WalletSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Balance */}
      <div className="flex flex-col items-center gap-3 py-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="flex-1 h-16 rounded-2xl" />
        ))}
      </div>

      {/* Asset list */}
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="h-3 w-16 mb-1" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 px-5">
          <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}