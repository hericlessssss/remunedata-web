import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { ENV } from '@/core/config/env'

const baseURL = ENV.API_URL.endsWith('/') ? ENV.API_URL : `${ENV.API_URL}/`

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptadores para logs em dev ou futura auth
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config
})

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Tratamento global de erros pode ser expandido aqui conforme Fase 8 do Plano Formal
    return Promise.reject(error)
  },
)

export default httpClient
