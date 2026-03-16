'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/Button'
import { Check, Wifi, WifiOff } from 'lucide-react'

const WALLET_OPTIONS = [
  {
    id: 'metamask' as const,
    name: 'MetaMask',
    description: 'Browser extension wallet',
    emoji: '🦊',
    color: '#f6851b',
  },
  {
    id: 'walletconnect' as const,
    name: 'WalletConnect',
    description: 'Scan QR with mobile wallet',
    emoji: '⬡',
    color: '#3b99fc',
  },
  {
    id: 'phantom' as const,
    name: 'Phantom',
    description: 'Solana & multi-chain wallet',
    emoji: '👻',
    color: '#9945ff',
  },
  {
    id: 'mock' as const,
    name: 'Demo Wallet',
    description: 'Connect with mock data',
    emoji: '🔮',
    color: '#6c5dff',
  },
]

export function ConnectScreen() {
  const { handleConnect, handleDisconnect, isConnected, isConnecting, connectedProvider, address } = useWallet()
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [justConnected, setJustConnected] = useState<string | null>(null)

  const handleWalletConnect = async (id: typeof WALLET_OPTIONS[number]['id']) => {
    setConnectingId(id)
    await handleConnect(id)
    setConnectingId(null)
    setJustConnected(id)
    setTimeout(() => setJustConnected(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-4 p-5"
    >

      {/* Connected state banner */}
      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
          >
            <div className="flex items-center gap-2.5">
              <Wifi size={14} className="text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-emerald-400">Wallet Connected</p>
                <p className="text-[10px] text-emerald-600 font-mono mt-0.5">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-[11px]"
            >
              Disconnect
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section label */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-medium mb-1">
          {isConnected ? 'Switch Wallet' : 'Choose Wallet'}
        </p>
        <p className="text-xs text-gray-600">
          {isConnected
            ? 'Connect a different wallet provider'
            : 'Select a provider to connect your wallet'}
        </p>
      </div>

      {/* Wallet options */}
      <div className="flex flex-col gap-2">
        {WALLET_OPTIONS.map((wallet, i) => {
          const isThisConnecting = connectingId === wallet.id
          const isThisConnected = isConnected && connectedProvider === wallet.id
          const justDone = justConnected === wallet.id

          return (
            <motion.button
              key={wallet.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isThisConnecting && handleWalletConnect(wallet.id)}
              disabled={isThisConnecting || isConnecting}
              className="flex items-center gap-3.5 p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/20 rounded-2xl transition-all text-left disabled:opacity-60"
            >
              {/* Logo */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${wallet.color}18` }}
              >
                {wallet.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{wallet.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{wallet.description}</p>
              </div>

              {/* State indicator */}
              <div className="flex-shrink-0">
                <AnimatePresence mode="wait">
                  {isThisConnecting ? (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"
                    />
                  ) : isThisConnected || justDone ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"
                    >
                      <Check size={11} className="text-emerald-400" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="arrow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-600 text-sm"
                    >
                      ›
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-gray-600 text-center leading-relaxed pt-1">
        PhantomLite never stores your private keys.<br />
        All connections are non-custodial.
      </p>

    </motion.div>
  )
}