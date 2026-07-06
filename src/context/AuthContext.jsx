import { createContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

export const AuthContext = createContext(null)

function unwrapPayload(data) {
  return data?.data || data || {}
}

function normalizeRole(role) {
  return String(role ?? '').trim().toUpperCase()
}

function getAccessToken(payload) {
  return payload.access
    || payload.access_token
    || payload.tokens?.access
    || payload.tokens?.access_token
    || payload.token?.access
    || payload.token?.access_token
    || payload.auth?.access
    || payload.auth?.access_token
    || (typeof payload.token === 'string' ? payload.token : null)
}

function getRefreshToken(payload) {
  return payload.refresh
    || payload.refresh_token
    || payload.tokens?.refresh
    || payload.tokens?.refresh_token
    || payload.token?.refresh
    || payload.token?.refresh_token
    || payload.auth?.refresh
    || payload.auth?.refresh_token
}

function buildUser(payload, fallbackEmail = '') {
  const rawUser = payload.user || payload.profile || payload.account || payload.customer || payload.admin || payload
  const email = rawUser.email || payload.email || payload.user_email || fallbackEmail

  return {
    ...rawUser,
    email,
    username: rawUser.username || rawUser.email || email,
    role: normalizeRole(rawUser.role || payload.role || rawUser.user_type || payload.user_type || rawUser.type || payload.type),
  }
}

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
        const nextUser = buildUser(unwrapPayload(data), user?.email)
        setUser(nextUser)
        localStorage.setItem('user', JSON.stringify(nextUser))
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    initialiseAuth()
  }, [])

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials)
    const payload = unwrapPayload(response?.data)
    const access = getAccessToken(payload)
    const refresh = getRefreshToken(payload)

    if (!access) {
      throw new Error('Login response did not include an access token.')
    }

    const nextUser = buildUser(payload, credentials.email)

    localStorage.setItem('access_token', access)
    if (refresh) localStorage.setItem('refresh_token', refresh)
    else localStorage.removeItem('refresh_token')
    localStorage.setItem('user', JSON.stringify(nextUser))

    setAccessToken(access)
    setRefreshToken(refresh || null)
    setUser(nextUser)

    return nextUser
  }

  const register = async (credentials) => {
    const response = await api.post('/api/auth/register/', credentials)
    const payload = unwrapPayload(response?.data)
    const nextUser = buildUser(payload, credentials.email)

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.setItem('user', JSON.stringify(nextUser))

    setAccessToken(null)
    setRefreshToken(null)
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
    isAdmin: normalizeRole(user?.role) === 'ADMIN',
  }), [accessToken, loading, refreshToken, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
