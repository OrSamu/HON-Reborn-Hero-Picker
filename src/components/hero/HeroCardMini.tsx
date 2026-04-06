import React, { useState } from 'react'
import type { Hero } from '@/types'
import { AttributeBadge } from '@/components/ui/Badge'
import { PLACEHOLDER_GRADIENTS } from '@/utils/constants'
import { getPlaceholderIndex } from '@/utils/heroUtils'

interface HeroCardMiniProps {
  hero: Hero
  team?: 'A' | 'B'
}

export const HeroCardMini: React.FC<HeroCardMiniProps> = ({ hero, team }) => {
  const [imgError, setImgError] = useState(false)
  const gradient = PLACEHOLDER_GRADIENTS[getPlaceholderIndex(hero.id)]

  return (
    <div className={[
      'flex items-center gap-2 px-2 py-1.5 rounded-lg bg-bg-tertiary border',
      team === 'A' ? 'border-teamA/40' : team === 'B' ? 'border-teamB/40' : 'border-border',
    ].join(' ')}>
      {/* Tiny portrait */}
      <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
        {!imgError ? (
          <img
            src={`${import.meta.env.BASE_URL}${hero.image}`}
            alt={hero.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-text-primary truncate">{hero.name}</p>
        <p className="text-[10px] text-text-muted capitalize">{hero.attribute}</p>
      </div>
    </div>
  )
}
