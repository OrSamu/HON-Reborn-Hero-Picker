import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHistoryStore } from '@/store/useHistoryStore'
import { HeroCardMini }    from '@/components/hero/HeroCardMini'
import { Button }          from '@/components/ui/Button'
import { EmptyState }      from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

export const HistoryPage: React.FC = () => {
  const { records, deleteRecord, clearHistory } = useHistoryStore()

  if (!records.length) {
    return (
      <EmptyState
        icon="⏳"
        title="No match history yet"
        message="Roll some heroes on the Picker page to start building your history."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header + clear */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-text-primary">
          Match History
          <span className="ml-2 text-sm font-sans text-text-muted font-normal">({records.length})</span>
        </h2>
        <Button
          variant="ghost" size="sm"
          className="text-accent-red hover:text-accent-red-lt"
          onClick={() => { if (confirm('Clear all match history?')) { clearHistory(); toast.success('History cleared') } }}
        >
          Clear All
        </Button>
      </div>

      {/* Records */}
      <AnimatePresence>
        {records.map((record, idx) => {
          const teamA = record.picks.filter(p => p.team === 'A')
          const teamB = record.picks.filter(p => p.team === 'B')
          const date  = new Date(record.date).toLocaleString()

          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-bg-card border border-border rounded-xl p-4 space-y-3"
            >
              {/* Meta row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted">{date}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    <span className="capitalize">{record.randomnessMode}</span> mode
                    {record.activeBanListName !== 'None' && ` · ${record.activeBanListName}`}
                    {record.fairnessModeEnabled && ' · Fairness ON'}
                  </p>
                </div>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="text-text-muted hover:text-accent-red transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Teams */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] text-teamA-light font-bold uppercase tracking-wide">Team A</p>
                  {teamA.map(p => <HeroCardMini key={p.hero.id} hero={p.hero} team="A" />)}
                </div>
                <div className="w-px bg-border self-stretch" />
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] text-teamB-light font-bold uppercase tracking-wide">Team B</p>
                  {teamB.map(p => <HeroCardMini key={p.hero.id} hero={p.hero} team="B" />)}
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
