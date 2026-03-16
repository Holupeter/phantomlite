export type Network = 'ethereum' | 'solana' | 'polygon'
export type AssetSymbol = 'ETH' | 'SOL' | 'USDC' | 'MATIC'
export type TransactionStatus = 'pending' | 'success' | 'failed'
export type TransactionType = 'send' | 'receive'
export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected'

// Asset
export interface Asset {
  id: string
  name: string
  symbol: AssetSymbol
  balance: number
  usdValue: number
  priceChange24h: number
  iconColor: string
}

// Transaction
export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  asset: AssetSymbol
  amount: number
  usdValue: number
  from: string
  to: string
  hash: string
  timestamp: number
  gasFee: number
  gasFeUsd: number
  network: Network
  retryCount: number
}

// Wallet
export interface WalletState {
  address: string | null
  connectionStatus: WalletConnectionStatus
  connectedProvider: 'metamask' | 'walletconnect' | 'phantom' | 'mock' | null
  network: Network
  totalBalanceUsd: number
  assets: Asset[]
}

// Transaction Store
export interface TransactionState {
  transactions: Transaction[]
  queue: Transaction[]
  activeTransaction: Transaction | null
}

// Send Form
export interface SendFormData {
  to: string
  amount: string
  asset: AssetSymbol
  network: Network
}

// Network Config
export interface NetworkConfig {
  id: Network
  label: string
  chainId: number
  rpcUrl: string
  symbol: AssetSymbol
  explorerUrl: string
}