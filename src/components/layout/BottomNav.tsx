'use client'

import { motion } from 'framer-motion'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home',    label: 'Home',    icon: '⌂' },
  { id: 'send',    label: 'Send',    icon: '↑' },
  { id: 'receive', label: 'Receive', icon: '↓' },
  { id: 'history', label: 'History', icon: '≡' },
  { id: 'connect', label: 'Connect', icon: '⇌' },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div style={{
      display: 'flex',
      background: '#111118',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '12px 4px 14px',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              position: 'relative',
              transition: 'opacity 0.2s',
            }}
          >
            {/* Active indicator line */}
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 2,
                  background: '#8b5cf6',
                  borderRadius: 2,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}

            {/* Icon */}
            <span style={{
              fontSize: 17,
              color: isActive ? '#a78bfa' : '#374151',
              transition: 'color 0.2s',
              lineHeight: 1,
            }}>
              {tab.icon}
            </span>

            {/* Label */}
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              color: isActive ? '#a78bfa' : '#374151',
              transition: 'color 0.2s',
            }}>
              {tab.label}
            </span>

          </button>
        )
      })}
    </div>
  )
}