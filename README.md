# PhantomLite 👻

A frontend crypto wallet simulation that mimics Phantom Wallet.
Built as a portfolio project to demonstrate senior-level frontend engineering skills.

## Live Demo
[View on Vercel](https://phantomlite.vercel.app) ← update with your URL

---

## Screenshots

> Add screenshots here after deployment

---

## Features

### 🔐 Wallet Experience
- Create wallet with 12-word seed phrase generation
- 3-step wallet creation flow — Generate → Verify → Secure
- Connect wallet via MetaMask, WalletConnect, Phantom or Coinbase
- View total portfolio balance with 24h price change
- Multi-network support — Ethereum, Solana, Polygon

### 💸 Money Movement
- Send crypto (ETH, SOL, USDC, MATIC) with full form validation
- Receive crypto with real QR code generation per network
- Transaction status tracking — Pending, Confirmed, Failed
- Retry failed transactions with higher success rate

### 📊 Transaction History
- Full transaction list with date grouping
- Summary cards — total sent, received, pending count
- Filter by All, Sent, Received, Pending, Failed
- Gas fee display per transaction

### ⚡ UX & Performance
- Skeleton loaders on initial app load
- Optimistic UI updates — transactions appear instantly
- Smooth page transitions with Framer Motion
- Bottom sheet modals with spring animations
- Network switcher with dropdown
- Copy address to clipboard

### 🧠 Senior-Level Engineering
- Zustand state management with devtools
- Custom React hooks separating concerns
- TypeScript throughout — full type safety
- Error boundaries on every major section
- Sentry error monitoring and session replay
- Transaction queue system
- Modular component architecture

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | App Router, SSR, file-based routing |
| TypeScript | Full type safety across the app |
| Zustand | Global state management |
| Framer Motion | Page transitions and animations |
| Tailwind CSS | Utility-first styling |
| ethers.js | Web3 utilities and address handling |
| qrcode.react | QR code generation for receive flow |
| Sentry | Error monitoring and session replay |

---

## Architecture
```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main wallet shell
│   └── globals.css         # Global styles and keyframes
│
├── components/
│   ├── wallet/
│   │   ├── BalanceCard.tsx         # Total balance display
│   │   ├── AssetList.tsx           # Token holdings list
│   │   ├── ActionButtons.tsx       # Send/Receive/Connect/Create
│   │   ├── SendModal.tsx           # 3-step send flow
│   │   ├── ReceiveModal.tsx        # QR code + address
│   │   ├── TransactionHistory.tsx  # Filtered tx list
│   │   ├── ConnectScreen.tsx       # Wallet provider selection
│   │   └── CreateWalletScreen.tsx  # Seed phrase generation
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button variants
│   │   ├── Modal.tsx               # Bottom sheet modal
│   │   ├── SkeletonLoader.tsx      # Loading states
│   │   ├── StatusBadge.tsx         # Tx status indicators
│   │   └── ErrorBoundary.tsx       # Sentry-connected error boundary
│   └── layout/
│       ├── Navbar.tsx              # Top bar with network switcher
│       └── BottomNav.tsx           # Animated tab navigation
│
├── store/
│   ├── walletStore.ts      # Wallet connection and assets state
│   └── transactionStore.ts # Transaction queue and history state
│
├── hooks/
│   ├── useWallet.ts        # Wallet state and actions
│   └── useTransaction.ts   # Transaction state and form logic
│
├── lib/
│   ├── mockData.ts         # Mock assets, transactions, networks
│   └── utils.ts            # Formatting, validation, helpers
│
└── types/
    └── index.ts            # All TypeScript interfaces and types
```

---

## State Management

PhantomLite uses **Zustand** with two stores:

**WalletStore** manages:
- Wallet connection status and provider
- Connected address
- Asset balances
- Active network

**TransactionStore** manages:
- Transaction history
- Active transaction (used by send modal)
- Transaction queue
- Optimistic UI updates

---

## Error Monitoring

PhantomLite uses **Sentry** for production error monitoring:

- All component crashes are captured via `ErrorBoundary`
- Failed transactions are tracked as Sentry warnings with full context
- Session replay records user actions before an error occurs
- Every error includes a unique Event ID shown to the user
- Users can submit error reports directly from the error screen

---

## Getting Started
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/phantomlite.git

# Navigate into the project
cd phantomlite

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_SENTRY_DSN to .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the root:
```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

---

## Deployment

This project is deployed on **Vercel**.

Every push to `main` triggers an automatic redeployment.

To deploy your own instance:

1. Fork this repository
2. Go to [vercel.com](https://vercel.com)
3. Import the forked repo
4. Add `NEXT_PUBLIC_SENTRY_DSN` in Environment Variables
5. Click Deploy

---

## What I Learned

- Building complex UI state machines with Zustand
- Implementing optimistic UI updates for a better UX
- Structuring a large React application with separation of concerns
- Using Framer Motion for production-quality animations
- Integrating Sentry for real-world error monitoring
- Simulating Web3 wallet flows without a real blockchain connection

---

## Author

Built by **[Orion]**

- GitHub: [@yourusername](https://github.com/Holupeter)

---

## License

MIT — feel free to use this project as inspiration for your own portfolio.
