import type { BanList, MatchRecord } from '@/types'

// ─── Download helper ──────────────────────────────────────────────────────

function downloadJson(obj: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Ban list export / import ─────────────────────────────────────────────

export function exportBanList(banList: BanList): void {
  downloadJson(banList, `hon-banlist-${banList.name.toLowerCase().replace(/\s+/g, '-')}.json`)
}

export function exportAllBanLists(banLists: BanList[]): void {
  downloadJson({ banLists }, 'hon-banlists-all.json')
}

export function importBanListFromFile(): Promise<BanList> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type  = 'file'
    input.accept = '.json,application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) { reject(new Error('No file selected')); return }
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string)
          // Accept either a bare BanList object or { banLists: [...] }
          const banList: BanList = data.bannedIds ? data : data.banLists?.[0]
          if (!banList?.bannedIds) throw new Error('Invalid ban list format')
          resolve(banList)
        } catch (e) {
          reject(e)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })
}

// ─── History export ───────────────────────────────────────────────────────

export function exportHistory(records: MatchRecord[]): void {
  downloadJson({ history: records }, 'hon-match-history.json')
}

// ─── Settings export ──────────────────────────────────────────────────────

export function exportSettings(settings: unknown): void {
  downloadJson(settings, 'hon-settings.json')
}
