export type DesireView = 'today' | 'all'

interface ViewSwitchProps {
  value: DesireView
  onChange: (view: DesireView) => void
}

export function ViewSwitch({ value, onChange }: ViewSwitchProps) {
  return (
    <div className="view-switch" role="tablist" aria-label="Desire view">
      <button
        type="button"
        role="tab"
        aria-selected={value === 'today'}
        className={value === 'today' ? 'active' : ''}
        onClick={() => onChange('today')}
      >
        Today
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'all'}
        className={value === 'all' ? 'active' : ''}
        onClick={() => onChange('all')}
      >
        All
      </button>
    </div>
  )
}
