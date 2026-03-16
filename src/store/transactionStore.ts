import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
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
      transactions: MOCK_TRANSACTIONS,
      queue: [],
      activeTransaction: null,

      sendTransaction: async (formData, balances) => {
        const { to, amount, asset, network } = formData
        const numAmount = parseFloat(amount)
        const balance = balances[asset] ?? 0

        const newTx: Transaction = {
          id: generateTxId(),
          type: 'send',
          status: 'pending',
          asset,
          amount: numAmount,
          usdValue: numAmount * (
            asset === 'ETH'  ? 2706 :
            asset === 'SOL'  ? 130.5 :
            asset === 'MATIC'? 0.70 : 1
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

        // Step 4 — update transaction list
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === newTx.id
              ? { ...tx, status: finalStatus }
              : tx
          ),
          queue: state.queue.filter((tx) => tx.id !== newTx.id),
        }))

        // Step 5 — update activeTransaction separately so modal reacts
        set(() => ({
          activeTransaction: { ...newTx, status: finalStatus },
        }))
      },

      retryTransaction: async (txId) => {
        const tx = get().transactions.find((t) => t.id === txId)
        if (!tx || tx.status !== 'failed') return

        const updatedTx = { ...tx, status: 'pending' as TransactionStatus, retryCount: tx.retryCount + 1 }

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txId ? updatedTx : t
          ),
          activeTransaction: updatedTx,
        }))

        await new Promise((resolve) => setTimeout(resolve, 3000))

        const finalStatus: TransactionStatus = Math.random() > 0.1 ? 'success' : 'failed'

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === txId ? { ...t, status: finalStatus } : t
          ),
          activeTransaction: { ...updatedTx, status: finalStatus },
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