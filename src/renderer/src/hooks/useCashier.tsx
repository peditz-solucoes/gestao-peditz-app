import api from '@renderer/services/api'
import { Cashier, Payments } from '@renderer/types'
import { Order } from '@renderer/utils/Printers'
import { errorActions } from '@renderer/utils/errorActions'
import { AxiosError } from 'axios'

import { createContext, useContext, useState } from 'react'

interface CashierProviderProps {
  children: React.ReactNode
}

interface CashierContextData {
  cashier: Cashier
  getCashier: (open: boolean) => Promise<Cashier>
  isLoading: boolean
  transactions: Payments[]
  openCashierModal: boolean
  setOpenCashierModal: React.Dispatch<React.SetStateAction<boolean>>
  connectSocket: () => void
  handleConnectionWs: (value: boolean) => void
  wsConnected: boolean
  loadingConnectSocket: boolean
}

export const CashierContext = createContext({} as CashierContextData)

export function CashierProvider({ children }: CashierProviderProps): JSX.Element {
  const [openCashierModal, setOpenCashierModal] = useState<boolean>(false)
  const [cashier, setCashier] = useState<Cashier>({} as Cashier)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [wsConnected, setWsConnected] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Payments[]>([])
  const [socket, setSocket] = useState<WebSocket>()
  const [loadingConnectSocket, setLoadingConnectSocket] = useState<boolean>(false)

  function handleConnectionWs(value:boolean = false){
    setWsConnected(value)
    if(value){
      connectSocket()
    }
    if(!value){
      localStorage.setItem('connectedWs', 'DISCONNECTED')
      window.location.reload()
    }
  }

  async function connectSocket() {
    setLoadingConnectSocket(true)
    api.get('/restaurant/')
    .then((response) => {
      if(!socket){
         const newSocket = new WebSocket(`wss://api.peditz.com/ws/pedidos/${response.data[0].id}/`)
      
          newSocket.onopen = () => {
            console.log('Conectado ao WebSocket')
            localStorage.setItem('connectedWs', 'CONNECTED')
            setLoadingConnectSocket(false)
            setSocket(socket)
            setWsConnected(true)
          }

          
          
          newSocket.onmessage = (event) => {
            const eventParse = JSON.parse(event.data)
            console.log('event', eventParse)  
            const order = JSON.parse(eventParse?.order)
            console.log(order)
              if(order){
                Order(
                  order.restaurant.title,
                  order.bill?.table?.title || '',
                  String(order.bill?.number) || '',
                  order.order_items,
                  order?.collaborator_name || '',
                  order?.created || ''
                )
              }
            

            console.log('Mensagem recebida:', event.data)
          }

          newSocket.onerror = (error) => {
            console.log('Erro no WebSocket:', error)
            localStorage.setItem('connectedWs', 'DISCONNECTED')
            setWsConnected(false)
          }

          newSocket.onclose = () => {
            console.log('Conexão WebSocket fechada')
            localStorage.setItem('connectedWs', 'DISCONNECTED')
            setWsConnected(false)
          }

          return () => newSocket.close()
        }
    })
  }

  function getCashier(open: boolean): Promise<Cashier> {
    return new Promise((resolve, reject) => {
      api
        .get(`/cashier/?open=${open}`)
        .then((response) => {
          localStorage.setItem('cashier', JSON.stringify(response.data[0]))
          setCashier(response.data[0])
          if (response.data[0]?.id) {
            getTransactions(response.data[0]?.id)
          }
          resolve(response.data[0])
        })
        .catch((error: AxiosError) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  function getTransactions(cashierId: string) {
    setIsLoading(true)
    api
      .get(`/list-payment/?cashier=${cashierId}`)
      .then((response) => {
        setTransactions(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <CashierContext.Provider
      value={{
        cashier,
        getCashier,
        transactions,
        isLoading,
        openCashierModal,
        setOpenCashierModal,
        connectSocket,
        handleConnectionWs,
        wsConnected,
        loadingConnectSocket
      }}
    >
      {children}
    </CashierContext.Provider>
  )
}

export function useCashier(): CashierContextData {
  const context = useContext(CashierContext)
  return context
}
