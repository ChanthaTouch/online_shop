import { mockUsers } from './mockData'

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

// Helper to generate mock token
function generateMockToken(): string {
  return 'mock_token_' + Math.random().toString(36).substring(2, 15)
}

// Simulate network delay
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500) // Simulate network delay

    // Mock login validation
    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      throw {
        response: {
          status: 401,
          data: { error: 'Invalid email or password' }
        }
      }
    }

    // For mock purposes, accept any password
    return {
      token: generateMockToken(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  },

  async register(name: string, email: string, password: string, role: string = 'customer', adminKey?: string): Promise<AuthResponse> {
    await delay(500) // Simulate network delay

    // Validate admin key if registering as admin
    if (role === 'admin' && adminKey !== 'ADMIN123') {
      throw {
        response: {
          status: 401,
          data: { error: 'Invalid admin key' }
        }
      }
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      throw {
        response: {
          status: 422,
          data: { error: 'Email already registered' }
        }
      }
    }

    // Create new mock user
    const newUser: User = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      name,
      email,
      role: role as 'customer' | 'admin'
    }

    // In a real app, this would be persisted
    // For mock, we'll just add to memory (will reset on refresh)
    mockUsers.push(newUser)

    return {
      token: generateMockToken(),
      user: newUser
    }
  },

  async logout(): Promise<void> {
    await delay(200)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
  },

  async getMe(): Promise<User> {
    await delay(200)
    const userId = localStorage.getItem('userId')
    if (!userId) {
      throw {
        response: {
          status: 401,
          data: { error: 'Not authenticated' }
        }
      }
    }

    const user = mockUsers.find(u => u.id === parseInt(userId))
    if (!user) {
      throw {
        response: {
          status: 401,
          data: { error: 'User not found' }
        }
      }
    }

    return user
  },

  storeAuth(data: AuthResponse): void {
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.user.id.toString())
    localStorage.setItem('userName', data.user.name)
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
  }
}
