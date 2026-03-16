'use client'

import { motion } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { formatUsd, formatCrypto, formatPriceChange } from '@/lib/utils'
import { Asset } from '@/types'
import { TrendingUp, TrendingDown } from 'lucide-react'

const ASSET_ICONS: Record<string, string> = {
  ETH: 'Ξ',
  SOL: '◎',
  USDC: '$',
  MATIC: '⬡',
}

function AssetRow({ asset, index }: { asset: Asset; index: number }) {
  const isPositive = asset.priceChange24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.05] last:border-0"
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
        style={{ backgroundColor: `${asset.iconColor}20`, color: asset.iconColor }}
      >
        {ASSET_ICONS[asset.symbol] ?? asset.symbol[0]}
      </div>

      {/* Name + balance */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{asset.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatCrypto(asset.balance, asset.symbol)}
        </p>
      </div>

      {/* Value + change */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-white tabular-nums">
          {formatUsd(asset.usdValue)}
        </p>
        <div
          className={`flex items-center justify-end gap-0.5 mt-0.5 text-xs font-medium ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp size={10} />
          ) : (
            <TrendingDown size={10} />
          )}
          <span>{formatPriceChange(asset.priceChange24h)}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function AssetList() {
  const { assets } = useWallet()

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <p className="text-sm text-gray-500">No assets found</p>
        <p className="text-xs text-gray-600">Connect your wallet to see your assets</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">
          Assets
        </span>
        <span className="text-[11px] text-gray-600">
          {assets.length} tokens
        </span>
      </div>
      <div className="border-t border-white/[0.05]">
        {assets.map((asset, i) => (
          <AssetRow key={asset.id} asset={asset} index={i} />
        ))}
      </div>
    </div>
  )
}