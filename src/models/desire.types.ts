export interface DesireRecord {
  id: number
  desireId: number
  happenedAt: string
}

export interface Desire {
  id: number
  name: string
  tags: string[]
}

export interface DesireToday extends Desire {
  records: DesireRecord[]
}

export interface PagedDesires {
  count: number
  page: number
  items: Desire[]
}

export interface CreateDesireRequest {
  name: string
  tags?: string[]
}
