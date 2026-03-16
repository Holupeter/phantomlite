'use client'

import { motion } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { formatUsd, formatPriceChange } from '@/lib/utils'
import { useState } from 'react'

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

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-6)}`
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: '#111118',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '36px 24px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >

      {/* Label */}
      <span style={{
        fontSize: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#6b7280',
        fontWeight: 500,
      }}>
        Total Balance
      </span>

      {/* Amount */}
      <motion.div
        key={totalBalanceUsd}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: -1.5,
          lineHeight: 1,
        }}
      >
        {formatUsd(totalBalanceUsd)}
      </motion.div>

      {/* 24h change */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: totalChange >= 0 ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
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
          style={{
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.07)',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
        >
          <span style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#9ca3af',
          }}>
            {shortAddress}
          </span>
          <span style={{
            fontSize: 12,
            color: copied ? '#34d399' : '#4b5563',
            transition: 'color 0.2s',
          }}>
            {copied ? '✓' : '⎘'}
          </span>
        </motion.button>
      )}

    </motion.div>
  )
}