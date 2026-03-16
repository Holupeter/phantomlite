import { useState } from 'react'
import { useTransactionStore } from '@/store/transactionStore'
import { useWalletStore } from '@/store/walletStore'
import { SendFormData, TransactionStatus, AssetSymbol } from '@/types'
import { isValidEthAddress, isValidAmount } from '@/lib/utils'

interface SendFormErrors {
  to?: string
  amount?: string
}

export function useTransaction() {
  const {
    transactions,
    queue,
    activeTransaction,
    sendTransaction,
    retryTransaction,
    setActiveTransaction,
    clearQueue,
  } = useTransactionStore()

  const { assets } = useWalletStore()

  const [formErrors, setFormErrors] = useState<SendFormErrors>({})
  const [isSending, setIsSending] = useState(false)

  // Form validation
  const validateForm = (formData: SendFormData): boolean => {
    const errors: SendFormErrors = {}
    const asset = assets.find((a) => a.symbol === formData.asset)
    const maxBalance = asset?.balance ?? 0

    if (!isValidEthAddress(formData.to)) {
      errors.to = 'Invalid wallet address'
    }

    if (!isValidAmount(formData.amount, maxBalance)) {
      const num = parseFloat(formData.amount)
      if (isNaN(num) || num <= 0) {
        errors.amount = 'Enter a valid amount'
      } else {
        errors.amount = `Insufficient balance. Max: ${maxBalance} ${formData.asset}`
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Send handler
  const handleSend = async (formData: SendFormData) => {
    if (!validateForm(formData)) return

    const balanceMap = assets.reduce((acc, a) => {
      acc[a.symbol] = a.balance
      return acc
    }, {} as Record<string, number>)

    setIsSending(true)
    try {
      await sendTransaction(formData, balanceMap)
    } finally {
      setIsSending(false)
    }
  }

  // Retry handler
  const handleRetry = async (txId: string) => {
    setIsSending(true)
    try {
      await retryTransaction(txId)
    } finally {
      setIsSending(false)
    }
  }

  // Filtered views
  const getTransactionsByStatus = (status: TransactionStatus) => {
    return transactions.filter((tx) => tx.status === status)
  }

  const getTransactionsByAsset = (symbol: AssetSymbol) => {
    return transactions.filter((tx) => tx.asset === symbol)
  }

  const pendingTransactions = transactions.filter((tx) => tx.status === 'pending')
  const failedTransactions = transactions.filter((tx) => tx.status === 'failed')
  const successTransactions = transactions.filter((tx) => tx.status === 'success')

  return {
    // State
    transactions,
    queue,
    activeTransaction,
    formErrors,
    isSending,
    pendingTransactions,
    failedTransactions,
    successTransactions,

    // Helpers
    getTransactionsByStatus,
    getTransactionsByAsset,

    // Actions
    handleSend,
    handleRetry,
    setActiveTransaction,
    clearQueue,
    validateForm,
    setFormErrors,
  }
}