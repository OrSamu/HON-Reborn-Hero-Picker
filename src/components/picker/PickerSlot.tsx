import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PickedHero } from '@/types'
import { usePickStore }     from '@/store/usePickStore'
import { RoleBadge, AttributeBadge, AttackBadge } from '@/components/ui/Badge'
import { getPlaceholderIndex }    from '@/utils/heroUtils'
import { PLACEHOLDER_GRADIENTS } from '@/utils/constants'
import { useState } from 'react'

interface PickerSlotProps {
  pick:         PickedHero
  onRepick:     () => void
  teamColor:    'A' | 'B'
  slotNumber:   1 | 2
}

export const PickerSlot: React.FC<PickerSlotProps> = ({
  pick, onRepick, teamColor, slotNumber,
}) => {
  const { markAnimDone } = usePickStore()
  const [imgError, setImgError] = useState(false)
  const gradient = PLACEHOLDER_GRADIENTS[getPlaceholderIndex(pick.hero.id)]

  // Clear isNew flag after animation
  useEffect(() => {
    if (pick.isNew) {
      const t = setTimeout(() => markAnimDone(pick.slot), 600)
      return () => clearTimeout(t)
    }
  }, [pick.isNew, pick.slot, markAnimDone])

  const teamBorderColor = teamColor === 'A'
    ? 'border-teamA shadow-glow-blue'
    : 'border-teamB shadow-glow-red'

  return (
    <motion.div
      key={pick.hero.id}
      initial={pick.isNew ? { rotateY: 90, opacity: 0 } : false}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: (slotNumber - 1) * 0.08 }}
      className={[
        'relative rounded-2xl overflow-hidden border-2 bg-bg-card',
        teamBorderColor,
        'w-full',
      ].join(' ')}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Portrait */}
      <div className="absolute inset-0">
        {!imgError ? (
          <img
            src={`${import.meta.env.BASE_URL}${pick.hero.image}`}
            alt={pick.hero.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Attribute top-left */}
      <div className="absolute top-2 left-2 z-10">
        <AttributeBadge attribute={pick.hero.attribute} />
      </div>

      {/* Repick button top-right */}
      <button
        onClick={(e) => { e.stopPropagation(); onRepick() }}
        className={[
          'absolute top-2 right-2 z-10 p-1.5 rounded-lg',
          'bg-black/40 hover:bg-black/70 text-white/60 hover:text-white',
          'transition-colors backdrop-blur-sm',
        ].join(' ')}
        title="Repick this hero"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Hero info bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-base font-bold text-white leading-tight">{pick.hero.name}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <RoleBadge role={pick.hero.role[0]} size="sm" />
          {pick.hero.role[1] && <RoleBadge role={pick.hero.role[1]} size="sm" />}
        </div>
        <div className="mt-1">
          <AttackBadge attackType={pick.hero.attackType} />
        </div>
      </div>

      {/* Slot number label */}
      <div className={[
        'absolute top-2 left-1/2 -translate-x-1/2 z-10',
        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
        teamColor === 'A' ? 'bg-teamA text-white' : 'bg-teamB text-white',
      ].join(' ')}>
        {slotNumber}
      </div>
    </motion.div>
  )
}
