import { ReactNode, createContext, useContext, useState } from 'react'
import { Bill } from '../types'
import api from '../services/api'
import { AxiosError, AxiosResponse } from 'axios'
import { errorActions } from '../utils/errorActions'

interface TerminalProviderProps {
  children: ReactNode
}

interface TerminalContextData {
  bills: Bill[]
  selectedBill: Bill
  fetchBills: () => Promise<unknown>
  fetchBill: (id: string) => Promise<unknown>
  currentTab: string
  setCurrentTab: (tab: string) => void
  loadingSelectedBill: boolean
  cart: CartData[]
  setCart: (data: CartData[]) => void
}

interface CartData {
  product_id: string
  quantity: number
  product_title: string
  notes: string
  complements: {
    complement_id: string
    complement_title: string
    items: {
      item_id: string
      item_title: string
      quantity: number
    }[]
  }[]
}

export const TerminalContext = createContext({} as TerminalContextData)

export function TerminalProvider({ children }: TerminalProviderProps): JSX.Element {
  const [bills, setBills] = useState<Bill[]>([] as Bill[])
  const [selectedBill, setSelectedBill] = useState<Bill>({} as Bill)
  const [currentTab, setCurrentTab] = useState<string>('1')
  const [cart, setCart] = useState<CartData[]>([])
  const [loadingSelectedBill, setLoadingSelectedBill] = useState<boolean>(false)
  function fetchBills(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setCart([])
      api
        .get('/bill/?open=true')
        .then((response: AxiosResponse) => {
          setBills(response.data)
          resolve(response.data)
        })
        .catch((error: AxiosError) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  function fetchBill(id: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      setLoadingSelectedBill(true)
      api
        .get(`/bill/${id}/`)
        .then((response: AxiosResponse) => {
          setSelectedBill(response.data)
          resolve(response.data)
        })
        .catch((error: AxiosError) => {
          errorActions(error)
          reject(error)
        })
        .finally(() => {
          setLoadingSelectedBill(false)
        })
    })
  }

  return (
    <TerminalContext.Provider
      value={{
        bills,
        selectedBill,
        fetchBills,
        fetchBill,
        currentTab,
        setCurrentTab,
        loadingSelectedBill,
        cart,
        setCart
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}

export function useTerminal(): TerminalContextData {
  const context = useContext(TerminalContext)
  return context
}
