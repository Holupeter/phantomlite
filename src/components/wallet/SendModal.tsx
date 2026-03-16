'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useTransaction } from '@/hooks/useTransaction'
import { useWallet } from '@/hooks/useWallet'
import { SendFormData, AssetSymbol } from '@/types'
import { formatUsd, formatCrypto, shortenAddress } from '@/lib/utils'
import { AlertCircle, ChevronDown, ArrowRight } from 'lucide-react'

const ASSET_ICONS: Record<string, string> = {
  ETH: 'Ξ',
  SOL: '◎',
  USDC: '$',
  MATIC: '⬡',
}

type SendStep = 'form' | 'review' | 'status'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  defaultAsset?: AssetSymbol
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
  const usdEstimate = amountNum * (selectedAsset ? selectedAsset.usdValue / selectedAsset.balance : 0)

  const handleFieldChange = (field: keyof SendFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors({})
  }

  const handleSetMax = () => {
    if (!selectedAsset) return
    handleFieldChange('amount', selectedAsset.balance.toString())
  }

  const handleReview = () => {
    setStep('review')
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send Crypto">

      <AnimatePresence mode="wait">

        {/* STEP 1: Form */}
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Asset selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                Asset
              </label>
              <div className="relative">
                <select
                  value={formData.asset}
                  onChange={(e) => handleFieldChange('asset', e.target.value)}
                  className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
                >
                  {assets.map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#1e1e2a]">
                      {a.name} ({a.symbol}) — {formatCrypto(a.balance, a.symbol)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Recipient */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="0x... or ENS name"
                value={formData.to}
                onChange={(e) => handleFieldChange('to', e.target.value)}
                className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors font-mono ${
                  formErrors.to
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-violet-500/50'
                }`}
              />
              {formErrors.to && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-xs text-red-400"
                >
                  <AlertCircle size={11} />
                  {formErrors.to}
                </motion.div>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                  Amount
                </label>
                <span className="text-[11px] text-gray-500">
                  Balance: {selectedAsset ? formatCrypto(selectedAsset.balance, selectedAsset.symbol) : '—'}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                    className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 pr-16 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                      formErrors.amount
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-violet-500/50'
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                    {formData.asset}
                  </span>
                </div>
                <button
                  onClick={handleSetMax}
                  className="px-3.5 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-500/20 transition-colors"
                >
                  MAX
                </button>
              </div>

              {/* USD estimate */}
              {amountNum > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500"
                >
                  ≈ {formatUsd(usdEstimate)}
                </motion.span>
              )}

              {formErrors.amount && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-xs text-red-400"
                >
                  <AlertCircle size={11} />
                  {formErrors.amount}
                </motion.div>
              )}
            </div>

            {/* Gas fee estimate */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-gray-500">Estimated gas fee</span>
              <span className="text-xs font-medium text-gray-300 font-mono">
                ~$2.40 (0.00089 ETH)
              </span>
            </div>

            <Button
              fullWidth
              onClick={handleReview}
              disabled={!formData.to || !formData.amount}
              className="mt-1"
            >
              Review Transaction
              <ArrowRight size={15} />
            </Button>
          </motion.div>
        )}

        {/* STEP 2: Review */}
        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              {[
                { label: 'From', value: shortenAddress('0x3f7a8c4d2e1b9f6a5c0d8e3f7a8c4d2e1b9f6a5c2d9', 6) },
                { label: 'To', value: shortenAddress(formData.to, 6) },
                { label: 'Amount', value: formatCrypto(amountNum, formData.asset) },
                { label: 'USD Value', value: `≈ ${formatUsd(usdEstimate)}` },
                { label: 'Network', value: network.charAt(0).toUpperCase() + network.slice(1) },
                { label: 'Gas fee', value: '~$2.40' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] last:border-0"
                >
                  <span className="text-xs text-gray-500">{row.label}</span>
                  <span className="text-xs font-medium text-white font-mono">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-1">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setStep('form')}
              >
                Back
              </Button>
              <Button
                fullWidth
                onClick={handleConfirm}
                loading={isSending}
              >
                Confirm Send
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Status */}
        {step === 'status' && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4 py-4"
          >
            {/* Status icon */}
            <motion.div
              animate={
                !activeTransaction || activeTransaction.status === 'pending'
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                !activeTransaction || activeTransaction.status === 'pending'
                  ? 'bg-amber-400/10'
                  : activeTransaction.status === 'success'
                  ? 'bg-emerald-400/10'
                  : 'bg-red-400/10'
              }`}
            >
              {!activeTransaction || activeTransaction.status === 'pending'
                ? '⏳'
                : activeTransaction.status === 'success'
                ? '✓'
                : '✕'}
            </motion.div>

            {/* Status text */}
            <div className="text-center">
              <p className="text-base font-semibold text-white mb-1">
                {!activeTransaction || activeTransaction.status === 'pending'
                  ? 'Broadcasting Transaction...'
                  : activeTransaction.status === 'success'
                  ? 'Transaction Confirmed'
                  : 'Transaction Failed'}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[240px]">
                {!activeTransaction || activeTransaction.status === 'pending'
                  ? 'Your transaction has been submitted to the network.'
                  : activeTransaction.status === 'success'
                  ? 'Your funds have been sent successfully.'
                  : 'This transaction failed. You can retry from history.'}
              </p>
            </div>

            {activeTransaction && (
              <StatusBadge status={activeTransaction.status} />
            )}

            <Button
              fullWidth
              variant={
                activeTransaction?.status === 'failed' ? 'danger' : 'secondary'
              }
              onClick={handleClose}
              disabled={activeTransaction?.status === 'pending'}
              className="mt-2"
            >
              {activeTransaction?.status === 'pending'
                ? 'Processing...'
                : 'Done'}
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </Modal>
  )
}