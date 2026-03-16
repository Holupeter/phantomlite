# PhantomLite 👻

A frontend crypto wallet simulation that mimics Phantom Wallet.
Built as a portfolio project to demonstrate senior-level frontend skills.

## Live Demo
[View on Vercel](#) ← update after deployment

## Features
- 🔐 Create wallet with 12-word seed phrase
- ⇌ Connect wallet (MetaMask, WalletConnect, Phantom, Coinbase)
- 💰 View portfolio balance and assets
- ↑ Send crypto with form validation and gas estimation
- ↓ Receive crypto with QR code generation
- 📊 Transaction history with filters and status badges
- ↺ Retry failed transactions
- ⚡ Optimistic UI updates
- 💀 Skeleton loaders
- 🌐 Network switching (Ethereum, Solana, Polygon)

## Tech Stack
- **Next.js 15** — App Router
- **TypeScript** — Full type safety
- **Zustand** — State management
- **Framer Motion** — Animations and transitions
- **Tailwind CSS** — Utility styling
- **ethers.js** — Web3 utilities
- **qrcode.react** — QR code generation

## Getting Started
```bash
git clone https://github.com/YOUR_USERNAME/phantomlite.git
cd phantomlite
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure
```
src/
├── app/          # Next.js App Router pages
├── components/   # UI and wallet components
├── store/        # Zustand state management
├── hooks/        # Custom React hooks
├── lib/          # Utilities and mock data
└── types/        # TypeScript type definitions
```