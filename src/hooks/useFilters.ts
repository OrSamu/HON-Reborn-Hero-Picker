import { useMemo } from 'react'
import { useHeroStore }     from '@/store/useHeroStore'
import { useFilterStore }   from '@/store/useFilterStore'
import { useBanStore }      from '@/store/useBanStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { applyFilters, applyBanList, applyWhitelist, applyNoTryhardFilter, sortHeroesAlpha } from '@/utils/heroUtils'
import type { Hero } from '@/types'

/**
 * Returns:
 * - filteredHeroes: all heroes matching current search/role/attr/type filters (for display in HeroGrid)
 * - eligiblePool:   heroes eligible for picking (filters + bans + no-tryhard + whitelist)
 * - allHeroes:      raw hero list
 */
export function useFilters(): {
  allHeroes:      Hero[]
  filteredHeroes: Hero[]
  eligiblePool:   Hero[]
} {
  const { heroes }              = useHeroStore()
  const { filters }             = useFilterStore()
  const {
    getActiveBannedIds,
    activeBanListId,
    banLists,
  }                             = useBanStore()
  const {
    noTryhardModeEnabled,
    noTryhardMaxTier,
    reverseBanModeEnabled,
  }                             = useSettingsStore()

  const allHeroes = useMemo(() => sortHeroesAlpha(heroes), [heroes])

  // ── Heroes shown in the grid (apply text/role/attr/attack filters only) ──
  const filteredHeroes = useMemo(
    () => applyFilters(allHeroes, filters),
    [allHeroes, filters],
  )

  // ── Heroes eligible for picking ──────────────────────────────────────────
  const eligiblePool = useMemo(() => {
    let pool = allHeroes

    if (reverseBanModeEnabled) {
      // Whitelist mode: only active-ban-list heroes are *allowed*
      const whitelist = getActiveBannedIds()
      pool = applyWhitelist(pool, whitelist)
    } else {
      // Normal ban mode: remove banned heroes
      const bannedIds = getActiveBannedIds()
      pool = applyBanList(pool, bannedIds)
    }

    if (noTryhardModeEnabled) {
      pool = applyNoTryhardFilter(pool, noTryhardMaxTier)
    }

    return pool
  }, [
    allHeroes,
    activeBanListId,
    banLists,
    reverseBanModeEnabled,
    noTryhardModeEnabled,
    noTryhardMaxTier,
    getActiveBannedIds,
  ])

  return { allHeroes, filteredHeroes, eligiblePool }
}
