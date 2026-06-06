export interface NecessityRecord {
  id: number
  necessityId: number
  happenedAt: string
}

export interface Necessity {
  id: number
  name: string
  tags: string[]
}

export interface NecessityToday extends Necessity {
  records: NecessityRecord[]
}

export interface PagedNecessities {
  count: number
  page: number
  items: Necessity[]
}

export interface CreateNecessityRequest {
  name: string
  tags?: string[]
}
