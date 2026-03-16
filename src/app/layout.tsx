import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PhantomLite — Crypto Wallet',
  description: 'A frontend crypto wallet simulation built with Next.js, Zustand, Framer Motion and TypeScript.',
  keywords: ['crypto', 'wallet', 'ethereum', 'solana', 'web3', 'nextjs'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: '#060608' }}>
        {children}
      </body>
    </html>
  )
}