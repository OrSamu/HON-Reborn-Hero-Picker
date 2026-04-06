import { create } from 'zustand'
import type { HeroFilters, HeroRole, HeroAttribute, AttackType, HeroFaction } from '@/types'

interface FilterStore {
  filters: HeroFilters

  setSearch:         (q: string) => void
  toggleRole:        (role: HeroRole) => void
  toggleAttribute:   (attr: HeroAttribute) => void
  toggleAttackType:  (at: AttackType) => void
  toggleFaction:     (faction: HeroFaction) => void
  clearFilters:      () => void
}

const defaultFilters: HeroFilters = {
  search:      '',
  roles:       [],
  attributes:  [],
  attackTypes: [],
  factions:    [],
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}

export const useFilterStore = create<FilterStore>()((set) => ({
  filters: defaultFilters,

  setSearch:        (q)      => set(s => ({ filters: { ...s.filters, search: q } })),
  toggleRole:       (role)   => set(s => ({ filters: { ...s.filters, roles:       toggle(s.filters.roles,       role)   } })),
  toggleAttribute:  (attr)   => set(s => ({ filters: { ...s.filters, attributes:  toggle(s.filters.attributes,  attr)   } })),
  toggleAttackType: (at)     => set(s => ({ filters: { ...s.filters, attackTypes: toggle(s.filters.attackTypes, at)     } })),
  toggleFaction:    (faction)=> set(s => ({ filters: { ...s.filters, factions:    toggle(s.filters.factions,    faction)} })),
  clearFilters:     ()       => set({ filters: defaultFilters }),
}))
