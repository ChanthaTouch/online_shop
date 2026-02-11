import api from './api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: string = 'customer',
    adminKey?: string
  ): Promise<AuthResponse> {
    const payload: any = { name, email, password, role }
    if (role === 'admin' && adminKey) {
      payload.admin_key = adminKey
    }
    const response = await api.post('/register', payload)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userRole')
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get('/me')
    return response.data.user || response.data
  },

  storeAuth(data: AuthResponse): void {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.user.id.toString())
    localStorage.setItem('userName', data.user.name)
    localStorage.setItem('userEmail', data.user.email)
    localStorage.setItem('userRole', data.user.role)
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin'
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getUserRole(): string {
    return localStorage.getItem('userRole') || 'customer'
  },
}