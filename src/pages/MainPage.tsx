import { useCallback, useEffect, useState } from 'react'
import { AddDesireDialog } from '../components/AddDesireDialog'
import { DesireTable } from '../components/DesireTable'
import { ViewSwitch, type DesireView } from '../components/ViewSwitch'
import type { Desire, DesireToday } from '../models/desire.types'
import { useDesireService } from '../services/DesireServiceContext'

export function MainPage() {
  const desireService = useDesireService()
  const [view, setView] = useState<DesireView>('today')
  const [todayItems, setTodayItems] = useState<DesireToday[]>([])
  const [allItems, setAllItems] = useState<Desire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addingRecordId, setAddingRecordId] = useState<number | null>(null)

  const loadToday = useCallback(async () => {
    const items = await desireService.listDesiresToday()
    setTodayItems(items)
  }, [desireService])

  const loadAll = useCallback(async () => {
    const page = await desireService.listDesires(1, 100)
    setAllItems(page.items)
  }, [desireService])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([loadToday(), loadAll()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load desires')
    } finally {
      setLoading(false)
    }
  }, [loadToday, loadAll])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleAddDesire = async (name: string, tags: string[]) => {
    await desireService.addDesire({ name, tags })
    await refresh()
    setView('today')
  }

  const handleAddRecord = async (desireId: number) => {
    setAddingRecordId(desireId)
    setError(null)
    try {
      await desireService.addRecord(desireId)
      await refresh()
      if (view === 'all') {
        setView('today')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add record')
    } finally {
      setAddingRecordId(null)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>DesireMan</h1>
          <p className="subtitle">Track what you desire, when it happens</p>
        </div>
        <button
          type="button"
          className="icon-btn primary"
          title="Add desire"
          aria-label="Add desire"
          onClick={() => setDialogOpen(true)}
        >
          +
        </button>
      </header>

      <div className="toolbar">
        <ViewSwitch value={view} onChange={setView} />
      </div>

      {error && <p className="error banner">{error}</p>}

      <DesireTable
        view={view}
        todayItems={todayItems}
        allItems={allItems}
        loading={loading}
        addingRecordId={addingRecordId}
        onAddRecord={handleAddRecord}
      />

      <AddDesireDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddDesire}
      />
    </div>
  )
}
