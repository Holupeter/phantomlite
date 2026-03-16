'use client'

import { motion } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { formatUsd, formatPriceChange, shortenAddress } from '@/lib/utils'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function BalanceCard() {
  const { totalBalanceUsd, address, isConnected, assets } = useWallet()
  const [copied, setCopied] = useState(false)

  const totalChange = assets.reduce((acc, a) => acc + a.priceChange24h, 0) / (assets.length || 1)

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3 px-5 py-8 bg-[#111118]"
    >
      {/* Balance label */}
      <span className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">
        Total Balance
      </span>

      {/* Balance amount */}
      <div className="flex items-end gap-1">
        <motion.span
          key={totalBalanceUsd}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white tracking-tight"
        >
          {formatUsd(totalBalanceUsd)}
        </motion.span>
      </div>

      {/* 24h change */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`flex items-center gap-1 text-sm font-medium ${
          totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        <span>{totalChange >= 0 ? '↑' : '↓'}</span>
        <span>{formatPriceChange(Math.abs(totalChange))} today</span>
      </motion.div>

      {/* Address chip */}
      {isConnected && address && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.07] transition-all"
        >
          <span className="text-[11px] font-mono text-gray-400">
            {shortenAddress(address, 6)}
          </span>
          {copied ? (
            <Check size={11} className="text-emerald-400" />
          ) : (
            <Copy size={11} className="text-gray-600" />
          )}
        </motion.button>
      )}
    </motion.div>
  )
}