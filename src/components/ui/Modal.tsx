'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 40,
            }}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              background: '#16161f',
              borderRadius: '22px 22px 0 0',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderBottom: 'none',
              maxHeight: '88%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >

            {/* Handle bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '12px 0 4px',
              flexShrink: 0,
            }}>
              <div style={{
                width: 36,
                height: 4,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
              }} />
            </div>

            {/* Header */}
            {title && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px 14px',
                borderBottom: '0.5px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                }}>
                  {title}
                </span>
                <button
                  onClick={onClose}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Scrollable content */}
            <div style={{
              padding: '20px 20px 36px',
              overflowY: 'auto',
              flex: 1,
            }}>
              {children}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}