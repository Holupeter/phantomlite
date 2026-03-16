'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Plus, Link } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionButtonsProps {
  onSend: () => void
  onReceive: () => void
  onCreate: () => void
  onConnect: () => void
  disabled?: boolean
}

const actions = [
  {
    id: 'send',
    label: 'Send',
    icon: ArrowUpRight,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20',
  },
  {
    id: 'receive',
    label: 'Receive',
    icon: ArrowDownLeft,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Link,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
  },
  {
    id: 'create',
    label: 'Create',
    icon: Plus,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',
  },
]

export function ActionButtons({
  onSend,
  onReceive,
  onCreate,
  onConnect,
  disabled = false,
}: ActionButtonsProps) {
  const handlers: Record<string, () => void> = {
    send: onSend,
    receive: onReceive,
    connect: onConnect,
    create: onCreate,
  }

  return (
    <div className="grid grid-cols-4 gap-2.5 px-5 py-4 border-b border-white/[0.05]">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handlers[action.id]}
            disabled={disabled}
            className={cn(
              'flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
              action.bg
            )}
          >
            <Icon size={18} className={action.color} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${action.color}`}>
              {action.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}