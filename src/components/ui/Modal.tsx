import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen:    boolean
  onClose:   () => void
  title?:    string
  children:  React.ReactNode
  maxWidth?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, maxWidth = 'max-w-md',
}) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={[
              'relative z-10 w-full rounded-xl bg-bg-secondary border border-border shadow-card',
              maxWidth,
            ].join(' ')}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-display text-lg font-bold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary transition-colors p-1 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
