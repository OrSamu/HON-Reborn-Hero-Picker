import { useCallback } from 'react'
import { usePickStore }     from '@/store/usePickStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useBanStore }      from '@/store/useBanStore'
import { useHistoryStore }  from '@/store/useHistoryStore'
import { pickHeroes, assignTeams } from '@/utils/pickAlgorithm'
import { pickWithFairness }        from '@/utils/fairnessChecker'
import type { Hero } from '@/types'

interface UsePickerReturn {
  rollAll:     (eligiblePool: Hero[]) => Promise<void>
  rollSingle:  (slot: 0|1|2|3, eligiblePool: Hero[]) => void
  isRolling:   boolean
  hasResult:   boolean
}

export function usePicker(): UsePickerReturn {
  const { setCurrentPick, setIsRolling, repickSingle, currentPick, isRolling, hasResult } =
    usePickStore()
  const { randomnessMode, fairnessModeEnabled, animationsEnabled } = useSettingsStore()
  const { favoriteIds, weightBoostMultiplier } = useFavoritesStore()
  const { getActiveBanList } = useBanStore()
  const { addRecord } = useHistoryStore()

  const favSet = new Set(favoriteIds)

  const rollAll = useCallback(async (eligiblePool: Hero[]) => {
    if (eligiblePool.length < 4) return
    setIsRolling(true)

    // Optional drum-roll delay
    if (animationsEnabled) {
      await new Promise(r => setTimeout(r, 1800))
    }

    const pickFn = () => {
      const heroes = pickHeroes({
        pool:            eligiblePool,
        count:           4,
        mode:            randomnessMode,
        favoriteIds:     favSet,
        boostMultiplier: weightBoostMultiplier,
      })
      return assignTeams(heroes)
    }

    const { picks, relaxed: _ } = await pickWithFairness(
      pickFn,
      fairnessModeEnabled ? 10 : 1,
    )

    setCurrentPick(picks)

    // Save to history
    const activeList = getActiveBanList()
    addRecord(
      picks,
      activeList?.name ?? 'None',
      randomnessMode,
      fairnessModeEnabled,
    )
  }, [
    animationsEnabled, randomnessMode, fairnessModeEnabled,
    favSet, weightBoostMultiplier, setCurrentPick, setIsRolling,
    getActiveBanList, addRecord,
  ])

  const rollSingle = useCallback((slot: 0|1|2|3, eligiblePool: Hero[]) => {
    // Exclude currently picked heroes (except the slot being repicked)
    const currentIds = currentPick
      .filter(p => p.slot !== slot)
      .map(p => p.hero.id)

    const [newHero] = pickHeroes({
      pool:            eligiblePool,
      count:           1,
      mode:            randomnessMode,
      favoriteIds:     favSet,
      boostMultiplier: weightBoostMultiplier,
      exclude:         currentIds,
    })

    if (newHero) repickSingle(slot, newHero)
  }, [currentPick, randomnessMode, favSet, weightBoostMultiplier, repickSingle])

  return { rollAll, rollSingle, isRolling, hasResult }
}
