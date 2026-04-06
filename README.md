# HON:Reborn — Random Hero Picker

A full-featured random hero picker for **Heroes of Newerth: Reborn** 2v2 Mid Wars custom games.

![HON Hero Picker](screenshot-preview.png)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Download hero portrait images from heroesofnewerth.com
node scripts/scrape-heroes.mjs

# 3. Start the app
npm run dev
# → Opens at http://localhost:5173
```

---

## Features

| Feature | Description |
|---|---|
| 🎲 **Random Picker** | Roll 4 heroes for a 2v2 match instantly |
| 🚫 **Ban System** | Multiple named ban lists, unlimited bans, auto-saved |
| ⭐ **Favorites** | Mark favorites, optional weighted boost |
| 🔍 **Filters** | Search, role, attribute (STR/AGI/INT), melee/ranged |
| 📊 **Balance Bar** | Win prediction with Power/Synergy/Matchup/Composition breakdown |
| 🔄 **Repick** | Repick All or single hero slots |
| 📜 **History** | Saves last 100 matches with date, heroes, settings used |
| ⚖️ **Fairness Mode** | Ensures no team is all-carry or all-support |
| 🎭 **No Tryhard Mode** | Excludes meta/OP heroes by tier threshold |
| 🔄 **Reverse Ban** | Whitelist mode — only selected heroes can appear |
| 🎰 **Randomness Modes** | Normal, Chaos, Balanced, Favorites Boost |
| 📤 **Export/Import** | Export ban lists as JSON, import on any device |
| 🖼️ **Share Card** | Generate PNG match card, copy to clipboard, Discord/WhatsApp |
| 🥁 **Animations** | Drum roll overlay, hero card flip animations |
| 🔊 **Sound Effects** | Optional sounds for roll, reveal, ban, repick |

---

## Project Structure

```
HON-Reborn-Hero-Picker/
├── public/
│   ├── heroes/            ← Hero portrait images (hero-id.webp)
│   └── sounds/            ← Sound effects (drumroll.mp3, etc.)
├── scripts/
│   └── scrape-heroes.mjs  ← Image downloader script
├── src/
│   ├── data/
│   │   ├── heroes.json              ← Master hero database
│   │   └── defaultBanLists.json     ← Default ban list seeds
│   ├── types/index.ts               ← All TypeScript interfaces
│   ├── store/                       ← Zustand stores (localStorage persistence)
│   │   ├── useHeroStore.ts
│   │   ├── useBanStore.ts
│   │   ├── usePickStore.ts
│   │   ├── useHistoryStore.ts
│   │   ├── useSettingsStore.ts
│   │   ├── useFavoritesStore.ts
│   │   └── useFilterStore.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── heroUtils.ts
│   │   ├── pickAlgorithm.ts
│   │   ├── fairnessChecker.ts
│   │   ├── balanceCalculator.ts
│   │   └── exportImport.ts
│   ├── hooks/
│   │   ├── usePicker.ts
│   │   ├── useFilters.ts
│   │   ├── useSound.ts
│   │   └── useShareCard.ts
│   ├── components/
│   │   ├── hero/            ← HeroCard, HeroGrid, HeroCardMini
│   │   ├── picker/          ← PickerBoard, PickerSlot, DrumrollOverlay
│   │   ├── bans/            ← BanListManager, BanListSelector, BanListExporter
│   │   ├── filters/         ← FilterBar
│   │   ├── balance/         ← BalanceBar
│   │   ├── history/         ← (in HistoryPage)
│   │   ├── share/           ← ShareCard, ShareControls
│   │   └── ui/              ← Button, Badge, Toggle, Modal, TabNav, etc.
│   ├── pages/
│   │   ├── PickerPage.tsx
│   │   ├── BansPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Hero Images

Hero portraits are served from `public/heroes/`. Filenames must match the hero `id` in `heroes.json`.

### Option A — Automatic scraper (recommended)
```bash
node scripts/scrape-heroes.mjs
```
The scraper fetches portraits from heroesofnewerth.com and saves them to `public/heroes/`. Run it once, and again whenever new heroes are added.

### Option B — Manual
1. Find a portrait image (JPG, PNG, or WebP)
2. Name it `public/heroes/<hero-id>.webp` — the ID is the kebab-case `id` field in `heroes.json`
   - Example: `public/heroes/witch-slayer.webp`
3. Reload the app

If an image is missing, the app shows a colored gradient placeholder — no broken image icons.

---

## Hero Data Structure

Each hero in `src/data/heroes.json`:

```json
{
  "id": "witch-slayer",
  "name": "Witch Slayer",
  "image": "heroes/witch-slayer.webp",
  "role": ["support", "disabler"],
  "attribute": "INT",
  "attackType": "ranged",
  "faction": "legion",
  "tryhardTier": 3,
  "powerRating": 6,
  "midWarsRating": 7,
  "synergies": ["andromeda", "empath", "legionnaire"],
  "counters": ["magebane", "blood-hunter", "night-hound"]
}
```

| Field | Values | Notes |
|---|---|---|
| `id` | kebab-case string | Matches image filename |
| `role` | `carry`, `support`, `ganker`, `initiator`, `disabler`, `nuker`, `pusher`, `semi-carry`, `jungler` | Array, multi-role supported |
| `attribute` | `STR`, `AGI`, `INT` | Primary attribute |
| `attackType` | `melee`, `ranged` | |
| `faction` | `legion`, `hellbourne` | |
| `tryhardTier` | `1`–`5` | 1=broken/OP, 5=weak/niche |
| `powerRating` | `1`–`10` | Overall strength |
| `midWarsRating` | `1`–`10` | Mid Wars specific power |
| `synergies` | hero id array | Same-team synergy partners |
| `counters` | hero id array | Heroes this one is strong against |

### Adding a new hero
1. Add an entry to `src/data/heroes.json`
2. Add the portrait to `public/heroes/<hero-id>.webp`
3. The app hot-reloads — no restart needed

---

## Sound Effects

Place audio files in `public/sounds/`:
- `drumroll.mp3` — plays during the rolling animation
- `reveal.mp3` — plays when results appear
- `pick.mp3` — plays on each hero card reveal
- `ban.mp3` — plays when banning a hero
- `repick.mp3` — plays when repicking a slot

All sounds are optional — if the file doesn't exist it's silently ignored.

---

## Build for Production

```bash
npm run build
# Output in dist/
```

Serve the `dist/` folder with any static file server:
```bash
npx serve dist
```

---

## Balance Bar — How It Works

After each pick, the app scores each team across 4 factors:

| Factor | Weight | Description |
|---|---|---|
| **Power** | 35% | Average of `powerRating` + `midWarsRating` |
| **Synergy** | 30% | Heroes that list each other in `synergies[]` |
| **Matchup** | 25% | Heroes that list enemies in their `counters[]` |
| **Composition** | 10% | Diversity of roles, attributes, and attack types |

Win probability is derived from the relative total scores. Confidence level (low/medium/high) reflects how spread the scores are.

---

## Persistence

All data is stored in your browser's `localStorage` — it persists across browser restarts and page refreshes. Nothing is sent to any server.

| localStorage key | Contents |
|---|---|
| `hon-ban-store` | All ban lists and active selection |
| `hon-history-store` | Match history (last 100) |
| `hon-settings-store` | Sound, animations, modes |
| `hon-favorites-store` | Favorited hero IDs + boost multiplier |

To wipe all data: open DevTools → Application → Local Storage → clear all keys.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** — dev server and build
- **Tailwind CSS 3** — utility-first dark theme
- **Zustand 4** — state management with localStorage persist
- **Framer Motion** — animations
- **Howler.js** — sound effects
- **html2canvas** — share card PNG export
- **react-hot-toast** — notifications
- **react-router-dom v6** — tab navigation
