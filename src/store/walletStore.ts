import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { WalletState, Network, Asset } from '@/types'
import { MOCK_ADDRESS, MOCK_ASSETS } from '@/lib/mockData'

interface WalletStore extends WalletState {
  // Actions
  connectWallet: (provider: WalletState['connectedProvider']) => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (network: Network) => void
  updateAssets: (assets: Asset[]) => void
  updateTotalBalance: () => void
}

export const useWalletStore = create<WalletStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      address: null,
      connectionStatus: 'disconnected',
      connectedProvider: null,
      network: 'ethereum',
      totalBalanceUsd: 0,
      assets: [],

      // Actions
      connectWallet: async (provider) => {
        set({ connectionStatus: 'connecting' })

        // Simulate connection delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        set({
          address: MOCK_ADDRESS,
          connectionStatus: 'connected',
          connectedProvider: provider,
          assets: MOCK_ASSETS,
          totalBalanceUsd: MOCK_ASSETS.reduce((acc, a) => acc + a.usdValue, 0),
        })
      },

      disconnectWallet: () => {
        set({
          address: null,
          connectionStatus: 'disconnected',
          connectedProvider: null,
          assets: [],
          totalBalanceUsd: 0,
        })
      },

      switchNetwork: (network) => {
        set({ network })
      },

      updateAssets: (assets) => {
        set({ assets })
        get().updateTotalBalance()
      },

      updateTotalBalance: () => {
        const total = get().assets.reduce((acc, a) => acc + a.usdValue, 0)
        set({ totalBalanceUsd: total })
      },
    }),
    { name: 'WalletStore' }
  )
)