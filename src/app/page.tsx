'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { BalanceCard } from '@/components/wallet/BalanceCard'
import { AssetList } from '@/components/wallet/AssetList'
import { ActionButtons } from '@/components/wallet/ActionButtons'
import { TransactionHistory } from '@/components/wallet/TransactionHistory'
import { ConnectScreen } from '@/components/wallet/ConnectScreen'
import { SendModal } from '@/components/wallet/SendModal'
import { ReceiveModal } from '@/components/wallet/ReceiveModal'
import { WalletSkeleton, TransactionSkeleton } from '@/components/ui/SkeletonLoader'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useWallet } from '@/hooks/useWallet'
import { useEffect } from 'react'

type Tab = 'home' | 'send' | 'receive' | 'history' | 'connect'


export default function Home() {
  const { isConnected, handleConnect } = useWallet()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [sendOpen, setSendOpen]     = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [isLoading, setIsLoading]   = useState(true)

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2500))
      await handleConnect('mock')
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (tab: string) => {
    if (tab === 'send') {
      setSendOpen(true)
      return
    }
    if (tab === 'receive') {
      setReceiveOpen(true)
      return
    }
    setActiveTab(tab as Tab)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0a0a0f] rounded-[28px] border border-white/[0.07] overflow-hidden flex flex-col shadow-2xl"
        style={{ minHeight: '680px', maxHeight: '780px' }}
      >

        {/* Navbar */}
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <AnimatePresence mode="wait">

              {/* Loading skeleton */}
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut'}}
                >
                  <WalletSkeleton />
                </motion.div>
              )}

              {/* Home tab */}
              {!isLoading && activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut'}}
                >
                  <BalanceCard />
                  <ActionButtons
                    onSend={() => setSendOpen(true)}
                    onReceive={() => setReceiveOpen(true)}
                    onConnect={() => setActiveTab('connect')}
                    onCreate={() => setActiveTab('connect')}
                    disabled={!isConnected}
                  />
                  <AssetList />
                </motion.div>
              )}

              {/* History tab */}
              {!isLoading && activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut'}}
                >
                  <div className="px-5 pt-5 pb-2">
                    <h1 className="text-base font-semibold text-white">
                      Transaction History
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      All your recent activity
                    </p>
                  </div>
                  <TransactionHistory />
                </motion.div>
              )}

              {/* Connect tab */}
              {!isLoading && activeTab === 'connect' && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeInOut'}}
                >
                  <div className="px-5 pt-5 pb-2">
                    <h1 className="text-base font-semibold text-white">
                      Connect Wallet
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Link your existing wallet
                    </p>
                  </div>
                  <ConnectScreen />
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

      </div>

      {/* Modals */}
      <SendModal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
      />
      <ReceiveModal
        isOpen={receiveOpen}
        onClose={() => setReceiveOpen(false)}
      />

    </main>
  )
}