import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { MatchRecord, PickedHero, RandomnessMode } from '@/types'

const MAX_RECORDS = 100

interface HistoryStore {
  records: MatchRecord[]

  addRecord: (
    picks:               PickedHero[],
    activeBanListName:   string,
    randomnessMode:      RandomnessMode,
    fairnessModeEnabled: boolean,
  ) => void
  deleteRecord: (id: string) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      records: [],

      addRecord: (picks, activeBanListName, randomnessMode, fairnessModeEnabled) =>
        set(s => ({
          records: [
            {
              id:                  uuid(),
              date:                new Date().toISOString(),
              picks,
              activeBanListName,
              randomnessMode,
              fairnessModeEnabled,
            },
            ...s.records,
          ].slice(0, MAX_RECORDS),   // cap at 100
        })),

      deleteRecord: (id) =>
        set(s => ({ records: s.records.filter(r => r.id !== id) })),

      clearHistory: () => set({ records: [] }),
    }),
    { name: 'hon-history-store' },
  ),
)
