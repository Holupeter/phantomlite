'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransaction } from '@/hooks/useTransaction'
import { Transaction } from '@/types'
import { formatCrypto, timeAgo } from '@/lib/utils'

type Filter = 'all' | 'send' | 'receive' | 'pending' | 'failed'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'All' },
  { id: 'send',    label: 'Sent' },
  { id: 'receive', label: 'Received' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed',  label: 'Failed' },
]

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; bg: string; border: string; color: string }> = {
    pending: {
      label: 'Pending',
      bg: 'rgba(251,191,36,0.1)',
      border: 'rgba(251,191,36,0.2)',
      color: '#fbbf24',
    },
    success: {
      label: 'Confirmed',
      bg: 'rgba(52,211,153,0.1)',
      border: 'rgba(52,211,153,0.2)',
      color: '#34d399',
    },
    failed: {
      label: 'Failed',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.2)',
      color: '#f87171',
    },
  }
  const c = configs[status] ?? configs.failed

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 20,
      fontSize: 9, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: 0.3,
      background: c.bg, border: `0.5px solid ${c.border}`, color: c.color,
    }}>
      <span style={{
        width: 4, height: 4, borderRadius: '50%',
        background: 'currentColor', display: 'inline-block',
        animation: status === 'pending' ? 'pulse 1.5s infinite' : 'none',
      }} />
      {c.label}
    </span>
  )
}

function TxIcon({ type, status }: { type: string; status: string }) {
  const bg =
    status === 'failed'  ? 'rgba(239,68,68,0.1)' :
    status === 'pending' ? 'rgba(251,191,36,0.1)' :
    type === 'send'      ? 'rgba(139,92,246,0.1)' :
    'rgba(52,211,153,0.1)'

  const icon =
    status === 'failed'  ? '✕' :
    status === 'pending' ? '⏳' :
    type === 'send'      ? '↑' : '↓'

  const color =
    status === 'failed'  ? '#f87171' :
    status === 'pending' ? '#fbbf24' :
    type === 'send'      ? '#a78bfa' : '#34d399'

  return (
    <div style={{
      width: 38, height: 38, borderRadius: 12,
      background: bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 15, color, flexShrink: 0,
    }}>
      {icon}
    </div>
  )
}

function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {}
  const now = Date.now()
  const oneDayMs = 1000 * 60 * 60 * 24

  transactions.forEach((tx) => {
    const diff = now - tx.timestamp
    let label: string

    if (diff < oneDayMs) {
      label = 'Today'
    } else if (diff < oneDayMs * 2) {
      label = 'Yesterday'
    } else {
      label = new Intl.DateTimeFormat('en-US', {
        month: 'long', day: 'numeric',
      }).format(new Date(tx.timestamp))
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(tx)
  })

  return groups
}

function TxRow({
  tx,
  index,
  onRetry,
}: {
  tx: Transaction
  index: number
  onRetry: (id: string) => void
}) {
  const isSend = tx.type === 'send'
  const amountColor =
    tx.status === 'failed' ? '#6b7280' :
    isSend ? '#f87171' : '#34d399'
  const amountPrefix =
    tx.status === 'failed' ? '' :
    isSend ? '−' : '+'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 20px',
        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
        cursor: 'pointer', transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Icon */}
      <TxIcon type={tx.type} status={tx.status} />

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3,
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>
            {isSend ? 'Sent' : 'Received'} {tx.asset}
          </span>
          <StatusBadge status={tx.status} />
        </div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>
          {isSend ? `To ${tx.to.slice(0, 6)}…${tx.to.slice(-4)}`
            : `From ${tx.from.slice(0, 6)}…${tx.from.slice(-4)}`}
          {' · '}
          {timeAgo(tx.timestamp)}
        </div>
        <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>
          Gas: ${tx.gasFeUsd.toFixed(2)}
        </div>
        {tx.status === 'failed' && (
          <button
            onClick={(e) => { e.stopPropagation(); onRetry(tx.id) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: '#a78bfa', cursor: 'pointer',
              marginTop: 3, background: 'none', border: 'none', padding: 0,
            }}
          >
            ↺ Retry{tx.retryCount > 0 ? ` (${tx.retryCount})` : ''}
          </button>
        )}
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          fontFamily: 'monospace', color: amountColor,
        }}>
          {amountPrefix}{formatCrypto(tx.amount, tx.asset, 4)}
        </div>
        <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>
          ${tx.usdValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

    </motion.div>
  )
}

export function TransactionHistory() {
  const { transactions, handleRetry } = useTransaction()
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered = transactions.filter((tx) => {
    if (activeFilter === 'all')     return true
    if (activeFilter === 'send')    return tx.type === 'send' && tx.status !== 'failed' && tx.status !== 'pending'
    if (activeFilter === 'receive') return tx.type === 'receive'
    if (activeFilter === 'pending') return tx.status === 'pending'
    if (activeFilter === 'failed')  return tx.status === 'failed'
    return true
  })

  const grouped = groupByDate(filtered)

  const totalSent = transactions
    .filter((t) => t.type === 'send' && t.status === 'success')
    .reduce((acc, t) => acc + t.usdValue, 0)

  const totalReceived = transactions
    .filter((t) => t.type === 'receive' && t.status === 'success')
    .reduce((acc, t) => acc + t.usdValue, 0)

  const pendingCount = transactions.filter((t) => t.status === 'pending').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      <div style={{
        padding: '24px 20px 16px',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
            Transaction History
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            All your recent activity
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#4b5563', marginTop: 6 }}>
          {transactions.length} total
        </div>
      </div>

      {/* Summary cards */}
      <div style={{
        display: 'flex', gap: 8,
        padding: '14px 20px',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
      }}>
        {[
          { label: 'Total sent',     value: `−$${totalSent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,     color: '#f87171' },
          { label: 'Total received', value: `+$${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#34d399' },
          { label: 'Pending',        value: `${pendingCount} tx`,  color: '#fbbf24' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              flex: 1, padding: '12px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
            }}
          >
            <div style={{
              fontSize: 10, color: '#6b7280', marginBottom: 4,
            }}>
              {card.label}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, color: card.color,
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 6,
        padding: '12px 20px 10px',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
        overflowX: 'auto',
      }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '5px 12px', borderRadius: 20,
              fontSize: 10, fontWeight: 600,
              letterSpacing: 0.5, textTransform: 'uppercase',
              cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeFilter === f.id
                ? 'rgba(124,58,237,0.15)'
                : 'rgba(255,255,255,0.04)',
              border: `0.5px solid ${activeFilter === f.id
                ? 'rgba(124,58,237,0.3)'
                : 'rgba(255,255,255,0.08)'}`,
              color: activeFilter === f.id ? '#a78bfa' : '#4b5563',
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped transactions */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '48px 20px', gap: 8, textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>📭</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              No transactions found
            </div>
            <div style={{ fontSize: 11, color: '#4b5563' }}>
              Try a different filter
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {Object.entries(grouped).map(([date, txs]) => (
              <div key={date}>
                {/* Date label */}
                <div style={{
                  padding: '12px 20px 6px',
                  fontSize: 10, letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: '#4b5563', fontWeight: 500,
                }}>
                  {date}
                </div>

                {/* Tx rows */}
                {txs.map((tx, i) => (
                  <TxRow
                    key={tx.id}
                    tx={tx}
                    index={i}
                    onRetry={handleRetry}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}