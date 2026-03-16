'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'

const WALLET_OPTIONS = [
  {
    id: 'metamask' as const,
    name: 'MetaMask',
    description: 'Browser extension wallet',
    emoji: '🦊',
    bg: 'rgba(246,133,27,0.1)',
    border: 'rgba(246,133,27,0.2)',
  },
  {
    id: 'walletconnect' as const,
    name: 'WalletConnect',
    description: 'Scan QR with mobile wallet',
    emoji: '⬡',
    bg: 'rgba(59,153,252,0.1)',
    border: 'rgba(59,153,252,0.2)',
  },
  {
    id: 'phantom' as const,
    name: 'Phantom',
    description: 'Solana & multi-chain wallet',
    emoji: '👻',
    bg: 'rgba(153,69,255,0.1)',
    border: 'rgba(153,69,255,0.2)',
  },
  {
    id: 'mock' as const,
    name: 'Coinbase Wallet',
    description: 'Self-custody wallet',
    emoji: '🔵',
    bg: 'rgba(22,82,240,0.1)',
    border: 'rgba(22,82,240,0.2)',
  },
  {
    id: 'mock' as const,
    name: 'Demo Wallet',
    description: 'Connect with mock data',
    emoji: '🔮',
    bg: 'rgba(108,93,255,0.1)',
    border: 'rgba(108,93,255,0.2)',
  },
]

export function ConnectScreen() {
  const {
    handleConnect,
    handleDisconnect,
    isConnected,
    isConnecting,
    connectedProvider,
    address,
  } = useWallet()

  const [connectingIndex, setConnectingIndex] = useState<number | null>(null)
  const [justConnectedIndex, setJustConnectedIndex] = useState<number | null>(null)

  const handleWalletClick = async (
    id: typeof WALLET_OPTIONS[number]['id'],
    index: number
  ) => {
    if (connectingIndex !== null) return
    setConnectingIndex(index)
    await handleConnect(id)
    setConnectingIndex(null)
    setJustConnectedIndex(index)
    setTimeout(() => setJustConnectedIndex(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      <div style={{
        padding: '24px 20px 16px',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
          Connect Wallet
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          Link your existing wallet to PhantomLite
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>

        {/* Connected banner */}
        <AnimatePresence>
          {isConnected && address && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'rgba(52,211,153,0.08)',
                border: '0.5px solid rgba(52,211,153,0.2)',
                borderRadius: 14,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#34d399', flexShrink: 0,
                  animation: 'pulse 2s infinite',
                }} />
                <div>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: '#34d399',
                  }}>
                    {connectedProvider === 'metamask' ? 'MetaMask'
                      : connectedProvider === 'walletconnect' ? 'WalletConnect'
                      : connectedProvider === 'phantom' ? 'Phantom'
                      : 'Demo Wallet'} Connected
                  </div>
                  <div style={{
                    fontSize: 10, color: 'rgba(52,211,153,0.6)',
                    fontFamily: 'monospace', marginTop: 2,
                  }}>
                    {address.slice(0, 6)}…{address.slice(-4)}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(239,68,68,0.1)',
                  border: '0.5px solid rgba(239,68,68,0.2)',
                  fontSize: 11, fontWeight: 500,
                  color: '#f87171', cursor: 'pointer',
                }}
              >
                Disconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section label */}
        <div style={{
          fontSize: 10, letterSpacing: 1.5,
          textTransform: 'uppercase', color: '#6b7280',
          fontWeight: 500,
        }}>
          {isConnected ? 'Switch Wallet' : 'Choose Provider'}
        </div>

        {/* Wallet options */}
        {WALLET_OPTIONS.map((wallet, i) => {
          const isThisConnecting = connectingIndex === i
          const isThisConnected = justConnectedIndex === i

          return (
            <motion.button
              key={`${wallet.id}-${i}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWalletClick(wallet.id, i)}
              disabled={isThisConnecting || isConnecting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                cursor: isThisConnecting ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: connectingIndex !== null && connectingIndex !== i ? 0.5 : 1,
                transition: 'border-color 0.2s, background 0.2s, opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                if (connectingIndex === null) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              {/* Logo */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: wallet.bg,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22,
                flexShrink: 0,
              }}>
                {wallet.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 500, color: '#fff',
                }}>
                  {wallet.name}
                </div>
                <div style={{
                  fontSize: 11, color: '#6b7280', marginTop: 2,
                }}>
                  {wallet.description}
                </div>
              </div>

              {/* State indicator */}
              <div style={{ flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  {isThisConnecting ? (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        width: 20, height: 20,
                        border: '2px solid rgba(255,255,255,0.15)',
                        borderTopColor: '#a78bfa',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                  ) : isThisConnected ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(52,211,153,0.15)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11, color: '#34d399',
                      }}
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <motion.span
                      key="arrow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: 18, color: '#374151',
                      }}
                    >
                      ›
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

            </motion.button>
          )
        })}

        {/* Footer note */}
        <div style={{
          textAlign: 'center',
          fontSize: 11, color: '#4b5563',
          lineHeight: 1.7, paddingTop: 8,
        }}>
          PhantomLite never stores your private keys.<br />
          All connections are non-custodial.
        </div>

      </div>
    </div>
  )
}