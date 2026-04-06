import React, { useState } from 'react'
import type { PickedHero } from '@/types'
import { PLACEHOLDER_GRADIENTS } from '@/utils/constants'
import { getPlaceholderIndex } from '@/utils/heroUtils'

interface ShareCardProps {
  picks:    PickedHero[]
  cardRef?: React.RefObject<HTMLDivElement>
}

const MiniPortrait: React.FC<{ pick: PickedHero }> = ({ pick }) => {
  const [imgErr, setImgErr] = useState(false)
  const gradient = PLACEHOLDER_GRADIENTS[getPlaceholderIndex(pick.hero.id)]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={[
        'w-20 h-28 rounded-xl overflow-hidden border-2',
        pick.team === 'A' ? 'border-teamA' : 'border-teamB',
      ].join(' ')}>
        {!imgErr ? (
          <img
            src={`${import.meta.env.BASE_URL}${pick.hero.image}`}
            alt={pick.hero.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
      </div>
      <p className="text-xs font-semibold text-white text-center leading-tight max-w-[80px] truncate">
        {pick.hero.name}
      </p>
      <p className="text-[10px] text-text-muted capitalize">{pick.hero.role[0]}</p>
    </div>
  )
}

export const ShareCard: React.FC<ShareCardProps> = ({ picks, cardRef }) => {
  const teamA = picks.filter(p => p.team === 'A')
  const teamB = picks.filter(p => p.team === 'B')
  const now   = new Date().toLocaleString()

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      className="bg-bg-primary border border-border rounded-2xl p-6 w-[480px] pointer-events-none select-none"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <p className="font-display text-2xl font-black text-accent-gold tracking-widest">HON:REBORN</p>
        <p className="text-xs text-text-muted mt-0.5">2v2 Mid Wars — Match Card</p>
      </div>

      {/* Teams */}
      <div className="flex items-center gap-4">
        {/* Team A */}
        <div className="flex-1">
          <p className="text-xs font-bold text-teamA-light uppercase tracking-wide mb-2 text-center">Team A</p>
          <div className="flex justify-center gap-3">
            {teamA.map(p => <MiniPortrait key={p.hero.id} pick={p} />)}
          </div>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center gap-1 px-2">
          <div className="w-px h-16 bg-border" />
          <span className="text-text-muted text-sm font-bold">VS</span>
          <div className="w-px h-16 bg-border" />
        </div>

        {/* Team B */}
        <div className="flex-1">
          <p className="text-xs font-bold text-teamB-light uppercase tracking-wide mb-2 text-center">Team B</p>
          <div className="flex justify-center gap-3">
            {teamB.map(p => <MiniPortrait key={p.hero.id} pick={p} />)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-text-muted mt-5">{now}</p>
    </div>
  )
}
