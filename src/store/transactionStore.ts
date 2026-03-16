import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import * as Sentry from '@sentry/nextjs'
import { Transaction, TransactionState, TransactionStatus, SendFormData } from '@/types'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { generateTxId, generateMockHash } from '@/lib/utils'

interface TransactionStore extends TransactionState {
  sendTransaction: (formData: SendFormData, balances: Record<string, number>) => Promise<void>
  retryTransaction: (txId: string) => Promise<void>
  setActiveTransaction: (tx: Transaction | null) => void
  clearQueue: () => void
  updateTransactionStatus: (txId: string, status: TransactionStatus) => void
}

export const useTransactionStore = create<TransactionStore>()(
  devtools(
    (set, get) => ({
      // ── Initial State ──────────────────────────
      transactions: MOCK_TRANSACTIONS,
      queue: [],
      activeTransaction: null,

      // ── Send Transaction ───────────────────────
      sendTransaction: async (formData, balances) => {
        const { to, amount, asset, network } = formData
        const numAmount = parseFloat(amount)
        const balance = balances[asset] ?? 0

        // Build the new transaction object
        const newTx: Transaction = {
          id: generateTxId(),
          type: 'send',
          status: 'pending',
          asset,
          amount: numAmount,
          usdValue: numAmount * (
            asset === 'ETH'   ? 2706  :
            asset === 'SOL'   ? 130.5 :
            asset === 'MATIC' ? 0.70  : 1
          ),
          from: '0x3f7a8c4d2e1b9f6a5c0d8e3f7a8c4d2e1b9f6a5c2d9',
          to,
          hash: generateMockHash(),
          timestamp: Date.now(),
          gasFee: 0.00089,
          gasFeUsd: 2.40,
          network,
          retryCount: 0,
        }

        // Step 1 — add as pending immediately (optimistic UI)
        set((state) => ({
          transactions: [newTx, ...state.transactions],
          queue: [...state.queue, newTx],
          activeTransaction: { ...newTx, status: 'pending' },
        }))

        // Step 2 — simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Step 3 — determine outcome
        const hasBalance = balance >= numAmount
        const randomSuccess = Math.random() > 0.2
        const success = hasBalance && randomSuccess
        const finalStatus: TransactionStatus = success ? 'success' : 'failed'

        // Step 4 — track failed transactions in Sentry
        if (finalStatus === 'failed') {
          Sentry.captureMessage('Transaction failed', {
            level: 'warning',
            contexts: {
              transaction: {
                asset,
                amount: numAmount,
                to,
                network,
                reason: !hasBalance
                  ? 'insufficient_balance'
                  : 'network_error',
              },
            },
          })
        }

        // Step 5 — update transaction list
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === newTx.id
              ? { ...tx, status: finalStatus }
              : tx
          ),
          queue: state.queue.filter((tx) => tx.id !== newTx.id),
        }))

        // Step 6 — update activeTransaction separately so modal reacts
        set(() => ({
          activeTransaction: { ...newTx, status: finalStatus },
        }))
      },

      // ── Retry Transaction ──────────────────────
      retryTransaction: async (txId) => {
        const tx = get().transactions.find((t) => t.id === txId)
        if (!tx || tx.status !== 'failed') return

        const updatedTx: Transaction = {
          ...tx,
          status: 'pending',
          retryCount: tx.retryCount + 1,
        }

        // Set back to pending
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txId ? updatedTx : t
          ),
          activeTransaction: updatedTx,
        }))

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Higher success rate on retry
        const finalStatus: TransactionStatus =
          Math.random() > 0.1 ? 'success' : 'failed'

        // Track retry failures in Sentry
        if (finalStatus === 'failed') {
          Sentry.captureMessage('Transaction retry failed', {
            level: 'warning',
            contexts: {
              transaction: {
                txId,
                asset: tx.asset,
                amount: tx.amount,
                retryCount: updatedTx.retryCount,
                network: tx.network,
              },
            },
          })
        }

        // Update transaction list
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txId
              ? { ...t, status: finalStatus }
              : t
          ),
        }))

        // Update activeTransaction separately
        set(() => ({
          activeTransaction: { ...updatedTx, status: finalStatus },
        }))
      },

      // ── Helpers ────────────────────────────────
      setActiveTransaction: (tx) => {
        set({ activeTransaction: tx })
      },

      clearQueue: () => {
        set({ queue: [] })
      },

      updateTransactionStatus: (txId, status) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === txId ? { ...tx, status } : tx
          ),
        }))
      },
    }),
    { name: 'TransactionStore' }
  )
)