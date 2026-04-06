import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favoriteIds:          string[]
  weightBoostMultiplier: number    // Default 3 — favorites are 3× more likely

  addFavorite:    (heroId: string) => void
  removeFavorite: (heroId: string) => void
  toggleFavorite: (heroId: string) => void
  isFavorite:     (heroId: string) => boolean
  setMultiplier:  (val: number) => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds:           [],
      weightBoostMultiplier: 3,

      addFavorite: (heroId) =>
        set(s => ({
          favoriteIds: s.favoriteIds.includes(heroId)
            ? s.favoriteIds
            : [...s.favoriteIds, heroId],
        })),

      removeFavorite: (heroId) =>
        set(s => ({ favoriteIds: s.favoriteIds.filter(id => id !== heroId) })),

      toggleFavorite: (heroId) => {
        const { isFavorite, addFavorite, removeFavorite } = get()
        if (isFavorite(heroId)) removeFavorite(heroId)
        else addFavorite(heroId)
      },

      isFavorite: (heroId) => get().favoriteIds.includes(heroId),

      setMultiplier: (val) =>
        set({ weightBoostMultiplier: Math.max(1, Math.min(10, val)) }),
    }),
    { name: 'hon-favorites-store' },
  ),
)
