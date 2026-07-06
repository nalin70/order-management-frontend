import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || ''

function buildApiUrl(path) {
  return `${apiBaseUrl.replace(/\/$/, '')}${path}`
}

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

const authRefreshSkipPaths = ['/api/auth/login/', '/api/auth/register/', '/api/auth/token/refresh/']

function shouldSkipRefresh(url = '') {
  return authRefreshSkipPaths.some((path) => String(url).includes(path))
}

function getAccessToken(data) {
  const payload = data?.data || data || {}
  return payload.access
    || payload.access_token
    || payload.tokens?.access
    || payload.tokens?.access_token
    || payload.token?.access
    || payload.token?.access_token
    || (typeof payload.token === 'string' ? payload.token : null)
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest?._retry && !shouldSkipRefresh(originalRequest?.url)) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')

        if (!refreshToken) {
          throw new Error('Missing refresh token')
        }

        const { data } = await axios.post(buildApiUrl('/api/auth/token/refresh/'), {
          refresh: refreshToken,
        })

        const access = getAccessToken(data)

        if (!access) {
          throw new Error('Refresh response did not include an access token')
        }

        localStorage.setItem('access_token', access)
        api.defaults.headers.common.Authorization = `Bearer ${access}`
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
