import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { ENV } from '@/core/config/env'
import { useAuthStore } from '@/core/auth/authStore'

const baseURL = ENV.API_URL.endsWith('/') ? ENV.API_URL : `${ENV.API_URL}/`

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptadores para injetar o token JWT do Supabase
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore()
  const token = authStore.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Tratamento de 401 (Não Autorizado)
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.signOut()
    }

    // Tratamento de 403 (Assinatura Necessária)
    if (error.response?.status === 403) {
      if (!window.location.pathname.includes('/subscriptions/plans')) {
        window.location.href = '/subscriptions/plans?redirect=forbidden'
      }
    }

    return Promise.reject(error)
  },
)

export default httpClient
