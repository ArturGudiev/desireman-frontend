import type {
  CreateDesireRequest,
  Desire,
  DesireRecord,
  DesireToday,
  PagedDesires,
} from '../models/desire.types'

const API_BASE = '/api/desires'

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

/**
 * Angular-style injectable service: singleton with business methods mirroring the backend.
 */
export class DesireService {
  private static instance: DesireService | null = null

  static getInstance(): DesireService {
    if (!DesireService.instance) {
      DesireService.instance = new DesireService()
    }
    return DesireService.instance
  }

  /** Reset singleton — useful in tests. */
  static resetInstance(): void {
    DesireService.instance = null
  }

  listDesiresToday(): Promise<DesireToday[]> {
    return request<DesireToday[]>(`${API_BASE}/today`)
  }

  listDesires(pageNumber = 1, pageSize = 100): Promise<PagedDesires> {
    const params = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    })
    return request<PagedDesires>(`${API_BASE}?${params}`)
  }

  addDesire(body: CreateDesireRequest): Promise<Desire> {
    return request<Desire>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  addRecord(desireId: number): Promise<DesireRecord> {
    return request<DesireRecord>(`${API_BASE}/${desireId}/records`, {
      method: 'POST',
    })
  }
}
