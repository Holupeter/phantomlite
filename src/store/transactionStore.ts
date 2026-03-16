import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Transaction, TransactionState, TransactionStatus, SendFormData } from '@/types'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { generateTxId, generateMockHash } from '@/lib/utils'

interface TransactionStore extends TransactionState {
  // Actions
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

      // ── Actions ────────────────────────────────
      sendTransaction: async (formData, balances) => {
        const { to, amount, asset, network } = formData
        const numAmount = parseFloat(amount)
        const balance = balances[asset] ?? 0

        // Create the transaction object
        const newTx: Transaction = {
          id: generateTxId(),
          type: 'send',
          status: 'pending',
          asset,
          amount: numAmount,
          usdValue: numAmount * (asset === 'ETH' ? 2706 : asset === 'SOL' ? 130.5 : 1),
          from: '0x3f7a8c4d2e1b9f6a5c0d8e3f7a8c4d2e1b9f6a5c2d9',
          to,
          hash: generateMockHash(),
          timestamp: Date.now(),
          gasFee: 0.00089,
          gasFeUsd: 2.40,
          network,
          retryCount: 0,
        }

        // Optimistic UI — add as pending immediately
        set((state) => ({
          transactions: [newTx, ...state.transactions],
          queue: [...state.queue, newTx],
          activeTransaction: newTx,
        }))

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Simulate success or failure (80% success rate)
        const success = balance >= numAmount && Math.random() > 0.2
        const finalStatus: TransactionStatus = success ? 'success' : 'failed'

        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === newTx.id ? { ...tx, status: finalStatus } : tx
          ),
          queue: state.queue.filter((tx) => tx.id !== newTx.id),
          activeTransaction: { ...newTx, status: finalStatus },
        }))
      },

      retryTransaction: async (txId) => {
        const tx = get().transactions.find((t) => t.id === txId)
        if (!tx || tx.status !== 'failed') return

        // Increment retry count and reset to pending
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txId
              ? { ...t, status: 'pending', retryCount: t.retryCount + 1 }
              : t
          ),
          activeTransaction: tx ? { ...tx, status: 'pending', retryCount: tx.retryCount + 1 } : null,
        }))

        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Higher success rate on retry
        const success = Math.random() > 0.1
        const finalStatus: TransactionStatus = success ? 'success' : 'failed'

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txId ? { ...t, status: finalStatus } : t
          ),
          activeTransaction: state.activeTransaction
            ? { ...state.activeTransaction, status: finalStatus }
            : null,
        }))
      },

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