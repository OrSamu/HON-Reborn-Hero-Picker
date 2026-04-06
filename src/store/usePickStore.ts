import { create } from 'zustand'
import type { PickedHero, Hero } from '@/types'

interface PickStore {
  currentPick: PickedHero[]
  isRolling:   boolean
  hasResult:   boolean

  setCurrentPick:  (picks: PickedHero[]) => void
  setIsRolling:    (val: boolean) => void
  repickSingle:    (slot: 0 | 1 | 2 | 3, newHero: Hero) => void
  markAnimDone:    (slot: 0 | 1 | 2 | 3) => void
  clearPick:       () => void
}

export const usePickStore = create<PickStore>()((set) => ({
  currentPick: [],
  isRolling:   false,
  hasResult:   false,

  setCurrentPick: (picks) =>
    set({ currentPick: picks, hasResult: picks.length > 0, isRolling: false }),

  setIsRolling: (val) => set({ isRolling: val }),

  repickSingle: (slot, newHero) =>
    set((state) => ({
      currentPick: state.currentPick.map((p) =>
        p.slot === slot ? { ...p, hero: newHero, isNew: true } : p,
      ),
    })),

  markAnimDone: (slot) =>
    set((state) => ({
      currentPick: state.currentPick.map((p) =>
        p.slot === slot ? { ...p, isNew: false } : p,
      ),
    })),

  clearPick: () => set({ currentPick: [], hasResult: false }),
}))
