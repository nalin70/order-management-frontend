import { createContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token'))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialiseAuth = async () => {
      if (!accessToken) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/api/auth/profile/')
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      } catch (error) {
        logout()
      } finally {
        setLoading(false)
      }
    }

    initialiseAuth()
  }, [])

  const login = async (credentials) => {
    const { data } = await api.post('/api/auth/login/', credentials)
    const nextUser = data.user || data.profile || null

    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user', JSON.stringify(nextUser))

    setAccessToken(data.access)
    setRefreshToken(data.refresh)
    setUser(nextUser)
  }

  const register = async (credentials) => {
    const { data } = await api.post('/api/auth/register/', credentials)
    const nextUser = data.user || data.profile || null

    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('user', JSON.stringify(nextUser))

    setAccessToken(data.access)
    setRefreshToken(data.refresh)
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(accessToken),
    isAdmin: user?.role === 'ADMIN',
  }), [accessToken, loading, refreshToken, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
