import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface TooltipProps {
  content:  string
  children: React.ReactNode
  side?:    'top' | 'bottom'
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top' }) => {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={[
              'absolute z-50 whitespace-nowrap px-2 py-1 rounded text-xs',
              'bg-bg-primary border border-border text-text-secondary shadow-card',
              'left-1/2 -translate-x-1/2 pointer-events-none',
              side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            ].join(' ')}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
