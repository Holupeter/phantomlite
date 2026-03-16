'use client'

import { motion } from 'framer-motion'
import { Home, ArrowUpRight, ArrowDownLeft, History, Link } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home',    label: 'Home',    icon: Home },
  { id: 'send',    label: 'Send',    icon: ArrowUpRight },
  { id: 'receive', label: 'Receive', icon: ArrowDownLeft },
  { id: 'history', label: 'History', icon: History },
  { id: 'connect', label: 'Connect', icon: Link },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="flex items-center border-t border-white/[0.07] bg-[#111118] px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-violet-500 rounded-full"
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}

            <Icon
              size={18}
              className={cn(
                'transition-colors',
                isActive ? 'text-violet-400' : 'text-gray-600'
              )}
            />
            <span
              className={cn(
                'text-[9px] font-medium uppercase tracking-wider transition-colors',
                isActive ? 'text-violet-400' : 'text-gray-600'
              )}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}