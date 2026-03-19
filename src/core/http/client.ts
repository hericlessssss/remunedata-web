import axios from 'axios'
import { ENV } from '@/core/config/env'

const httpClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptadores para futura autenticação e logs em dev
httpClient.interceptors.request.use((config) => {
  if (ENV.IS_DEV) {
    // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento global de erros pode ser expandido aqui conforme Fase 8 do Plano Formal
    return Promise.reject(error)
  },
)

export default httpClient
