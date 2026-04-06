import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Hero } from '@/types'
import { RoleBadge, AttributeBadge } from '@/components/ui/Badge'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { PLACEHOLDER_GRADIENTS } from '@/utils/constants'
import { getPlaceholderIndex } from '@/utils/heroUtils'

interface HeroCardProps {
  hero:         Hero
  isBanned?:    boolean
  isSelected?:  boolean
  onClick?:     (hero: Hero) => void
  showFavorite?: boolean
  compact?:     boolean
  /** If true show a semi-transparent ban overlay with X icon */
  banOverlay?:  boolean
}

export const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  isBanned    = false,
  isSelected  = false,
  onClick,
  showFavorite = true,
  compact      = false,
  banOverlay   = false,
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const favorite = isFavorite(hero.id)
  const [imgError, setImgError] = useState(false)

  const gradIdx = getPlaceholderIndex(hero.id)
  const gradient = PLACEHOLDER_GRADIENTS[gradIdx]

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(hero.id)
  }

  return (
    <motion.div
      layout
      whileHover={onClick ? { scale: 1.03 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={() => onClick?.(hero)}
      className={[
        'relative rounded-xl overflow-hidden cursor-default transition-all duration-150',
        'border bg-bg-card',
        onClick ? 'cursor-pointer' : '',
        isSelected
          ? 'border-accent-teal shadow-glow-teal'
          : isBanned
          ? 'border-red-700/60 opacity-60'
          : 'border-border hover:border-border-light',
        compact ? 'aspect-[3/4]' : 'aspect-[3/4]',
      ].join(' ')}
    >
      {/* Hero portrait */}
      <div className={[
        'absolute inset-0 bg-gradient-to-b',
        !imgError ? '' : `bg-gradient-to-br ${gradient}`,
      ].join(' ')}>
        {!imgError && (
          <img
            src={`${import.meta.env.BASE_URL}${hero.image}`}
            alt={hero.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
        {imgError && (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-end justify-center pb-1`}>
            <span className="text-white/60 font-bold text-xs text-center px-1">{hero.name}</span>
          </div>
        )}
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Ban overlay */}
      {banOverlay && (
        <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full bg-red-600/80 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      )}

      {/* Attribute pill top-left */}
      {!compact && (
        <div className="absolute top-1.5 left-1.5 z-20">
          <AttributeBadge attribute={hero.attribute} />
        </div>
      )}

      {/* Favorite star top-right */}
      {showFavorite && (
        <button
          onClick={handleFavClick}
          className={[
            'absolute top-1.5 right-1.5 z-20 p-0.5 rounded transition-transform hover:scale-110',
            favorite ? 'text-accent-gold' : 'text-white/30 hover:text-white/70',
          ].join(' ')}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-4 h-4" fill={favorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      )}

      {/* Hero name + primary role */}
      <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
        <p className={[
          'font-semibold leading-tight text-white truncate',
          compact ? 'text-xs' : 'text-sm',
        ].join(' ')}>
          {hero.name}
        </p>
        {!compact && (
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            <RoleBadge role={hero.role[0]} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
