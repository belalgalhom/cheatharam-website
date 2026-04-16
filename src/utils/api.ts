const API_URL = 'https://api.ch-sof2.online'

export const api = {
  getToken: () => localStorage.getItem('ch_auth_token'),
  setToken: (token: string) => localStorage.setItem('ch_auth_token', token),
  clearToken: () => localStorage.removeItem('ch_auth_token'),

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()
    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    }

    if (options.body && options.body instanceof FormData) {
      // Browser automatically sets Content-Type with boundary for FormData
    } else if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      this.clearToken()
    }

    // Intercept json() to unwrap standardized responses { status: 'success', data: ... }
    const originalJson = response.json.bind(response)
    response.json = async () => {
      const data = await originalJson()
      if (data && typeof data === 'object' && data.status === 'success' && 'data' in data) {
        return data.data
      }
      return data
    }

    return response
  },

  get: (endpoint: string) => api.request(endpoint, { method: 'GET' }),

  post: (endpoint: string, body: any) =>
    api.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint: string, body?: any) =>
    api.request(endpoint, {
      method: 'PUT',
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),

  delete: (endpoint: string) => api.request(endpoint, { method: 'DELETE' }),
}
