'use client'

import { motion } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { Asset } from '@/types'

const ASSET_ICONS: Record<string, string> = {
  ETH: 'Ξ',
  SOL: '◎',
  USDC: '$',
  MATIC: '⬡',
}

const ASSET_COLORS: Record<string, { color: string; bg: string }> = {
  ETH:  { color: '#627eea', bg: 'rgba(98,126,234,0.15)' },
  SOL:  { color: '#9945ff', bg: 'rgba(153,69,255,0.15)' },
  USDC: { color: '#2775ca', bg: 'rgba(39,117,202,0.15)' },
  MATIC:{ color: '#8247e5', bg: 'rgba(130,71,229,0.15)' },
}

function AssetRow({ asset, index }: { asset: Asset; index: number }) {
  const isPositive = asset.priceChange24h > 0
  const isFlat = asset.priceChange24h === 0
  const colors = ASSET_COLORS[asset.symbol] ?? { color: '#9ca3af', bg: 'rgba(156,163,175,0.15)' }

  const changeColor = isFlat ? '#6b7280' : isPositive ? '#34d399' : '#f87171'
  const changePrefix = isFlat ? '' : isPositive ? '↑ +' : '↓ '

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 20px',
        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Icon */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: colors.bg,
        color: colors.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {ASSET_ICONS[asset.symbol] ?? asset.symbol[0]}
      </div>

      {/* Name + balance */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#ffffff',
          marginBottom: 2,
        }}>
          {asset.name}
        </div>
        <div style={{
          fontSize: 11,
          color: '#6b7280',
        }}>
          {asset.balance.toFixed(4)} {asset.symbol}
        </div>
      </div>

      {/* Value + change */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#ffffff',
          marginBottom: 2,
          fontVariantNumeric: 'tabular-nums',
        }}>
          ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{
          fontSize: 11,
          color: changeColor,
        }}>
          {changePrefix}{Math.abs(asset.priceChange24h).toFixed(2)}%
        </div>
      </div>

    </motion.div>
  )
}

export function AssetList() {
  const { assets } = useWallet()

  return (
    <div>

      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 10px',
      }}>
        <span style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#6b7280',
          fontWeight: 500,
        }}>
          Assets
        </span>
        <span style={{
          fontSize: 11,
          color: '#4b5563',
        }}>
          {assets.length} tokens
        </span>
      </div>

      {/* Rows */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
        {assets.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 20px',
            gap: 8,
          }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>No assets found</span>
            <span style={{ fontSize: 11, color: '#4b5563' }}>
              Connect your wallet to see your assets
            </span>
          </div>
        ) : (
          assets.map((asset, i) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              index={i}
            />
          ))
        )}
      </div>

    </div>
  )
}