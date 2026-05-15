import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config)
}

export default apiClient
