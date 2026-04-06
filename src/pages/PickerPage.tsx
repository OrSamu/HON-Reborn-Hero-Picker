import React from 'react'
import { FilterBar }         from '@/components/filters/FilterBar'
import { HeroGrid }          from '@/components/hero/HeroGrid'
import { PickerBoard }       from '@/components/picker/PickerBoard'
import { DrumrollOverlay }   from '@/components/picker/DrumrollOverlay'
import { ShareControls }     from '@/components/share/ShareControls'
import { BanListSelector }   from '@/components/bans/BanListSelector'
import { useFilters }        from '@/hooks/useFilters'
import { usePicker }         from '@/hooks/usePicker'
import { usePickStore }      from '@/store/usePickStore'

export const PickerPage: React.FC = () => {
  const { filteredHeroes, eligiblePool } = useFilters()
  const { rollAll, rollSingle, isRolling } = usePicker()
  const { currentPick, hasResult } = usePickStore()

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
      {/* ── Left panel: hero grid ── */}
      <div className="lg:w-[55%] flex flex-col gap-3 min-h-0">
        {/* Active ban selector */}
        <BanListSelector />

        {/* Filters */}
        <FilterBar />

        {/* Hero count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            {filteredHeroes.length} heroes shown
            {eligiblePool.length < filteredHeroes.length && (
              <span className="ml-1 text-accent-red">
                · {eligiblePool.length} eligible for picking
              </span>
            )}
          </p>
        </div>

        {/* Scrollable hero grid */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0 scrollbar-thin">
          <HeroGrid
            heroes={filteredHeroes}
            showBanOverlay
          />
        </div>
      </div>

      {/* ── Right panel: pick result ── */}
      <div className="lg:w-[45%] flex flex-col gap-4">
        <PickerBoard
          eligiblePool={eligiblePool}
          onRollAll={() => rollAll(eligiblePool)}
          onRollSingle={(slot) => rollSingle(slot, eligiblePool)}
          isRolling={isRolling}
        />

        {/* Share controls (only shown after a pick) */}
        {hasResult && currentPick.length === 4 && (
          <ShareControls picks={currentPick} />
        )}
      </div>

      {/* Drum roll overlay */}
      <DrumrollOverlay isVisible={isRolling} />
    </div>
  )
}
