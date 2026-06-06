interface ViewSwitchOption<T extends string> {
  value: T
  label: string
}

interface ViewSwitchProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: ViewSwitchOption<T>[]
  ariaLabel: string
}

export function ViewSwitch<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: ViewSwitchProps<T>) {
  return (
    <div className="view-switch" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={value === option.value ? 'active' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export type TimeView = 'today' | 'all'
export type KindView = 'desires' | 'necessities'

export const TIME_VIEW_OPTIONS: ViewSwitchOption<TimeView>[] = [
  { value: 'today', label: 'Today' },
  { value: 'all', label: 'All' },
]

export const KIND_VIEW_OPTIONS: ViewSwitchOption<KindView>[] = [
  { value: 'desires', label: 'Desires' },
  { value: 'necessities', label: 'Necessities' },
]
