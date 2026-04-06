import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Hero } from '@/types'
import { HeroCard } from './HeroCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { useBanStore } from '@/store/useBanStore'

interface HeroGridProps {
  heroes:        Hero[]
  onHeroClick?:  (hero: Hero) => void
  selectedIds?:  Set<string>
  /** If provided, use this banListId to show ban state instead of active list */
  banListId?:    string
  showBanOverlay?: boolean
  compact?:      boolean
}

export const HeroGrid: React.FC<HeroGridProps> = ({
  heroes,
  onHeroClick,
  selectedIds   = new Set(),
  banListId,
  showBanOverlay = false,
  compact        = false,
}) => {
  const { activeBanListId, isBanned } = useBanStore()
  const effectiveBanListId = banListId ?? activeBanListId ?? ''

  if (!heroes.length) {
    return (
      <EmptyState
        icon="🔍"
        title="No heroes match your filters"
        message="Try clearing some filters or changing the search."
      />
    )
  }

  return (
    <motion.div
      layout
      className={[
        'grid gap-2',
        compact
          ? 'grid-cols-[repeat(auto-fill,minmax(72px,1fr))]'
          : 'grid-cols-[repeat(auto-fill,minmax(110px,1fr))]',
      ].join(' ')}
    >
      <AnimatePresence mode="popLayout">
        {heroes.map(hero => (
          <motion.div
            key={hero.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{   opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <HeroCard
              hero={hero}
              isBanned={effectiveBanListId ? isBanned(effectiveBanListId, hero.id) : false}
              isSelected={selectedIds.has(hero.id)}
              onClick={onHeroClick}
              compact={compact}
              banOverlay={showBanOverlay && effectiveBanListId ? isBanned(effectiveBanListId, hero.id) : false}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
