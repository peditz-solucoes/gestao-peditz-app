import { AxiosError } from 'axios'
import { setLogout } from '../services/auth'

export function errorActions(error: AxiosError): void {
  if (error.response?.status === 401) {
    setLogout()
    window.location.reload()
  }
}
