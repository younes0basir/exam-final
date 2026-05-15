import { useState, useEffect } from 'react'

interface AuthState {
  user: unknown | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setAuth({
        user: JSON.parse(user),
        isAuthenticated: true,
        isLoading: false
      })
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = (token: string, user: unknown) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({
      user,
      isAuthenticated: true,
      isLoading: false
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  return { ...auth, login, logout }
}
