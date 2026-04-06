import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useSound } from '@/hooks/useSound'

interface DrumrollOverlayProps {
  isVisible: boolean
}

export const DrumrollOverlay: React.FC<DrumrollOverlayProps> = ({ isVisible }) => {
  const { animationsEnabled } = useSettingsStore()
  const { play, stop } = useSound()

  useEffect(() => {
    if (isVisible) {
      play('drumroll')
    } else {
      stop('drumroll')
      if (!isVisible) play('reveal')
    }
  }, [isVisible, play, stop])

  if (!animationsEnabled) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="text-center">
            {/* Spinning HON logo-style dice */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="text-8xl mb-6 inline-block"
            >
              ⚔️
            </motion.div>

            {/* Flashing hero silhouettes */}
            <div className="flex gap-4 justify-center mb-6">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    backgroundColor: ['#1e2636', '#2ab5b5', '#1e2636', '#d4a017', '#1e2636'],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.4,
                    delay: i * 0.1,
                  }}
                  className="w-16 h-20 rounded-xl border-2 border-accent-teal/40"
                />
              ))}
            </div>

            <motion.p
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-accent-gold font-display text-2xl font-bold tracking-widest uppercase"
            >
              Rolling Heroes…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
