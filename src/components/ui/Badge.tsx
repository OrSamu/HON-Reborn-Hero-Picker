import React from 'react'
import type { HeroRole, HeroAttribute, AttackType, HeroFaction } from '@/types'

// ─── Role badge ───────────────────────────────────────────────────────────────

const roleColors: Record<HeroRole, string> = {
  carry:        'bg-orange-900/60 text-orange-300 border-orange-700/50',
  support:      'bg-cyan-900/60   text-cyan-300   border-cyan-700/50',
  ganker:       'bg-purple-900/60 text-purple-300 border-purple-700/50',
  jungler:      'bg-green-900/60  text-green-300  border-green-700/50',
  pusher:       'bg-yellow-900/60 text-yellow-300 border-yellow-700/50',
  initiator:    'bg-red-900/60    text-red-300    border-red-700/50',
  'semi-carry': 'bg-amber-900/60  text-amber-300  border-amber-700/50',
  disabler:     'bg-pink-900/60   text-pink-300   border-pink-700/50',
  nuker:        'bg-rose-900/60   text-rose-300   border-rose-700/50',
}

interface RoleBadgeProps {
  role: HeroRole
  size?: 'xs' | 'sm'
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'xs' }) => (
  <span className={[
    'inline-flex items-center rounded border font-medium capitalize',
    size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
    roleColors[role],
  ].join(' ')}>
    {role}
  </span>
)

// ─── Attribute badge ──────────────────────────────────────────────────────────

const attrColors: Record<HeroAttribute, string> = {
  STR: 'bg-red-900/60   text-red-300   border-red-700/50',
  AGI: 'bg-green-900/60 text-green-300 border-green-700/50',
  INT: 'bg-blue-900/60  text-blue-300  border-blue-700/50',
}

interface AttributeBadgeProps {
  attribute: HeroAttribute
}

export const AttributeBadge: React.FC<AttributeBadgeProps> = ({ attribute }) => (
  <span className={[
    'inline-flex items-center rounded border font-bold px-1.5 py-0.5 text-[10px]',
    attrColors[attribute],
  ].join(' ')}>
    {attribute}
  </span>
)

// ─── Attack type badge ────────────────────────────────────────────────────────

interface AttackBadgeProps {
  attackType: AttackType
}

export const AttackBadge: React.FC<AttackBadgeProps> = ({ attackType }) => (
  <span className={[
    'inline-flex items-center rounded border font-medium capitalize px-1.5 py-0.5 text-[10px]',
    attackType === 'melee'
      ? 'bg-slate-800/60 text-slate-300 border-slate-600/50'
      : 'bg-sky-900/60   text-sky-300   border-sky-700/50',
  ].join(' ')}>
    {attackType === 'melee' ? '⚔' : '🏹'} {attackType}
  </span>
)

// ─── Faction badge ────────────────────────────────────────────────────────────

interface FactionBadgeProps {
  faction: HeroFaction
}

export const FactionBadge: React.FC<FactionBadgeProps> = ({ faction }) => (
  <span className={[
    'inline-flex items-center rounded border font-medium capitalize px-1.5 py-0.5 text-[10px]',
    faction === 'legion'
      ? 'bg-blue-900/60  text-blue-300  border-blue-700/50'
      : 'bg-red-900/60   text-red-300   border-red-700/50',
  ].join(' ')}>
    {faction === 'legion' ? '⚡' : '💀'} {faction}
  </span>
)
