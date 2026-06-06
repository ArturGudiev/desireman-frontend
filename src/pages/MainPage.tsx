import { useCallback, useEffect, useState } from 'react'
import { AddItemDialog } from '../components/AddItemDialog'
import { ItemTable } from '../components/ItemTable'
import {
  ViewSwitch,
  KIND_VIEW_OPTIONS,
  TIME_VIEW_OPTIONS,
  type KindView,
  type TimeView,
} from '../components/ViewSwitch'
import type { Desire, DesireToday } from '../models/desire.types'
import type { Necessity, NecessityToday } from '../models/necessity.types'
import { useDesireService, useNecessityService } from '../services/AppServicesContext'

export function MainPage() {
  const desireService = useDesireService()
  const necessityService = useNecessityService()

  const [kind, setKind] = useState<KindView>('desires')
  const [view, setView] = useState<TimeView>('today')

  const [desireTodayItems, setDesireTodayItems] = useState<DesireToday[]>([])
  const [desireAllItems, setDesireAllItems] = useState<Desire[]>([])
  const [necessityTodayItems, setNecessityTodayItems] = useState<NecessityToday[]>([])
  const [necessityAllItems, setNecessityAllItems] = useState<Necessity[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addingRecordId, setAddingRecordId] = useState<number | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [desireToday, desireAll, necessityToday, necessityAll] = await Promise.all([
        desireService.listDesiresToday(),
        desireService.listDesires(1, 100),
        necessityService.listNecessitiesToday(),
        necessityService.listNecessities(1, 100),
      ])
      setDesireTodayItems(desireToday)
      setDesireAllItems(desireAll.items)
      setNecessityTodayItems(necessityToday)
      setNecessityAllItems(necessityAll.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [desireService, necessityService])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const isDesires = kind === 'desires'
  const todayItems = isDesires ? desireTodayItems : necessityTodayItems
  const allItems = isDesires ? desireAllItems : necessityAllItems
  const itemLabel = isDesires ? 'desire' : 'necessity'

  const handleAddItem = async (name: string, tags: string[]) => {
    if (isDesires) {
      await desireService.addDesire({ name, tags })
    } else {
      await necessityService.addNecessity({ name, tags })
    }
    await refresh()
    setView('today')
  }

  const handleAddRecord = async (id: number) => {
    setAddingRecordId(id)
    setError(null)
    try {
      if (isDesires) {
        await desireService.addRecord(id)
      } else {
        await necessityService.addRecord(id)
      }
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
          <p className="subtitle">Track what you desire and need, when it happens</p>
        </div>
        <button
          type="button"
          className="icon-btn primary"
          title={`Add ${itemLabel}`}
          aria-label={`Add ${itemLabel}`}
          onClick={() => setDialogOpen(true)}
        >
          +
        </button>
      </header>

      <div className="toolbar">
        <ViewSwitch
          value={kind}
          onChange={setKind}
          options={KIND_VIEW_OPTIONS}
          ariaLabel="Item type"
        />
        <ViewSwitch
          value={view}
          onChange={setView}
          options={TIME_VIEW_OPTIONS}
          ariaLabel="Time range"
        />
      </div>

      {error && <p className="error banner">{error}</p>}

      <ItemTable
        kind={kind}
        view={view}
        todayItems={todayItems}
        allItems={allItems}
        loading={loading}
        addingRecordId={addingRecordId}
        onAddRecord={handleAddRecord}
      />

      <AddItemDialog
        open={dialogOpen}
        title={`Add ${itemLabel}`}
        namePlaceholder={
          isDesires ? 'What do you desire?' : 'What do you need?'
        }
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  )
}
