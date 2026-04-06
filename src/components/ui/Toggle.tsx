import React from 'react'
import { motion } from 'framer-motion'

interface ToggleProps {
  checked:   boolean
  onChange:  (val: boolean) => void
  label?:    string
  description?: string
  disabled?: boolean
}

export const Toggle: React.FC<ToggleProps> = ({
  checked, onChange, label, description, disabled = false,
}) => (
  <label className={[
    'flex items-center justify-between gap-4 cursor-pointer select-none',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
  ].join(' ')}>
    {(label || description) && (
      <div>
        {label && <p className="text-sm font-medium text-text-primary">{label}</p>}
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
    )}
    <motion.div
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-accent-teal' : 'bg-bg-hover border border-border',
      ].join(' ')}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </motion.div>
  </label>
)
