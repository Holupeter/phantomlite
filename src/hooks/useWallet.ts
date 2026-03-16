import { useWalletStore } from '@/store/walletStore'
import { useTransactionStore } from '@/store/transactionStore'
import { Network } from '@/types'

export function useWallet() {
  const {
    address,
    connectionStatus,
    connectedProvider,
    network,
    totalBalanceUsd,
    assets,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWalletStore()

  const { transactions } = useTransactionStore()

  const isConnected = connectionStatus === 'connected'
  const isConnecting = connectionStatus === 'connecting'

  const getAssetBalance = (symbol: string): number => {
    const asset = assets.find((a) => a.symbol === symbol)
    return asset?.balance ?? 0
  }

  const getAssetUsdValue = (symbol: string): number => {
    const asset = assets.find((a) => a.symbol === symbol)
    return asset?.usdValue ?? 0
  }

  const getBalanceMap = (): Record<string, number> => {
    return assets.reduce((acc, asset) => {
      acc[asset.symbol] = asset.balance
      return acc
    }, {} as Record<string, number>)
  }

  const handleConnect = async (
    provider: 'metamask' | 'walletconnect' | 'phantom' | 'mock'
  ) => {
    await connectWallet(provider)
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  const handleNetworkSwitch = (network: Network) => {
    switchNetwork(network)
  }

  const pendingTxCount = transactions.filter(
    (tx) => tx.status === 'pending'
  ).length

  return {
    // State
    address,
    connectionStatus,
    connectedProvider,
    network,
    totalBalanceUsd,
    assets,
    isConnected,
    isConnecting,
    pendingTxCount,

    // Helpers
    getAssetBalance,
    getAssetUsdValue,
    getBalanceMap,

    // Actions
    handleConnect,
    handleDisconnect,
    handleNetworkSwitch,
  }
}