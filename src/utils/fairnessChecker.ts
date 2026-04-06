import type { Hero, PickedHero } from '@/types'
import { HARD_CARRY_ROLES, HARD_SUPPORT_ROLES } from './constants'

export interface FairnessResult {
  isBalanced: boolean
  reason?:    string
}

/**
 * Check whether the 4-hero pick results in a balanced 2v2:
 * - Neither team should be all hard-carries
 * - Neither team should be all hard-supports
 */
export function checkFairness(picks: PickedHero[]): FairnessResult {
  const teamA = picks.filter(p => p.team === 'A').map(p => p.hero)
  const teamB = picks.filter(p => p.team === 'B').map(p => p.hero)

  for (const [label, team] of [['Team A', teamA], ['Team B', teamB]] as [string, Hero[]][]) {
    const allCarries  = team.every(h => h.role.some(r => HARD_CARRY_ROLES.includes(r)))
    const allSupports = team.every(h => h.role.some(r => HARD_SUPPORT_ROLES.includes(r)))

    if (allCarries)  return { isBalanced: false, reason: `${label} is two carries — imbalanced!` }
    if (allSupports) return { isBalanced: false, reason: `${label} is two supports — imbalanced!` }
  }

  return { isBalanced: true }
}

/**
 * Keep retrying the pickFn until a balanced result is found,
 * or until maxAttempts is exhausted (then return last attempt anyway).
 */
export async function pickWithFairness(
  pickFn:      () => PickedHero[],
  maxAttempts: number = 10,
): Promise<{ picks: PickedHero[]; relaxed: boolean }> {
  let last: PickedHero[] = []

  for (let i = 0; i < maxAttempts; i++) {
    last = pickFn()
    const { isBalanced } = checkFairness(last)
    if (isBalanced) return { picks: last, relaxed: false }
  }

  // Constraint relaxed — return last attempt
  return { picks: last, relaxed: true }
}
