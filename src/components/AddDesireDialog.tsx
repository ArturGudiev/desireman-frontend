import { useState, type FormEvent } from 'react'

interface AddDesireDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string, tags: string[]) => Promise<void>
}

export function AddDesireDialog({ open, onClose, onSubmit }: AddDesireDialogProps) {
  const [name, setName] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) {
    return null
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Name is required')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(trimmedName, tags)
      setName('')
      setTagsInput('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add desire')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-labelledby="add-desire-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-desire-title">Add desire</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="What do you desire?"
              autoFocus
            />
          </label>
          <label>
            Tags
            <input
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="food, health, fun (comma-separated)"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="dialog-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
