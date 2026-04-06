import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { BanList } from '@/types'
import defaultData from '@/data/defaultBanLists.json'

interface BanStore {
  banLists:          BanList[]
  activeBanListId:   string | null

  // Selectors
  getActiveBanList:  () => BanList | null
  getActiveBannedIds:() => string[]

  // CRUD
  createBanList:     (name: string) => string   // returns new id
  renameBanList:     (id: string, name: string) => void
  deleteBanList:     (id: string) => void
  setActiveBanList:  (id: string | null) => void

  // Hero banning
  banHero:           (banListId: string, heroId: string) => void
  unbanHero:         (banListId: string, heroId: string) => void
  toggleBan:         (banListId: string, heroId: string) => void
  isBanned:          (banListId: string, heroId: string) => boolean

  // Import / Export helpers
  importBanList:     (bl: BanList) => void
  resetToDefaults:   () => void
}

export const useBanStore = create<BanStore>()(
  persist(
    (set, get) => ({
      banLists:        defaultData.defaultBanLists as BanList[],
      activeBanListId: 'tryhard-bans',

      getActiveBanList: () => {
        const { banLists, activeBanListId } = get()
        return banLists.find(bl => bl.id === activeBanListId) ?? null
      },

      getActiveBannedIds: () => {
        const active = get().getActiveBanList()
        return active?.bannedIds ?? []
      },

      createBanList: (name) => {
        const id = uuid()
        const now = new Date().toISOString()
        const newList: BanList = { id, name, bannedIds: [], createdAt: now, updatedAt: now }
        set(s => ({ banLists: [...s.banLists, newList] }))
        return id
      },

      renameBanList: (id, name) =>
        set(s => ({
          banLists: s.banLists.map(bl =>
            bl.id === id ? { ...bl, name, updatedAt: new Date().toISOString() } : bl,
          ),
        })),

      deleteBanList: (id) =>
        set(s => ({
          banLists:        s.banLists.filter(bl => bl.id !== id),
          activeBanListId: s.activeBanListId === id ? null : s.activeBanListId,
        })),

      setActiveBanList: (id) => set({ activeBanListId: id }),

      banHero: (banListId, heroId) =>
        set(s => ({
          banLists: s.banLists.map(bl =>
            bl.id === banListId && !bl.bannedIds.includes(heroId)
              ? { ...bl, bannedIds: [...bl.bannedIds, heroId], updatedAt: new Date().toISOString() }
              : bl,
          ),
        })),

      unbanHero: (banListId, heroId) =>
        set(s => ({
          banLists: s.banLists.map(bl =>
            bl.id === banListId
              ? { ...bl, bannedIds: bl.bannedIds.filter(id => id !== heroId), updatedAt: new Date().toISOString() }
              : bl,
          ),
        })),

      toggleBan: (banListId, heroId) => {
        const { isBanned, banHero, unbanHero } = get()
        if (isBanned(banListId, heroId)) unbanHero(banListId, heroId)
        else banHero(banListId, heroId)
      },

      isBanned: (banListId, heroId) => {
        const bl = get().banLists.find(b => b.id === banListId)
        return bl?.bannedIds.includes(heroId) ?? false
      },

      importBanList: (bl) =>
        set(s => {
          const exists = s.banLists.find(b => b.id === bl.id)
          if (exists) {
            // Merge — replace
            return { banLists: s.banLists.map(b => b.id === bl.id ? bl : b) }
          }
          return { banLists: [...s.banLists, bl] }
        }),

      resetToDefaults: () =>
        set({
          banLists:        defaultData.defaultBanLists as BanList[],
          activeBanListId: 'tryhard-bans',
        }),
    }),
    { name: 'hon-ban-store' },
  ),
)
