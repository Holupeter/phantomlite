'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  }

  const sizes = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-3 gap-2',
    lg: 'text-base px-6 py-4 gap-2',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}