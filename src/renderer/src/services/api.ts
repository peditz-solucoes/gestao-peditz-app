import axios, { AxiosRequestHeaders } from 'axios'
import { getToken } from './auth'

const api = axios.create({
  // baseURL: 'https://api-peditz-gestao.up.railway.app/api/v1/',
  baseURL: 'http://localhost:8000/api/v1/',
  // baseURL: 'https://api-hml.peditz.com/api/v1/',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

api.interceptors.request.use(async (config) => {
  const token = getToken()

  if (token) {
    if (!config) {
      config = {
        headers: {} as AxiosRequestHeaders
      }
    }
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders
    }
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
