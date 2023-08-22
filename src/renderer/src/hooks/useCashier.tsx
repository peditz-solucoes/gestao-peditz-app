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
  wsConnected: boolean
}

export const CashierContext = createContext({} as CashierContextData)

export function CashierProvider({ children }: CashierProviderProps): JSX.Element {
  const [openCashierModal, setOpenCashierModal] = useState<boolean>(false)
  const [cashier, setCashier] = useState<Cashier>({} as Cashier)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [wsConnected, setWsConnected] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Payments[]>([])

  async function connectSocket() {
    const connectedWs = localStorage.getItem('connectedWs')
    getCashier(true).then((response) => {
      const socket = new WebSocket(`wss://api.peditz.com/ws/pedidos/${cashier?.restaurant?.id}/`)
      socket.onopen = () => {
        console.log('Conectado ao WebSocket')
      }

      socket.onmessage = (event) => {
        const order = JSON.parse(event.data)
        console.log('order', order.message)
        if (connectedWs === 'CONNECTED') {
          Order(...order.message)
        }

        console.log('Mensagem recebida:', event.data)
      }

      socket.onerror = (error) => {
        console.log('Erro no WebSocket:', error)
        setWsConnected(false)
      }

      socket.onclose = () => {
        console.log('Conexão WebSocket fechada')
        setWsConnected(false)
      }

      return () => socket.close()
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
        wsConnected
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
