const API_URL = 'https://api.ch-sof2.online'

export const api = {
  getToken: () => localStorage.getItem('ch_auth_token'),
  setToken: (token: string) => localStorage.setItem('ch_auth_token', token),
  clearToken: () => localStorage.removeItem('ch_auth_token'),
  
  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
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

    return response
  },

  get: (endpoint: string) => api.request(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, body: any) => api.request(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(body) 
  }),
  
  put: (endpoint: string, body?: any) => api.request(endpoint, { 
    method: 'PUT',
    ...(body ? { body: JSON.stringify(body) } : {})
  }),
  
  delete: (endpoint: string) => api.request(endpoint, { method: 'DELETE' }),
}
