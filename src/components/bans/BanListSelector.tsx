import React from 'react'
import { useBanStore } from '@/store/useBanStore'

export const BanListSelector: React.FC = () => {
  const { banLists, activeBanListId, setActiveBanList, getActiveBanList } = useBanStore()
  const active = getActiveBanList()

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-text-secondary whitespace-nowrap">Active ban list:</label>
      <select
        value={activeBanListId ?? ''}
        onChange={e => setActiveBanList(e.target.value || null)}
        className={[
          'flex-1 bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm',
          'text-text-primary focus:outline-none focus:border-accent-teal transition-colors',
        ].join(' ')}
      >
        <option value="">None (no bans active)</option>
        {banLists.map(bl => (
          <option key={bl.id} value={bl.id}>
            {bl.name} ({bl.bannedIds.length} banned)
          </option>
        ))}
      </select>
      {active && (
        <span className="text-xs text-accent-red font-medium whitespace-nowrap">
          {active.bannedIds.length} hero{active.bannedIds.length !== 1 ? 'es' : ''} banned
        </span>
      )}
    </div>
  )
}
