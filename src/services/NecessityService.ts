import type {
  CreateNecessityRequest,
  Necessity,
  NecessityRecord,
  NecessityToday,
  PagedNecessities,
} from '../models/necessity.types'

const API_BASE = '/api/necessities'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(message || `Request failed (${response.status})`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export class NecessityService {
  private static instance: NecessityService | null = null

  static getInstance(): NecessityService {
    if (!NecessityService.instance) {
      NecessityService.instance = new NecessityService()
    }
    return NecessityService.instance
  }

  static resetInstance(): void {
    NecessityService.instance = null
  }

  listNecessitiesToday(): Promise<NecessityToday[]> {
    return request<NecessityToday[]>(`${API_BASE}/today`)
  }

  listNecessities(pageNumber = 1, pageSize = 100): Promise<PagedNecessities> {
    const params = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    })
    return request<PagedNecessities>(`${API_BASE}?${params}`)
  }

  addNecessity(body: CreateNecessityRequest): Promise<Necessity> {
    return request<Necessity>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  addRecord(necessityId: number): Promise<NecessityRecord> {
    return request<NecessityRecord>(`${API_BASE}/${necessityId}/records`, {
      method: 'POST',
    })
  }
}
