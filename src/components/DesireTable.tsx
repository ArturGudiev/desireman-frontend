import type { Desire, DesireToday } from '../models/desire.types'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface DesireTableProps {
  view: 'today' | 'all'
  todayItems: DesireToday[]
  allItems: Desire[]
  loading: boolean
  addingRecordId: number | null
  onAddRecord: (desireId: number) => void
}

export function DesireTable({
  view,
  todayItems,
  allItems,
  loading,
  addingRecordId,
  onAddRecord,
}: DesireTableProps) {
  if (loading) {
    return <p className="status">Loading…</p>
  }

  const isToday = view === 'today'
  const rows = isToday ? todayItems : allItems

  if (rows.length === 0) {
    return (
      <p className="status empty">
        {isToday
          ? 'No desires recorded today yet.'
          : 'No desires yet. Add one with the + button.'}
      </p>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Tags</th>
            {isToday && <th>Today&apos;s records</th>}
            <th className="actions-col">Record</th>
          </tr>
        </thead>
        <tbody>
          {isToday
            ? todayItems.map((desire) => (
                <tr key={desire.id}>
                  <td>{desire.name}</td>
                  <td>
                    <div className="tags">
                      {desire.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="records">
                      {desire.records.length === 0 ? (
                        <span className="muted">—</span>
                      ) : (
                        desire.records.map((record) => (
                          <span key={record.id} className="record-time">
                            {formatTime(record.happenedAt)}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="actions-col">
                    <button
                      type="button"
                      className="icon-btn"
                      title="Add record"
                      aria-label={`Add record for ${desire.name}`}
                      disabled={addingRecordId === desire.id}
                      onClick={() => onAddRecord(desire.id)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))
            : allItems.map((desire) => (
                <tr key={desire.id}>
                  <td>{desire.name}</td>
                  <td>
                    <div className="tags">
                      {desire.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="actions-col">
                    <button
                      type="button"
                      className="icon-btn"
                      title="Add record"
                      aria-label={`Add record for ${desire.name}`}
                      disabled={addingRecordId === desire.id}
                      onClick={() => onAddRecord(desire.id)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
