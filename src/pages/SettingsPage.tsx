import React from 'react'
import { useSettingsStore }  from '@/store/useSettingsStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { Toggle } from '@/components/ui/Toggle'
import { RANDOMNESS_MODES, TRYHARD_TIER_LABELS } from '@/utils/constants'
import type { RandomnessMode, TryhardTier } from '@/types'

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
    <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wide">{title}</h3>
    {children}
  </div>
)

export const SettingsPage: React.FC = () => {
  const {
    soundEnabled, setSoundEnabled,
    animationsEnabled, setAnimationsEnabled,
    randomnessMode, setRandomnessMode,
    fairnessModeEnabled, setFairnessModeEnabled,
    noTryhardModeEnabled, setNoTryhardModeEnabled,
    noTryhardMaxTier, setNoTryhardMaxTier,
    reverseBanModeEnabled, setReverseBanModeEnabled,
  } = useSettingsStore()

  const { weightBoostMultiplier, setMultiplier } = useFavoritesStore()

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="font-display text-lg font-bold text-text-primary">Settings</h2>

      {/* ── Randomness Mode ── */}
      <Section title="Randomness Mode">
        <div className="space-y-2">
          {RANDOMNESS_MODES.map(m => (
            <label key={m.value} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="randomness"
                value={m.value}
                checked={randomnessMode === m.value}
                onChange={() => setRandomnessMode(m.value as RandomnessMode)}
                className="mt-0.5 accent-accent-teal"
              />
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent-teal transition-colors">
                  {m.label}
                </p>
                <p className="text-xs text-text-muted">{m.description}</p>
              </div>
            </label>
          ))}
        </div>
      </Section>

      {/* ── Favorites Boost ── */}
      {randomnessMode === 'favorites-boost' && (
        <Section title="Favorites Boost Multiplier">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Favorites are <span className="text-accent-gold font-bold">{weightBoostMultiplier}×</span> more likely to appear
              </p>
              <span className="text-xs text-text-muted">{weightBoostMultiplier}×</span>
            </div>
            <input
              type="range" min={1} max={10} step={1}
              value={weightBoostMultiplier}
              onChange={e => setMultiplier(Number(e.target.value))}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>1× (same)</span><span>5× (heavy)</span><span>10× (dominant)</span>
            </div>
          </div>
        </Section>
      )}

      {/* ── Game Modes ── */}
      <Section title="Game Modes">
        <Toggle
          label="Fairness Mode"
          description="Tries to ensure no team gets all carries or all supports."
          checked={fairnessModeEnabled}
          onChange={setFairnessModeEnabled}
        />
        <hr className="border-border" />
        <div className="space-y-3">
          <Toggle
            label="No Tryhard Mode"
            description="Excludes strong/meta heroes below the selected tier."
            checked={noTryhardModeEnabled}
            onChange={setNoTryhardModeEnabled}
          />
          {noTryhardModeEnabled && (
            <div className="pl-4 space-y-2">
              <p className="text-xs text-text-muted">
                Exclude heroes with tryhard tier ≤ <span className="text-accent-gold font-bold">{noTryhardMaxTier}</span>
                {' '}({TRYHARD_TIER_LABELS[noTryhardMaxTier]})
              </p>
              <input
                type="range" min={1} max={4} step={1}
                value={noTryhardMaxTier}
                onChange={e => setNoTryhardMaxTier(Number(e.target.value) as TryhardTier)}
                className="w-full accent-accent-gold"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>1 (Broken only)</span>
                <span>2 (Meta+)</span>
                <span>3 (Viable+)</span>
                <span>4 (All but weak)</span>
              </div>
            </div>
          )}
        </div>
        <hr className="border-border" />
        <div className="space-y-1">
          <Toggle
            label="Reverse Ban Mode (Whitelist)"
            description="Instead of banning, select which heroes ARE allowed. All others are excluded."
            checked={reverseBanModeEnabled}
            onChange={setReverseBanModeEnabled}
          />
          {reverseBanModeEnabled && (
            <p className="text-xs text-accent-gold pl-4">
              ⚠ In this mode the active ban list acts as a whitelist — only listed heroes can be picked.
            </p>
          )}
        </div>
      </Section>

      {/* ── UI ── */}
      <Section title="UI & Experience">
        <Toggle
          label="Sound Effects"
          description="Drum roll, reveal, ban, and repick sound effects."
          checked={soundEnabled}
          onChange={setSoundEnabled}
        />
        <hr className="border-border" />
        <Toggle
          label="Animations"
          description="Hero card flip animations and drum roll overlay."
          checked={animationsEnabled}
          onChange={setAnimationsEnabled}
        />
      </Section>

      {/* ── Info ── */}
      <Section title="About">
        <p className="text-xs text-text-muted leading-relaxed">
          HON:Reborn Random Hero Picker v1.0.0<br />
          Built for 2v2 Mid Wars custom games.<br />
          All data persists in your browser's localStorage.<br />
          Hero images: run <code className="bg-bg-tertiary px-1 rounded">node scripts/scrape-heroes.mjs</code> to download portraits.
        </p>
      </Section>
    </div>
  )
}
