import React, { useState } from 'react'
import { useBanStore }      from '@/store/useBanStore'
import { useHeroStore }     from '@/store/useHeroStore'
import { BanListManager }   from '@/components/bans/BanListManager'
import { BanListExporter }  from '@/components/bans/BanListExporter'
import { HeroGrid }         from '@/components/hero/HeroGrid'
import { FilterBar }        from '@/components/filters/FilterBar'
import { useFilters }       from '@/hooks/useFilters'
import { Button }           from '@/components/ui/Button'
import { useSound }         from '@/hooks/useSound'
import toast from 'react-hot-toast'

export const BansPage: React.FC = () => {
  const { activeBanListId, toggleBan, isBanned, getActiveBanList, resetToDefaults } = useBanStore()
  const { heroes } = useHeroStore()
  const { filteredHeroes } = useFilters()
  const { play } = useSound()
  const [editMode, setEditMode] = useState(false)

  const activeList = getActiveBanList()

  function handleHeroClick(hero: { id: string; name: string }) {
    if (!activeBanListId || !editMode) return
    const wasBanned = isBanned(activeBanListId, hero.id)
    toggleBan(activeBanListId, hero.id)
    play('ban')
    if (wasBanned) toast(`${hero.name} unbanned`, { icon: '✅' })
    else           toast(`${hero.name} banned`,   { icon: '🚫' })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
      {/* ── Left: Ban list management ── */}
      <div className="lg:w-72 flex-shrink-0 space-y-5">
        <div>
          <h2 className="font-display text-lg font-bold text-text-primary mb-3">Ban Lists</h2>
          <BanListManager />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Import / Export</h3>
          <BanListExporter />
        </div>

        <div>
          <Button
            variant="ghost" size="sm"
            className="text-text-muted hover:text-accent-red"
            onClick={() => { if (confirm('Reset all ban lists to defaults?')) { resetToDefaults(); toast.success('Reset to defaults') } }}
          >
            Reset to defaults
          </Button>
        </div>
      </div>

      {/* ── Right: Hero grid with ban toggle ── */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">
              {activeList ? activeList.name : 'Select a Ban List'}
            </h2>
            {activeList && (
              <p className="text-xs text-text-muted">
                {activeList.bannedIds.length} / {heroes.length} heroes banned
              </p>
            )}
          </div>

          {activeList && (
            <Button
              variant={editMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setEditMode(e => !e)}
            >
              {editMode ? '✓ Done editing' : 'Edit bans'}
            </Button>
          )}
        </div>

        {/* Filter bar */}
        <FilterBar />

        {editMode && activeList && (
          <p className="text-xs text-accent-teal">
            Click a hero to toggle their ban status in "{activeList.name}"
          </p>
        )}

        {/* Hero grid */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0 scrollbar-thin">
          {activeList ? (
            <HeroGrid
              heroes={filteredHeroes}
              banListId={activeBanListId ?? undefined}
              onHeroClick={editMode ? (hero) => handleHeroClick(hero) : undefined}
              showBanOverlay
            />
          ) : (
            <div className="flex items-center justify-center h-40 text-text-muted text-sm">
              Select or create a ban list on the left to start banning heroes.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
