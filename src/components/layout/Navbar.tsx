'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { useTransactionStore } from '@/store/transactionStore'
import { shortenAddress } from '@/lib/utils'
import { NETWORK_CONFIGS } from '@/lib/mockData'
import { useState } from 'react'
import { ChevronDown, Wifi, WifiOff } from 'lucide-react'

export function Navbar() {
  const { address, isConnected, network, handleNetworkSwitch, pendingTxCount } = useWallet()
  const [showNetworkMenu, setShowNetworkMenu] = useState(false)

  const currentNetwork = NETWORK_CONFIGS.find((n) => n.id === network)

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] bg-[#111118]">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">PL</span>
        </div>
        <span className="text-sm font-bold text-white tracking-tight">
          Phantom<span className="text-violet-400">Lite</span>
        </span>
      </div>

      <div className="flex items-center gap-2">

        {/* Pending tx indicator */}
        <AnimatePresence>
          {pendingTxCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-medium text-amber-400">
                {pendingTxCount} pending
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Network switcher */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-gray-300">
              {currentNetwork?.label ?? 'Ethereum'}
            </span>
            <ChevronDown size={11} className="text-gray-500" />
          </button>

          <AnimatePresence>
            {showNetworkMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNetworkMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-40 bg-[#1e1e2a] border border-white/10 rounded-2xl overflow-hidden z-20 shadow-xl"
                >
                  {NETWORK_CONFIGS.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => {
                        handleNetworkSwitch(net.id)
                        setShowNetworkMenu(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          net.id === network ? 'bg-emerald-400' : 'bg-white/20'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          net.id === network ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {net.label}
                      </span>
                      {net.id === network && (
                        <span className="ml-auto text-[10px] text-violet-400">Active</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Connection status / address */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10">
          {isConnected ? (
            <Wifi size={11} className="text-emerald-400" />
          ) : (
            <WifiOff size={11} className="text-gray-500" />
          )}
          <span className="text-[11px] font-medium text-gray-300">
            {isConnected && address ? shortenAddress(address) : 'Not connected'}
          </span>
        </div>

      </div>
    </div>
  )
}