import React from 'react'
import { useFilterStore } from '@/store/useFilterStore'
import { ALL_ROLES, ALL_ATTRIBUTES, ALL_ATTACK_TYPES, ROLE_LABELS } from '@/utils/constants'
import { Button } from '@/components/ui/Button'
import type { HeroRole, HeroAttribute, AttackType } from '@/types'

export const FilterBar: React.FC = () => {
  const { filters, setSearch, toggleRole, toggleAttribute, toggleAttackType, clearFilters } =
    useFilterStore()

  const hasActiveFilters =
    filters.search ||
    filters.roles.length ||
    filters.attributes.length ||
    filters.attackTypes.length

  return (
    <div className="space-y-3">
      {/* Search + clear */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search heroes…"
            value={filters.search}
            onChange={e => setSearch(e.target.value)}
            className={[
              'w-full pl-9 pr-3 py-2 rounded-lg bg-bg-tertiary border border-border',
              'text-sm text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:border-accent-teal transition-colors',
            ].join(' ')}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
        )}
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_ROLES.map((role: HeroRole) => {
          const active = filters.roles.includes(role)
          return (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={[
                'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                active
                  ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/50'
                  : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-light',
              ].join(' ')}
            >
              {ROLE_LABELS[role]}
            </button>
          )
        })}
      </div>

      {/* Attribute + attack type */}
      <div className="flex flex-wrap gap-2">
        {/* Attributes */}
        {ALL_ATTRIBUTES.map((attr: HeroAttribute) => {
          const active = filters.attributes.includes(attr)
          const colorMap: Record<string, string> = {
            STR: active ? 'bg-red-900/40   text-red-300   border-red-700/60'   : '',
            AGI: active ? 'bg-green-900/40 text-green-300 border-green-700/60' : '',
            INT: active ? 'bg-blue-900/40  text-blue-300  border-blue-700/60'  : '',
          }
          return (
            <button
              key={attr}
              onClick={() => toggleAttribute(attr)}
              className={[
                'px-2.5 py-1 rounded-full text-xs font-bold border transition-colors',
                active
                  ? colorMap[attr]
                  : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-light',
              ].join(' ')}
            >
              {attr}
            </button>
          )
        })}

        <div className="w-px h-5 bg-border self-center" />

        {/* Attack types */}
        {ALL_ATTACK_TYPES.map((at: AttackType) => {
          const active = filters.attackTypes.includes(at)
          return (
            <button
              key={at}
              onClick={() => toggleAttackType(at)}
              className={[
                'px-2.5 py-1 rounded-full text-xs font-medium border capitalize transition-colors',
                active
                  ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/50'
                  : 'bg-bg-tertiary text-text-secondary border-border hover:border-border-light',
              ].join(' ')}
            >
              {at === 'melee' ? '⚔ ' : '🏹 '}{at}
            </button>
          )
        })}
      </div>
    </div>
  )
}
