import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RandomnessMode, TryhardTier } from '@/types'

interface SettingsStore {
  soundEnabled:           boolean
  animationsEnabled:      boolean
  randomnessMode:         RandomnessMode
  fairnessModeEnabled:    boolean
  noTryhardModeEnabled:   boolean
  noTryhardMaxTier:       TryhardTier    // exclude heroes at or below this tier
  reverseBanModeEnabled:  boolean        // whitelist mode

  setSoundEnabled:          (val: boolean) => void
  setAnimationsEnabled:     (val: boolean) => void
  setRandomnessMode:        (mode: RandomnessMode) => void
  setFairnessModeEnabled:   (val: boolean) => void
  setNoTryhardModeEnabled:  (val: boolean) => void
  setNoTryhardMaxTier:      (tier: TryhardTier) => void
  setReverseBanModeEnabled: (val: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled:           true,
      animationsEnabled:      true,
      randomnessMode:         'normal',
      fairnessModeEnabled:    false,
      noTryhardModeEnabled:   false,
      noTryhardMaxTier:       2,
      reverseBanModeEnabled:  false,

      setSoundEnabled:          (val) => set({ soundEnabled: val }),
      setAnimationsEnabled:     (val) => set({ animationsEnabled: val }),
      setRandomnessMode:        (mode) => set({ randomnessMode: mode }),
      setFairnessModeEnabled:   (val) => set({ fairnessModeEnabled: val }),
      setNoTryhardModeEnabled:  (val) => set({ noTryhardModeEnabled: val }),
      setNoTryhardMaxTier:      (tier) => set({ noTryhardMaxTier: tier }),
      setReverseBanModeEnabled: (val) => set({ reverseBanModeEnabled: val }),
    }),
    { name: 'hon-settings-store' },
  ),
)
