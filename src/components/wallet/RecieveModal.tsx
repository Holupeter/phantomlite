'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { useWallet } from '@/hooks/useWallet'
import { shortenAddress } from '@/lib/utils'
import QRCode from 'qrcode.react'
import { Copy, Check } from 'lucide-react'

const NETWORKS = ['ETH', 'SOL', 'USDC', 'MATIC']

const ADDRESSES: Record<string, string> = {
  ETH: '0x3f7a8c4d2e1b9f6a5c0d8e3f7a8c4d2e1b9f6a5c2d9',
  SOL: '7xKQ9mLp3nV8dRwTbYuCzEfAsDgHjMnPrStVwXyZcBqE',
  USDC: '0x3f7a8c4d2e1b9f6a5c0d8e3f7a8c4d2e1b9f6a5c2d9',
  MATIC: '0x3f7a8c4d2e1b9f6a5c0d8e3f7a8c4d2e1b9f6a5c2d9',
}

interface ReceiveModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const { address } = useWallet()
  const [selectedNetwork, setSelectedNetwork] = useState('ETH')
  const [copied, setCopied] = useState(false)

  const displayAddress = ADDRESSES[selectedNetwork] ?? address ?? ''

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive Crypto">
      <div className="flex flex-col items-center gap-5">

        {/* Network chips */}
        <div className="flex gap-2 flex-wrap justify-center">
          {NETWORKS.map((net) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedNetwork === net
                  ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                  : 'bg-white/[0.04] border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {net}
            </button>
          ))}
        </div>

        {/* QR Code */}
        <motion.div
          key={selectedNetwork}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-white rounded-2xl"
        >
          <QRCode
            value={displayAddress}
            size={160}
            bgColor="#ffffff"
            fgColor="#0a0a0f"
            level="M"
            includeMargin={false}
          />
        </motion.div>

        {/* Address block */}
        <div className="w-full flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
            Your {selectedNetwork} Address
          </span>
          <div className="flex items-center gap-2 p-3.5 bg-white/[0.04] border border-white/[0.07] rounded-xl">
            <span className="flex-1 text-xs font-mono text-gray-300 break-all leading-relaxed">
              {displayAddress}
            </span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} className="text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-600 text-center leading-relaxed">
            Only send {selectedNetwork} and compatible tokens to this address.
          </p>
        </div>

      </div>
    </Modal>
  )
}