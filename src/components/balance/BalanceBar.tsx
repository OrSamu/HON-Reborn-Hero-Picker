import React from 'react'
import { motion } from 'framer-motion'
import type { TeamBalanceResult } from '@/types'

interface BalanceBarProps {
  result: TeamBalanceResult
}

const confidenceLabel: Record<string, string> = {
  low:    'Low confidence',
  medium: 'Moderate confidence',
  high:   'High confidence',
}

const confidenceColor: Record<string, string> = {
  low:    'text-text-muted',
  medium: 'text-accent-gold',
  high:   'text-accent-teal',
}

interface BreakdownRowProps {
  label: string
  teamA: number
  teamB: number
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({ label, teamA, teamB }) => {
  const total  = teamA + teamB || 1
  const pctA   = Math.round((teamA / total) * 100)

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-right text-teamA-light font-medium">{teamA}</span>
      <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-teamA to-teamA-light rounded-full"
        />
      </div>
      <span className="w-24 text-left text-teamB-light font-medium">{teamB}</span>
      <span className="w-20 text-center text-text-muted">{label}</span>
    </div>
  )
}

export const BalanceBar: React.FC<BalanceBarProps> = ({ result }) => {
  const { teamA, teamB, winProbabilityA, dominantFactor, confidence } = result
  const pctA = winProbabilityA
  const pctB = 100 - pctA

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">Win Prediction</h3>
        <span className={`text-xs ${confidenceColor[confidence]}`}>
          {confidenceLabel[confidence]}
        </span>
      </div>

      {/* Main bar */}
      <div>
        <div className="flex justify-between text-sm font-bold mb-1">
          <span className="text-teamA-light">Team A  {pctA}%</span>
          <span className="text-teamB-light">{pctB}%  Team B</span>
        </div>
        <div className="relative h-4 rounded-full overflow-hidden bg-teamB">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-teamA to-teamA-light rounded-full"
          />
          {/* Center tick */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/40" />
        </div>
      </div>

      {/* Dominant factor */}
      <p className="text-center text-xs text-text-secondary italic">{dominantFactor}</p>

      {/* Breakdown rows */}
      <div className="space-y-1.5 pt-1 border-t border-border">
        <div className="flex justify-between text-[10px] text-text-muted mb-1 px-1">
          <span>Team A</span>
          <span className="w-20 text-center">Factor</span>
          <span>Team B</span>
        </div>
        <BreakdownRow label="Power"       teamA={teamA.breakdown.power}       teamB={teamB.breakdown.power}       />
        <BreakdownRow label="Synergy"     teamA={teamA.breakdown.synergy}     teamB={teamB.breakdown.synergy}     />
        <BreakdownRow label="Matchup"     teamA={teamA.breakdown.matchup}     teamB={teamB.breakdown.matchup}     />
        <BreakdownRow label="Composition" teamA={teamA.breakdown.composition} teamB={teamB.breakdown.composition} />
      </div>

      {/* Overall scores */}
      <div className="flex justify-between text-xs pt-1 border-t border-border">
        <span className="text-teamA-light font-bold">Score: {teamA.score.toFixed(1)}</span>
        <span className="text-text-muted">Overall</span>
        <span className="text-teamB-light font-bold">{teamB.score.toFixed(1)} :Score</span>
      </div>
    </div>
  )
}
