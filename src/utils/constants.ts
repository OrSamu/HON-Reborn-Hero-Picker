import type { HeroRole, HeroAttribute, AttackType, HeroFaction, RandomnessMode } from '@/types'

export const ALL_ROLES: HeroRole[] = [
  'carry', 'support', 'ganker', 'initiator', 'disabler',
  'nuker', 'pusher', 'semi-carry', 'jungler',
]

export const ALL_ATTRIBUTES: HeroAttribute[] = ['STR', 'AGI', 'INT']

export const ALL_ATTACK_TYPES: AttackType[] = ['melee', 'ranged']

export const ALL_FACTIONS: HeroFaction[] = ['legion', 'hellbourne']

export const RANDOMNESS_MODES: { value: RandomnessMode; label: string; description: string }[] = [
  {
    value:       'normal',
    label:       'Normal',
    description: 'Uniform random — any eligible hero is equally likely.',
  },
  {
    value:       'chaos',
    label:       'Chaos',
    description: 'Same as Normal. Every match is completely unpredictable.',
  },
  {
    value:       'balanced',
    label:       'Balanced',
    description: 'Weighted toward diverse roles — tries to avoid all-carry or all-support picks.',
  },
  {
    value:       'favorites-boost',
    label:       'Favorites Boost',
    description: 'Favorite heroes appear more often based on your boost multiplier.',
  },
]

export const ROLE_LABELS: Record<HeroRole, string> = {
  carry:        'Carry',
  support:      'Support',
  ganker:       'Ganker',
  initiator:    'Initiator',
  disabler:     'Disabler',
  nuker:        'Nuker',
  pusher:       'Pusher',
  'semi-carry': 'Semi-Carry',
  jungler:      'Jungler',
}

/** Roles considered "hard carry" for fairness checks */
export const HARD_CARRY_ROLES: HeroRole[] = ['carry']

/** Roles considered "hard support" for fairness checks */
export const HARD_SUPPORT_ROLES: HeroRole[] = ['support']

export const TRYHARD_TIER_LABELS: Record<number, string> = {
  1: 'Broken / Must-ban',
  2: 'Strong meta',
  3: 'Balanced / Viable',
  4: 'Situational',
  5: 'Weak / Niche',
}

/** Gradient colors used for hero portrait placeholders (indexed by hero array position) */
export const PLACEHOLDER_GRADIENTS = [
  'from-blue-900   to-blue-700',
  'from-purple-900 to-purple-700',
  'from-red-900    to-red-700',
  'from-green-900  to-green-700',
  'from-amber-900  to-amber-700',
  'from-teal-900   to-teal-700',
  'from-pink-900   to-pink-700',
  'from-indigo-900 to-indigo-700',
  'from-orange-900 to-orange-700',
  'from-cyan-900   to-cyan-700',
]
