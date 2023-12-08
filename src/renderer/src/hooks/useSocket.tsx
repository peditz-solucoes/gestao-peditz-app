import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import api from '../services/api'
import { AxiosError, AxiosResponse } from 'axios'
import { Order } from '@renderer/utils/Printers'

interface SocketProviderProps {
  children: ReactNode
}

interface SocketContextData {
  handleConnectionWs: (value: boolean) => void
  loadingConnectSocket: boolean
  isConnected: boolean
}

export const SocketContext = createContext({} as SocketContextData)
import audioa from '../assets/audio.mp3'

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [loadingConnectSocket, setLoadingConnectSocket] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const hasUpdated = useRef<boolean>(false)

  function handleConnectionWs(value = false): void {
    if (value) {
      connectSocket()
    }
    if (!value) {
      localStorage.setItem('connectedWs', 'DISCONNECTED')
      window.location.reload()
    }
  }
  function makeConnection(): void {
    setIsConnected(true)
    localStorage.setItem('connectedWs', 'CONNECTED')
  }
  function closeConnection(): void {
    setIsConnected(false)
    localStorage.setItem('connectedWs', 'DISCONNECTED')
  }

  async function connectSocket(): Promise<void> {
    setLoadingConnectSocket(true)
    api
      .get('/restaurant/')
      .then((response: AxiosResponse) => {
        if (!socket) {
          const newSocket = new WebSocket(
            `wss://api-peditz-gestao.up.railway.app/ws/pedidos/${response.data[0].id}/`
          )

          newSocket.onopen = (): void => {
            console.log('Conectado ao WebSocket')
            makeConnection()
            setLoadingConnectSocket(false)
            setSocket(socket)
          }

          newSocket.onmessage = (event): void => {
            const eventParse = JSON.parse(event.data)
            const order = JSON.parse(eventParse?.order)
            const delivery = JSON.parse(eventParse?.delivery)
            if (order) {
              Order(
                order.restaurant.title,
                order.bill?.table?.title || '',
                String(order.bill?.number) || '',
                order.order_items,
                order?.collaborator_name || '',
                order?.created || ''
              )
            }
            if (delivery) {
              const audio = new Audio(audioa)
              audio.play()
            }
          }

          newSocket.onerror = (error): void => {
            console.log('Erro no WebSocket:', error)
            closeConnection()
            setSocket(null)
            setLoadingConnectSocket(false)
          }

          newSocket.onclose = (): void => {
            console.log('Conexão WebSocket fechada')
            closeConnection()
            setSocket(null)
            setLoadingConnectSocket(false)
          }

          // return () => newSocket.close()
        }
      })
      .catch((err: AxiosError) => console.log(err.response?.data))
  }

  useEffect(() => {
    if (!hasUpdated.current) {
      hasUpdated.current = true
      if (localStorage.getItem('connectedWs') === 'CONNECTED') {
        connectSocket()
      }
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        handleConnectionWs,
        loadingConnectSocket,
        isConnected
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket(): SocketContextData {
  const context = useContext(SocketContext)
  return context
}
