import React, { useState } from 'react'
import { useBanStore } from '@/store/useBanStore'
import { Button } from '@/components/ui/Button'
import { Modal  } from '@/components/ui/Modal'
import toast from 'react-hot-toast'

export const BanListManager: React.FC = () => {
  const {
    banLists, activeBanListId, createBanList, renameBanList,
    deleteBanList, setActiveBanList,
  } = useBanStore()

  const [showCreate, setShowCreate] = useState(false)
  const [showRename, setShowRename] = useState<string | null>(null)
  const [nameInput, setNameInput]   = useState('')

  function handleCreate() {
    const name = nameInput.trim()
    if (!name) return
    const id = createBanList(name)
    setActiveBanList(id)
    setNameInput('')
    setShowCreate(false)
    toast.success(`Ban list "${name}" created`)
  }

  function handleRename(id: string) {
    const name = nameInput.trim()
    if (!name) return
    renameBanList(id, name)
    setNameInput('')
    setShowRename(null)
    toast.success('Ban list renamed')
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ban list "${name}"?`)) return
    deleteBanList(id)
    toast.success(`"${name}" deleted`)
  }

  return (
    <>
      <div className="space-y-2">
        {banLists.map(bl => (
          <div
            key={bl.id}
            className={[
              'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors',
              activeBanListId === bl.id
                ? 'border-accent-teal/50 bg-accent-teal/5'
                : 'border-border bg-bg-card hover:bg-bg-hover',
            ].join(' ')}
          >
            <button
              onClick={() => setActiveBanList(bl.id)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              {activeBanListId === bl.id && (
                <span className="w-2 h-2 rounded-full bg-accent-teal flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold text-text-primary text-sm">{bl.name}</p>
                <p className="text-xs text-text-muted">
                  {bl.bannedIds.length} hero{bl.bannedIds.length !== 1 ? 'es' : ''} banned
                </p>
              </div>
            </button>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="sm"
                onClick={() => { setNameInput(bl.name); setShowRename(bl.id) }}
              >
                Rename
              </Button>
              <Button
                variant="ghost" size="sm"
                onClick={() => handleDelete(bl.id, bl.name)}
                className="text-accent-red hover:text-accent-red-lt"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="secondary" size="sm"
          onClick={() => { setNameInput(''); setShowCreate(true) }}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Ban List
        </Button>
      </div>

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Ban List">
        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            placeholder="e.g. Tryhard Bans, Weekend Mode…"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>

      {/* Rename modal */}
      <Modal isOpen={!!showRename} onClose={() => setShowRename(null)} title="Rename Ban List">
        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && showRename && handleRename(showRename)}
            className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowRename(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => showRename && handleRename(showRename)}>Rename</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
