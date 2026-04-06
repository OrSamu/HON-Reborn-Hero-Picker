import type { Hero, PickedHero, RandomnessMode } from '@/types'
import { HARD_CARRY_ROLES, HARD_SUPPORT_ROLES } from './constants'

// ─── Weighted random draw ──────────────────────────────────────────────────

/**
 * Pick n heroes from pool without replacement, using provided weights.
 * Falls back to uniform random if weights are all equal.
 */
export function weightedSampleWithoutReplacement(
  pool:    Hero[],
  n:       number,
  weights: Map<string, number>,
): Hero[] {
  const available = [...pool]
  const result:   Hero[] = []

  while (result.length < n && available.length > 0) {
    const totalWeight = available.reduce((sum, h) => sum + (weights.get(h.id) ?? 1), 0)
    let rnd = Math.random() * totalWeight
    let idx = 0
    for (let i = 0; i < available.length; i++) {
      rnd -= (weights.get(available[i].id) ?? 1)
      if (rnd <= 0) { idx = i; break }
    }
    result.push(available[idx])
    available.splice(idx, 1)
  }

  return result
}

// ─── Uniform random (normal / chaos) ──────────────────────────────────────

function pickUniform(pool: Hero[], n: number): Hero[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// ─── Balanced mode ────────────────────────────────────────────────────────
/**
 * Balanced mode: tries to include at least one support and one carry
 * in the 4 picks so neither team is all-carry or all-support.
 * Falls back to uniform if pool is too small.
 */
function pickBalanced(pool: Hero[], n: number): Hero[] {
  const carries  = pool.filter(h => h.role.includes('carry'))
  const supports = pool.filter(h => h.role.includes('support'))

  if (carries.length < 2 || supports.length < 2) {
    // Not enough variety — fallback to uniform
    return pickUniform(pool, n)
  }

  // Build weights: carry-role heroes get lower weight (already common), support gets boost
  const weights = new Map<string, number>()
  for (const h of pool) {
    const isCarry   = h.role.includes('carry')
    const isSupport = h.role.includes('support')
    weights.set(h.id, isCarry ? 0.7 : isSupport ? 1.5 : 1.0)
  }

  return weightedSampleWithoutReplacement(pool, n, weights)
}

// ─── Favorites boost mode ─────────────────────────────────────────────────

function pickFavoritesBoost(
  pool:              Hero[],
  n:                 number,
  favoriteIds:       Set<string>,
  boostMultiplier:   number,
): Hero[] {
  const weights = new Map<string, number>()
  for (const h of pool) {
    weights.set(h.id, favoriteIds.has(h.id) ? boostMultiplier : 1)
  }
  return weightedSampleWithoutReplacement(pool, n, weights)
}

// ─── Main pick entry point ────────────────────────────────────────────────

export interface PickOptions {
  pool:             Hero[]          // eligible heroes (after bans / whitelist / tryhard filter)
  count:            number          // how many to pick (4 for a full match, 1 for repick)
  mode:             RandomnessMode
  favoriteIds?:     Set<string>
  boostMultiplier?: number          // default 3
  exclude?:         string[]        // hero ids already picked (for repick-single)
}

export function pickHeroes(opts: PickOptions): Hero[] {
  const {
    pool,
    count,
    mode,
    favoriteIds     = new Set(),
    boostMultiplier = 3,
    exclude         = [],
  } = opts

  // Remove already-picked heroes from pool (for repick-single)
  const excludeSet = new Set(exclude)
  const available  = exclude.length ? pool.filter(h => !excludeSet.has(h.id)) : pool

  if (available.length < count) {
    // Not enough heroes — return whatever is available
    return pickUniform(available, available.length)
  }

  switch (mode) {
    case 'chaos':
    case 'normal':
      return pickUniform(available, count)

    case 'balanced':
      return pickBalanced(available, count)

    case 'favorites-boost':
      return pickFavoritesBoost(available, count, favoriteIds, boostMultiplier)

    default:
      return pickUniform(available, count)
  }
}

// ─── Assign teams ─────────────────────────────────────────────────────────

export function assignTeams(heroes: Hero[]): PickedHero[] {
  // heroes[0], heroes[1] → Team A (slots 0, 1)
  // heroes[2], heroes[3] → Team B (slots 2, 3)
  return heroes.map((hero, i) => ({
    hero,
    team:  (i < 2 ? 'A' : 'B') as 'A' | 'B',
    slot:  i as 0 | 1 | 2 | 3,
    isNew: true,
  }))
}
