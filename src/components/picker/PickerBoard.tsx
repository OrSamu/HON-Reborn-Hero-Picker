import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePickStore }   from '@/store/usePickStore'
import { PickerSlot }     from './PickerSlot'
import { BalanceBar }     from '@/components/balance/BalanceBar'
import { calculateBalance } from '@/utils/balanceCalculator'
import type { Hero } from '@/types'

interface PickerBoardProps {
  eligiblePool: Hero[]
  onRollAll:   () => void
  onRollSingle:(slot: 0|1|2|3) => void
  isRolling:   boolean
}

export const PickerBoard: React.FC<PickerBoardProps> = ({
  eligiblePool, onRollAll, onRollSingle, isRolling,
}) => {
  const { currentPick, hasResult } = usePickStore()

  const teamA = currentPick.filter(p => p.team === 'A')
  const teamB = currentPick.filter(p => p.team === 'B')

  const balanceResult = useMemo(
    () => hasResult ? calculateBalance(currentPick) : null,
    [currentPick, hasResult],
  )

  const canRoll = eligiblePool.length >= 4

  return (
    <div className="space-y-4">
      {/* Roll button */}
      <div className="flex justify-center">
        <motion.button
          whileTap={canRoll ? { scale: 0.95 } : undefined}
          whileHover={canRoll ? { scale: 1.02 } : undefined}
          onClick={onRollAll}
          disabled={!canRoll || isRolling}
          className={[
            'relative px-10 py-4 rounded-2xl font-display font-black text-xl uppercase tracking-widest',
            'transition-all duration-200 shadow-card',
            canRoll && !isRolling
              ? 'bg-gradient-to-r from-accent-gold to-accent-gold-lt text-bg-primary cursor-pointer shadow-glow-gold animate-pulse-gold'
              : 'bg-bg-tertiary text-text-muted cursor-not-allowed',
          ].join(' ')}
        >
          {isRolling ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Rolling…
            </span>
          ) : hasResult ? '🎲 Reroll All' : '🎲 Roll Heroes'}

          {!canRoll && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-accent-red whitespace-nowrap">
              Need ≥ 4 eligible heroes
            </span>
          )}
        </motion.button>
      </div>

      {/* Pick result */}
      <AnimatePresence>
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Teams grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Team A */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-3 h-3 rounded-full bg-teamA" />
                  <h3 className="text-sm font-bold text-teamA-light uppercase tracking-wide">Team A</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {teamA.map((pick, i) => (
                    <PickerSlot
                      key={`${pick.hero.id}-${pick.slot}`}
                      pick={pick}
                      onRepick={() => onRollSingle(pick.slot)}
                      teamColor="A"
                      slotNumber={(i + 1) as 1 | 2}
                    />
                  ))}
                </div>
              </div>

              {/* Team B */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 justify-end">
                  <h3 className="text-sm font-bold text-teamB-light uppercase tracking-wide">Team B</h3>
                  <div className="w-3 h-3 rounded-full bg-teamB" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {teamB.map((pick, i) => (
                    <PickerSlot
                      key={`${pick.hero.id}-${pick.slot}`}
                      pick={pick}
                      onRepick={() => onRollSingle(pick.slot)}
                      teamColor="B"
                      slotNumber={(i + 1) as 1 | 2}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Balance bar */}
            {balanceResult && <BalanceBar result={balanceResult} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
