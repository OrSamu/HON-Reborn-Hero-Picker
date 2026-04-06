import React from 'react'
import { useBanStore } from '@/store/useBanStore'
import { Button } from '@/components/ui/Button'
import { exportBanList, exportAllBanLists, importBanListFromFile } from '@/utils/exportImport'
import toast from 'react-hot-toast'

export const BanListExporter: React.FC = () => {
  const { banLists, getActiveBanList, importBanList } = useBanStore()
  const active = getActiveBanList()

  async function handleImport() {
    try {
      const bl = await importBanListFromFile()
      importBanList(bl)
      toast.success(`Imported "${bl.name}"`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Import failed'
      toast.error(msg)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {active && (
        <Button
          variant="secondary" size="sm"
          onClick={() => { exportBanList(active); toast.success('Ban list exported') }}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Export Active
        </Button>
      )}
      <Button
        variant="secondary" size="sm"
        onClick={() => { exportAllBanLists(banLists); toast.success('All ban lists exported') }}
      >
        Export All
      </Button>
      <Button
        variant="secondary" size="sm"
        onClick={handleImport}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
          </svg>
        }
      >
        Import
      </Button>
    </div>
  )
}
