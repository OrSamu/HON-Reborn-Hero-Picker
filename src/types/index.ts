// ─── Hero metadata types ──────────────────────────────────────────────────────

export type HeroRole =
  | 'carry'
  | 'support'
  | 'ganker'
  | 'jungler'
  | 'pusher'
  | 'initiator'
  | 'semi-carry'
  | 'disabler'
  | 'nuker'

export type HeroAttribute = 'STR' | 'AGI' | 'INT'
export type AttackType    = 'melee' | 'ranged'
export type HeroFaction   = 'legion' | 'hellbourne'

/** 1 = extremely OP / must-ban  →  5 = weak / niche */
export type TryhardTier = 1 | 2 | 3 | 4 | 5

export interface Hero {
  id:            string        // kebab-case slug; matches public/heroes/{id}.webp
  name:          string
  image:         string        // path relative to /public, e.g. "heroes/witch-slayer.webp"
  role:          HeroRole[]
  attribute:     HeroAttribute
  attackType:    AttackType
  faction:       HeroFaction
  tryhardTier:   TryhardTier

  // Balance / prediction
  powerRating:   number        // 1–10 overall strength
  midWarsRating: number        // 1–10 Mid Wars specific rating
  synergies:     string[]      // hero IDs that pair well with this hero
  counters:      string[]      // hero IDs this hero is strong against
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface HeroFilters {
  search:      string
  roles:       HeroRole[]
  attributes:  HeroAttribute[]
  attackTypes: AttackType[]
  factions:    HeroFaction[]
}

// ─── Ban lists ───────────────────────────────────────────────────────────────

export interface BanList {
  id:         string
  name:       string
  bannedIds:  string[]        // hero ids
  createdAt:  string          // ISO date
  updatedAt:  string
}

// ─── Pick session ─────────────────────────────────────────────────────────────

export type TeamSide = 'A' | 'B'
export type SlotIndex = 0 | 1 | 2 | 3

export interface PickedHero {
  hero:   Hero
  team:   TeamSide
  slot:   SlotIndex   // 0,1 = Team A;  2,3 = Team B
  isNew:  boolean     // true briefly after a repick, drives animation
}

// ─── Match history ────────────────────────────────────────────────────────────

export interface MatchRecord {
  id:                  string
  date:                string          // ISO date
  picks:               PickedHero[]
  activeBanListName:   string
  randomnessMode:      RandomnessMode
  fairnessModeEnabled: boolean
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type RandomnessMode =
  | 'chaos'
  | 'normal'
  | 'balanced'
  | 'favorites-boost'

// ─── Balance calculator ───────────────────────────────────────────────────────

export interface BalanceBreakdown {
  power:       number
  synergy:     number
  matchup:     number
  composition: number
}

export interface TeamScore {
  score:     number
  breakdown: BalanceBreakdown
}

export interface TeamBalanceResult {
  teamA:            TeamScore
  teamB:            TeamScore
  winProbabilityA:  number      // 0–100 (percentage for Team A)
  dominantFactor:   string
  confidence:       'low' | 'medium' | 'high'
}
