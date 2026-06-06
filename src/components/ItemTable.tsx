interface ItemRecord {
  id: number
  happenedAt: string
}

interface Item {
  id: number
  name: string
  tags: string[]
}

interface ItemToday extends Item {
  records: ItemRecord[]
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface ItemTableProps {
  kind: 'desires' | 'necessities'
  view: 'today' | 'all'
  todayItems: ItemToday[]
  allItems: Item[]
  loading: boolean
  addingRecordId: number | null
  onAddRecord: (id: number) => void
}

export function ItemTable({
  kind,
  view,
  todayItems,
  allItems,
  loading,
  addingRecordId,
  onAddRecord,
}: ItemTableProps) {
  const label = kind === 'desires' ? 'desire' : 'necessity'

  if (loading) {
    return <p className="status">Loading…</p>
  }

  const isToday = view === 'today'
  const rows = isToday ? todayItems : allItems

  if (rows.length === 0) {
    return (
      <p className="status empty">
        {isToday
          ? `No ${label}s recorded today yet.`
          : `No ${label}s yet. Add one with the + button.`}
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
            ? todayItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <div className="tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="records">
                      {item.records.length === 0 ? (
                        <span className="muted">—</span>
                      ) : (
                        item.records.map((record) => (
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
                      aria-label={`Add record for ${item.name}`}
                      disabled={addingRecordId === item.id}
                      onClick={() => onAddRecord(item.id)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))
            : allItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <div className="tags">
                      {item.tags.map((tag) => (
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
                      aria-label={`Add record for ${item.name}`}
                      disabled={addingRecordId === item.id}
                      onClick={() => onAddRecord(item.id)}
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
