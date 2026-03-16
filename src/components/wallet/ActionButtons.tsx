'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Plus, Link } from 'lucide-react'

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
    color: '#a78bfa',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
  },
  {
    id: 'receive',
    label: 'Receive',
    icon: ArrowDownLeft,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Link,
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.2)',
  },
  {
    id: 'create',
    label: 'Create',
    icon: Plus,
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.2)',
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10,
      padding: '20px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: '#0a0a0f',
    }}>
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '16px 8px',
              borderRadius: 16,
              background: action.bg,
              border: `0.5px solid ${action.border}`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => {
              if (!disabled) e.currentTarget.style.background = action.bg.replace('0.1', '0.18')
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = action.bg
            }}
          >
            <Icon
              size={18}
              style={{ color: action.color, flexShrink: 0 }}
            />
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: action.color,
            }}>
              {action.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}