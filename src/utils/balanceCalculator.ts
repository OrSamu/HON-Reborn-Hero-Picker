import type { Hero, PickedHero, TeamBalanceResult, BalanceBreakdown, TeamScore } from '@/types'

// ─── Weights for each factor ──────────────────────────────────────────────

const W = {
  power:       0.35,   // raw powerRating + midWarsRating
  synergy:     0.30,   // heroes on same team that list each other in synergies[]
  matchup:     0.25,   // heroes that list an enemy in counters[]
  composition: 0.10,   // role / attribute / attack-type diversity
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function synergyScore(heroA: Hero, heroB: Hero): number {
  const ab = heroA.synergies.includes(heroB.id) ? 1 : 0
  const ba = heroB.synergies.includes(heroA.id) ? 1 : 0
  return ab + ba   // 0, 1, or 2
}

function counterScore(attacker: Hero, defenders: Hero[]): number {
  return defenders.reduce((n, d) => n + (attacker.counters.includes(d.id) ? 1 : 0), 0)
}

function compositionScore(heroes: Hero[]): number {
  if (heroes.length < 2) return 0
  const [a, b] = heroes
  let score = 0

  // Role diversity: different primary roles
  if (a.role[0] !== b.role[0]) score += 1

  // Attribute diversity
  if (a.attribute !== b.attribute) score += 1

  // Attack type mix
  if (a.attackType !== b.attackType) score += 1

  return score  // 0–3
}

// ─── Per-team score ───────────────────────────────────────────────────────

function scoreTeam(team: Hero[], enemies: Hero[]): TeamScore {
  // Power: average of (powerRating + midWarsRating) / 2 for each hero
  const powerRaw = team.reduce((s, h) => s + (h.powerRating + h.midWarsRating) / 2, 0) / team.length
  // Normalize to 0–1 (max possible = 10)
  const power = Math.min(powerRaw / 10, 1)

  // Synergy (0–2 per pair, only 1 pair in 2v2)
  const synRaw = synergyScore(team[0], team[1])
  const synergy = Math.min(synRaw / 2, 1)

  // Matchup: how many enemies each hero counters
  const matchRaw = team.reduce((s, h) => s + counterScore(h, enemies), 0)
  const matchup  = Math.min(matchRaw / (team.length * 2), 1)

  // Composition (0–3 → normalized to 0–1)
  const compRaw    = compositionScore(team)
  const composition = compRaw / 3

  const score =
    power       * W.power       +
    synergy     * W.synergy     +
    matchup     * W.matchup     +
    composition * W.composition

  return {
    score:     Math.round(score * 1000) / 10,   // 0–100 percentage
    breakdown: {
      power:       Math.round(power       * 100),
      synergy:     Math.round(synergy     * 100),
      matchup:     Math.round(matchup     * 100),
      composition: Math.round(composition * 100),
    },
  }
}

// ─── Dominant factor label ────────────────────────────────────────────────

function dominantFactor(
  teamAScore: TeamScore,
  teamBScore: TeamScore,
  winProbA:   number,
): string {
  if (Math.abs(winProbA - 50) < 5) return 'Closely matched — could go either way!'

  const favored = winProbA > 50 ? 'Team A' : 'Team B'
  const scoreA  = teamAScore.breakdown
  const scoreB  = teamBScore.breakdown

  // Find which factor team A leads by most (or least if team B wins)
  const factors = ['power', 'synergy', 'matchup', 'composition'] as const
  let biggestGap = 0
  let biggestFactor = 'power'

  for (const f of factors) {
    const gap = Math.abs(scoreA[f] - scoreB[f])
    if (gap > biggestGap) { biggestGap = gap; biggestFactor = f }
  }

  const factorLabels: Record<string, string> = {
    power:       'raw power',
    synergy:     'hero synergy',
    matchup:     'counter-picks',
    composition: 'team composition',
  }

  return `${favored} favored — stronger ${factorLabels[biggestFactor]}`
}

// ─── Confidence ───────────────────────────────────────────────────────────

function confidence(winProbA: number): 'low' | 'medium' | 'high' {
  const spread = Math.abs(winProbA - 50)
  if (spread < 6)  return 'low'
  if (spread < 15) return 'medium'
  return 'high'
}

// ─── Main export ──────────────────────────────────────────────────────────

export function calculateBalance(picks: PickedHero[]): TeamBalanceResult | null {
  if (picks.length < 4) return null

  const teamAHeroes = picks.filter(p => p.team === 'A').map(p => p.hero)
  const teamBHeroes = picks.filter(p => p.team === 'B').map(p => p.hero)

  if (teamAHeroes.length < 2 || teamBHeroes.length < 2) return null

  const teamA = scoreTeam(teamAHeroes, teamBHeroes)
  const teamB = scoreTeam(teamBHeroes, teamAHeroes)

  const total = teamA.score + teamB.score
  const winProbabilityA = total === 0 ? 50 : Math.round((teamA.score / total) * 100)

  return {
    teamA,
    teamB,
    winProbabilityA,
    dominantFactor: dominantFactor(teamA, teamB, winProbabilityA),
    confidence:     confidence(winProbabilityA),
  }
}
