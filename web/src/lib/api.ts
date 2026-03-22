const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3333'

export type Link = {
  id: string
  originalUrl: string
  shortCode: string
  accessCount: number
  createdAt: string
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Erro ${res.status}`)
  }
  // 204 não tem body
  if (res.status === 204) return null as T
  return res.json()
}

export const api = {
  links: {
    create(data: { originalUrl: string; shortCode: string }) {
      return fetch(`${BASE_URL}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => handleResponse<Link>(r))
    },

    list() {
      return fetch(`${BASE_URL}/links`).then((r) => handleResponse<Link[]>(r))
    },

    getByShortCode(shortCode: string) {
      return fetch(`${BASE_URL}/links/${shortCode}`).then((r) =>
        handleResponse<Link>(r)
      )
    },

    incrementAccess(shortCode: string) {
      return fetch(`${BASE_URL}/links/${shortCode}/access`, {
        method: 'PATCH',
      }).then((r) => handleResponse<null>(r))
    },

    delete(shortCode: string) {
      return fetch(`${BASE_URL}/links/${shortCode}`, {
        method: 'DELETE',
      }).then((r) => handleResponse<null>(r))
    },

    export() {
      return fetch(`${BASE_URL}/links/export`).then((r) =>
        handleResponse<{ url: string }>(r)
      )
    },
  },
}
