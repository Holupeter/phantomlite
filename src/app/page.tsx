'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { AssetList } from '@/components/wallet/AssetList'
import { ActionButtons } from '@/components/wallet/ActionButtons'
import { TransactionHistory } from '@/components/wallet/TransactionHistory'
import { ConnectScreen } from '@/components/wallet/ConnectScreen'
import { CreateWalletScreen } from '@/components/wallet/CreateWalletScreen'
import { SendModal } from '@/components/wallet/SendModal'
import { ReceiveModal } from '@/components/wallet/ReceiveModal'
import { WalletSkeleton } from '@/components/ui/SkeletonLoader'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useWallet } from '@/hooks/useWallet'

type Tab = 'home' | 'history' | 'connect' | 'create'

export default function Home() {
  const { isConnected, handleConnect } = useWallet()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 2500))
      await handleConnect('mock')
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (tab: string) => {
    if (tab === 'send') { setSendOpen(true); return }
    if (tab === 'receive') { setReceiveOpen(true); return }
    setActiveTab(tab as Tab)
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#060608',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 448,
        height: 710,
        background: '#0a0a0f',
        borderRadius: 28,
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>

        {/* Navbar */}
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
        }}>
          <ErrorBoundary>
            <AnimatePresence mode="wait">

              {/* Loading skeleton */}
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <WalletSkeleton />
                </motion.div>
              )}

              {/* Home */}
              {!isLoading && activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <BalanceCard />
                  <ActionButtons
                    onSend={() => setSendOpen(true)}
                    onReceive={() => setReceiveOpen(true)}
                    onConnect={() => setActiveTab('connect')}
                    onCreate={() => setActiveTab('create')}
                    disabled={!isConnected}
                  />
                  <AssetList />
                </motion.div>
              )}

              {/* History */}
              {!isLoading && activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <div style={{ padding: '24px 20px 8px' }}>
                    <p style={{
                      fontSize: 18, fontWeight: 700, color: '#fff',
                    }}>
                      Transaction History
                    </p>
                    <p style={{
                      fontSize: 12, color: '#6b7280', marginTop: 4,
                    }}>
                      All your recent activity
                    </p>
                  </div>
                  <TransactionHistory />
                </motion.div>
              )}

              {/* Connect */}
              {!isLoading && activeTab === 'connect' && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <div style={{ padding: '24px 20px 8px' }}>
                    <p style={{
                      fontSize: 18, fontWeight: 700, color: '#fff',
                    }}>
                      Connect Wallet
                    </p>
                    <p style={{
                      fontSize: 12, color: '#6b7280', marginTop: 4,
                    }}>
                      Link your existing wallet
                    </p>
                  </div>
                  <ConnectScreen />
                </motion.div>
              )}

              {/* Create */}
              {!isLoading && activeTab === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  <CreateWalletScreen />
                </motion.div>
              )}

            </AnimatePresence>
          </ErrorBoundary>
        </div>

        {/* Bottom nav */}
        {!isLoading && (
          <ErrorBoundary>
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </ErrorBoundary>
        )}

        {/* Modals — rendered inside the card */}
        <SendModal
          isOpen={sendOpen}
          onClose={() => setSendOpen(false)}
        />
        <ReceiveModal
          isOpen={receiveOpen}
          onClose={() => setReceiveOpen(false)}
        />

      </div>
    </main>
  )
}