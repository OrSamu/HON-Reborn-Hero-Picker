import React from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  icon?:     React.ReactNode
  iconRight?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-accent-teal hover:bg-accent-teal-lt text-bg-primary font-semibold',
  secondary: 'bg-bg-tertiary hover:bg-bg-hover border border-border text-text-primary',
  danger:    'bg-accent-red hover:bg-accent-red-lt text-white font-semibold',
  ghost:     'hover:bg-bg-hover text-text-secondary hover:text-text-primary',
  gold:      'bg-accent-gold hover:bg-accent-gold-lt text-bg-primary font-bold',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-xs gap-1.5',
  md:  'px-4 py-2   text-sm gap-2',
  lg:  'px-6 py-3   text-base gap-2.5',
}

export const Button: React.FC<ButtonProps> = ({
  variant  = 'secondary',
  size     = 'md',
  loading  = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.96 }}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.1 }}
      className={[
        'inline-flex items-center justify-center rounded-lg transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...(props as React.ComponentPropsWithRef<typeof motion.button>)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </motion.button>
  )
}
