import { create } from 'zustand'
import type { Hero } from '@/types'
import heroData from '@/data/heroes.json'

interface HeroStore {
  heroes:   Hero[]
  isLoaded: boolean
}

export const useHeroStore = create<HeroStore>()(() => ({
  heroes:   heroData.heroes as Hero[],
  isLoaded: true,
}))
