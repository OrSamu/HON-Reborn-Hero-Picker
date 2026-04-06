import type { Hero, HeroFilters } from '@/types'

/**
 * Apply a ban list to a hero pool — removes all banned heroes.
 */
export function applyBanList(heroes: Hero[], bannedIds: string[]): Hero[] {
  if (!bannedIds.length) return heroes
  const set = new Set(bannedIds)
  return heroes.filter(h => !set.has(h.id))
}

/**
 * Apply a whitelist — only whitelisted heroes are eligible.
 */
export function applyWhitelist(heroes: Hero[], whitelistedIds: string[]): Hero[] {
  if (!whitelistedIds.length) return []
  const set = new Set(whitelistedIds)
  return heroes.filter(h => set.has(h.id))
}

/**
 * Exclude heroes at or below the given tryhard tier threshold.
 * e.g. maxTier=2 removes tier-1 and tier-2 heroes (the OP ones).
 */
export function applyNoTryhardFilter(heroes: Hero[], maxTier: number): Hero[] {
  return heroes.filter(h => h.tryhardTier > maxTier)
}

/**
 * Apply all active filters (search, roles, attributes, attack types, factions).
 */
export function applyFilters(heroes: Hero[], filters: HeroFilters): Hero[] {
  let pool = heroes

  // Text search
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase()
    pool = pool.filter(h => h.name.toLowerCase().includes(q))
  }

  // Role filter (hero must have at least one of the selected roles)
  if (filters.roles.length) {
    const selectedSet = new Set(filters.roles)
    pool = pool.filter(h => h.role.some(r => selectedSet.has(r)))
  }

  // Attribute filter
  if (filters.attributes.length) {
    const selectedSet = new Set(filters.attributes)
    pool = pool.filter(h => selectedSet.has(h.attribute))
  }

  // Attack type filter
  if (filters.attackTypes.length) {
    const selectedSet = new Set(filters.attackTypes)
    pool = pool.filter(h => selectedSet.has(h.attackType))
  }

  // Faction filter
  if (filters.factions.length) {
    const selectedSet = new Set(filters.factions)
    pool = pool.filter(h => selectedSet.has(h.faction))
  }

  return pool
}

/**
 * Sort heroes alphabetically by name.
 */
export function sortHeroesAlpha(heroes: Hero[]): Hero[] {
  return [...heroes].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get a deterministic index (0–9) for placeholder gradient based on hero id.
 */
export function getPlaceholderIndex(id: string): number {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return Math.abs(hash) % 10
}
