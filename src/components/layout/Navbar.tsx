'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { shortenAddress } from '@/lib/utils'
import { NETWORK_CONFIGS } from '@/lib/mockData'
import { useState } from 'react'
import { ChevronDown, Wifi } from 'lucide-react'

export function Navbar() {
  const { address, isConnected, network, handleNetworkSwitch, pendingTxCount } = useWallet()
  const [showNetworkMenu, setShowNetworkMenu] = useState(false)

  const currentNetwork = NETWORK_CONFIGS.find((n) => n.id === network)

  return (
    <div style={{ background: '#111118', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      className="flex items-center justify-between px-5 py-4"
    >

      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div
          style={{ background: '#7c3aed', width: 34, height: 34, borderRadius: 10 }}
          className="flex items-center justify-center flex-shrink-0"
        >
          <span className="text-white font-bold" style={{ fontSize: 11 }}>PL</span>
        </div>
        <span className="font-bold text-white whitespace-nowrap" style={{ fontSize: 14 }}>
          Phantom<span style={{ color: '#a78bfa' }}>Lite</span>
        </span>
      </div>

      {/* Right pills */}
      <div className="flex items-center gap-1 flex-shrink-0">

        {/* Pending */}
        <AnimatePresence>
          {pendingTxCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                background: 'rgba(251,191,36,0.1)',
                border: '0.5px solid rgba(251,191,36,0.2)',
              }}
            >
              <span
                className="flex-shrink-0"
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#fbbf24',
                  display: 'inline-block',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 500, color: '#fbbf24' }}>
                {pendingTxCount} pending
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Network switcher */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className="flex items-center gap-1.5 whitespace-nowrap"
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
            }}
          >
            <span
              className="flex-shrink-0"
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}
            />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#d1d5db' }}>
              {currentNetwork?.label ?? 'Ethereum'}
            </span>
            <ChevronDown size={11} style={{ color: '#6b7280' }} className="flex-shrink-0" />
          </button>

          <AnimatePresence>
            {showNetworkMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNetworkMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-20"
                  style={{
                    width: 176,
                    background: '#1e1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {NETWORK_CONFIGS.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => {
                        handleNetworkSwitch(net.id)
                        setShowNetworkMenu(false)
                      }}
                      className="w-full flex items-center gap-3"
                      style={{ padding: '12px 16px' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span
                        style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: net.id === network ? '#34d399' : 'rgba(255,255,255,0.2)',
                          display: 'inline-block',
                        }}
                      />
                      <span style={{
                        fontSize: 12, fontWeight: 500,
                        color: net.id === network ? '#fff' : '#9ca3af',
                      }}>
                        {net.label}
                      </span>
                      {net.id === network && (
                        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#a78bfa' }}>
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Address */}
        <div
          className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
          style={{
            padding: '6px 12px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.1)',
          }}
        >
          <Wifi size={11} style={{ color: isConnected ? '#34d399' : '#6b7280' }} className="flex-shrink-0" />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#d1d5db' }}>
            {isConnected && address ? shortenAddress(address, 3) : 'Not connected'}
          </span>
        </div>

      </div>
    </div>
  )
}