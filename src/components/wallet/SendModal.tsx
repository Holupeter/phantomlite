'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { useTransaction } from '@/hooks/useTransaction'
import { useWallet } from '@/hooks/useWallet'
import { SendFormData, AssetSymbol } from '@/types'

type SendStep = 'form' | 'review' | 'status'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  defaultAsset?: AssetSymbol
}

const ASSET_COLORS: Record<string, { color: string; bg: string }> = {
  ETH:   { color: '#627eea', bg: 'rgba(98,126,234,0.15)' },
  SOL:   { color: '#9945ff', bg: 'rgba(153,69,255,0.15)' },
  USDC:  { color: '#2775ca', bg: 'rgba(39,117,202,0.15)' },
  MATIC: { color: '#8247e5', bg: 'rgba(130,71,229,0.15)' },
}

export function SendModal({ isOpen, onClose, defaultAsset = 'ETH' }: SendModalProps) {
  const { assets, network } = useWallet()
  const { handleSend, formErrors, isSending, activeTransaction, setFormErrors } = useTransaction()

  const [step, setStep] = useState<SendStep>('form')
  const [formData, setFormData] = useState<SendFormData>({
    to: '',
    amount: '',
    asset: defaultAsset,
    network,
  })

  const selectedAsset = assets.find((a) => a.symbol === formData.asset)
  const amountNum = parseFloat(formData.amount) || 0
  const pricePerUnit = selectedAsset ? selectedAsset.usdValue / selectedAsset.balance : 0
  const usdEstimate = amountNum * pricePerUnit

  const isFormValid =
    formData.to.length > 5 &&
    amountNum > 0 &&
    amountNum <= (selectedAsset?.balance ?? 0)

  const handleFieldChange = (field: keyof SendFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors({})
  }

  const handleSetMax = () => {
    if (!selectedAsset) return
    handleFieldChange('amount', selectedAsset.balance.toString())
  }

  const handleConfirm = async () => {
    setStep('status')
    await handleSend({ ...formData, network })
  }

  const handleClose = () => {
    setStep('form')
    setFormData({ to: '', amount: '', asset: defaultAsset, network })
    setFormErrors({})
    onClose()
  }

  const statusState =
    !activeTransaction || activeTransaction.status === 'pending'
      ? 'pending'
      : activeTransaction.status

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send Crypto">
      <AnimatePresence mode="wait">

        {/* ── STEP 1: Form ── */}
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >

            {/* Asset selector */}
            <div>
              <div style={{
                fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', color: '#6b7280',
                fontWeight: 500, marginBottom: 6,
              }}>
                Asset
              </div>
              <select
                value={formData.asset}
                onChange={(e) => handleFieldChange('asset', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                {assets.map((a) => (
                  <option
                    key={a.symbol}
                    value={a.symbol}
                    style={{ background: '#1e1e2a', color: '#fff' }}
                  >
                    {a.name} ({a.symbol}) — {a.balance.toFixed(4)} {a.symbol}
                  </option>
                ))}
              </select>
              {selectedAsset && (
                <div style={{
                  fontSize: 11, color: '#6b7280',
                  marginTop: 5, paddingLeft: 2,
                }}>
                  Available: {selectedAsset.balance.toFixed(4)} {selectedAsset.symbol}
                </div>
              )}
            </div>

            {/* Recipient address */}
            <div>
              <div style={{
                fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', color: '#6b7280',
                fontWeight: 500, marginBottom: 6,
              }}>
                Recipient Address
              </div>
              <input
                type="text"
                placeholder="0x... or ENS name"
                value={formData.to}
                onChange={(e) => handleFieldChange('to', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: `0.5px solid ${formErrors.to
                    ? 'rgba(239,68,68,0.5)'
                    : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: '#fff',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formErrors.to
                    ? 'rgba(239,68,68,0.5)'
                    : 'rgba(255,255,255,0.1)'
                }}
              />
              {formErrors.to && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, color: '#f87171', marginTop: 5,
                }}>
                  ⚠ {formErrors.to}
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 6,
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: 1.5,
                  textTransform: 'uppercase', color: '#6b7280', fontWeight: 500,
                }}>
                  Amount
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                  Max: {selectedAsset?.balance.toFixed(4)} {formData.asset}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: `0.5px solid ${formErrors.amount
                        ? 'rgba(239,68,68,0.5)'
                        : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 12,
                      padding: '12px 50px 12px 14px',
                      fontSize: 13,
                      color: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formErrors.amount
                        ? 'rgba(239,68,68,0.5)'
                        : 'rgba(255,255,255,0.1)'
                    }}
                  />
                  <span style={{
                    position: 'absolute', right: 12,
                    top: '50%', transform: 'translateY(-50%)',
                    fontSize: 11, color: '#6b7280',
                    fontFamily: 'monospace', pointerEvents: 'none',
                  }}>
                    {formData.asset}
                  </span>
                </div>
                <button
                  onClick={handleSetMax}
                  style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(124,58,237,0.12)',
                    border: '0.5px solid rgba(124,58,237,0.25)',
                    fontSize: 11, fontWeight: 600, color: '#a78bfa',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  MAX
                </button>
              </div>

              {/* USD estimate */}
              {amountNum > 0 && !formErrors.amount && (
                <div style={{
                  fontSize: 11, color: '#6b7280',
                  marginTop: 5, paddingLeft: 2,
                }}>
                  ≈ ${usdEstimate.toFixed(2)} USD
                </div>
              )}

              {/* Insufficient balance error */}
              {formErrors.amount && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 10, marginTop: 8,
                  background: 'rgba(239,68,68,0.08)',
                  border: '0.5px solid rgba(239,68,68,0.2)',
                  fontSize: 12, color: '#f87171',
                }}>
                  ⚠ {formErrors.amount}
                </div>
              )}
            </div>

            {/* Gas fee */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.06)',
              borderRadius: 10, fontSize: 12,
            }}>
              <span style={{ color: '#6b7280' }}>Estimated gas fee</span>
              <span style={{
                color: '#d1d5db',
                fontFamily: 'monospace', fontSize: 11,
              }}>
                ~$2.40 (0.00089 ETH)
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => isFormValid && setStep('review')}
              disabled={!isFormValid}
              style={{
                width: '100%', padding: 14,
                background: isFormValid
                  ? '#7c3aed'
                  : 'rgba(124,58,237,0.3)',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 600, color: '#fff',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                opacity: isFormValid ? 1 : 0.5,
                transition: 'opacity 0.2s, background 0.2s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
              }}
            >
              Review Transaction →
            </button>

          </motion.div>
        )}

        {/* ── STEP 2: Review ── */}
        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >

            {/* Review card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.07)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              {[
                { label: 'From',      value: '0x3f7a…5c2d9' },
                { label: 'To',        value: `${formData.to.slice(0, 6)}…${formData.to.slice(-4)}` },
                { label: 'Amount',    value: `${amountNum.toFixed(4)} ${formData.asset}` },
                { label: 'USD Value', value: `≈ $${usdEstimate.toFixed(2)}` },
                { label: 'Network',   value: network.charAt(0).toUpperCase() + network.slice(1) },
                { label: 'Gas fee',   value: '~$2.40' },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: i < arr.length - 1
                      ? '0.5px solid rgba(255,255,255,0.05)'
                      : 'none',
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: '#6b7280' }}>{row.label}</span>
                  <span style={{
                    color: '#fff',
                    fontFamily: 'monospace', fontSize: 11,
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setStep('form')}
                style={{
                  flex: 1, padding: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, fontSize: 13,
                  fontWeight: 600, color: '#fff', cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSending}
                style={{
                  flex: 1, padding: 14,
                  background: '#7c3aed', border: 'none',
                  borderRadius: 12, fontSize: 13,
                  fontWeight: 600, color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  opacity: isSending ? 0.7 : 1,
                }}
              >
                {isSending ? (
                  <>
                    <span style={{
                      width: 14, height: 14,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Sending...
                  </>
                ) : 'Confirm Send'}
              </button>
            </div>

          </motion.div>
        )}

        {/* ── STEP 3: Status ── */}
        {step === 'status' && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 14,
              padding: '12px 0 8px', textAlign: 'center',
            }}
          >

            {/* Status icon */}
            <motion.div
              animate={statusState === 'pending' ? { scale: [1, 1.06, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.8 }}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 26,
                background:
                  statusState === 'pending' ? 'rgba(251,191,36,0.12)' :
                  statusState === 'success' ? 'rgba(52,211,153,0.12)' :
                  'rgba(239,68,68,0.12)',
              }}
            >
              {statusState === 'pending' ? '⏳'
                : statusState === 'success' ? '✓' : '✕'}
            </motion.div>

            {/* Title */}
            <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>
              {statusState === 'pending' ? 'Broadcasting...'
                : statusState === 'success' ? 'Transaction Confirmed'
                : 'Transaction Failed'}
            </div>

            {/* Description */}
            <div style={{
              fontSize: 12, color: '#6b7280',
              lineHeight: 1.7, maxWidth: 260,
            }}>
              {statusState === 'pending'
                ? 'Your transaction has been submitted to the network and is awaiting confirmation.'
                : statusState === 'success'
                ? 'Your funds have been sent successfully on the network.'
                : 'This transaction failed due to insufficient gas or a network error. Your funds were not sent.'}
            </div>

            {/* Status badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              fontSize: 11, fontWeight: 500,
              background:
                statusState === 'pending' ? 'rgba(251,191,36,0.1)' :
                statusState === 'success' ? 'rgba(52,211,153,0.1)' :
                'rgba(239,68,68,0.1)',
              border:
                statusState === 'pending' ? '0.5px solid rgba(251,191,36,0.2)' :
                statusState === 'success' ? '0.5px solid rgba(52,211,153,0.2)' :
                '0.5px solid rgba(239,68,68,0.2)',
              color:
                statusState === 'pending' ? '#fbbf24' :
                statusState === 'success' ? '#34d399' :
                '#f87171',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'currentColor', display: 'inline-block',
                animation: statusState === 'pending' ? 'pulse 1.5s infinite' : 'none',
              }} />
              {statusState === 'pending' ? 'Pending'
                : statusState === 'success' ? 'Confirmed' : 'Failed'}
            </div>

            {/* CTA button */}
            <button
              onClick={handleClose}
              disabled={statusState === 'pending'}
              style={{
                width: '100%', padding: 14, marginTop: 8,
                background:
                  statusState === 'failed'
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(255,255,255,0.05)',
                border:
                  statusState === 'failed'
                    ? '0.5px solid rgba(239,68,68,0.2)'
                    : '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 12, fontSize: 14, fontWeight: 600,
                color: statusState === 'failed' ? '#f87171' : '#fff',
                cursor: statusState === 'pending' ? 'not-allowed' : 'pointer',
                opacity: statusState === 'pending' ? 0.5 : 1,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'opacity 0.2s',
              }}
            >
              {statusState === 'pending' ? (
                <>
                  <span style={{
                    width: 14, height: 14,
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Processing...
                </>
              ) : 'Done'}
            </button>

          </motion.div>
        )}

      </AnimatePresence>
    </Modal>
  )
}