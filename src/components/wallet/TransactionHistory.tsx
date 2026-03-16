'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTransaction } from '@/hooks/useTransaction'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatUsd, formatCrypto, timeAgo, shortenAddress } from '@/lib/utils'
import { Transaction } from '@/types'
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'

function TransactionRow({
  tx,
  index,
  onRetry,
}: {
  tx: Transaction
  index: number
  onRetry: (id: string) => void
}) {
  const isSend = tx.type === 'send'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors"
    >
      {/* Type icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          tx.status === 'failed'
            ? 'bg-red-500/10'
            : isSend
            ? 'bg-violet-500/10'
            : 'bg-emerald-500/10'
        }`}
      >
        {tx.status === 'failed' ? (
          <span className="text-red-400 text-xs font-bold">✕</span>
        ) : isSend ? (
          <ArrowUpRight size={15} className="text-violet-400" />
        ) : (
          <ArrowDownLeft size={15} className="text-emerald-400" />
        )}
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white capitalize">
            {isSend ? 'Sent' : 'Received'} {tx.asset}
          </p>
          <StatusBadge status={tx.status} size="sm" />
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {isSend
            ? `To ${shortenAddress(tx.to)}`
            : `From ${shortenAddress(tx.from)}`}
          {' · '}
          {timeAgo(tx.timestamp)}
        </p>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Gas: ${tx.gasFeUsd.toFixed(2)}
        </p>
      </div>

      {/* Amount + retry */}
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
        <p
          className={`text-sm font-medium tabular-nums ${
            isSend ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {isSend ? '−' : '+'}{formatCrypto(tx.amount, tx.asset, 3)}
        </p>
        <p className="text-[10px] text-gray-600">
          {formatUsd(tx.usdValue)}
        </p>
        {tx.status === 'failed' && (
          <button
            onClick={() => onRetry(tx.id)}
            className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors mt-0.5"
          >
            <RefreshCw size={9} />
            <span>Retry{tx.retryCount > 0 ? ` (${tx.retryCount})` : ''}</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function TransactionHistory() {
  const { transactions, handleRetry } = useTransaction()

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">
          Transactions
        </span>
        <span className="text-[11px] text-gray-600">
          {transactions.length} total
        </span>
      </div>

      <div className="border-t border-white/[0.05]">
        <AnimatePresence initial={false}>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm text-gray-500">No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                index={i}
                onRetry={handleRetry}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}