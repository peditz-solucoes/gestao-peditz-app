import api from '@renderer/services/api'
import { Cashier, Payments } from '@renderer/types'
import { errorActions } from '@renderer/utils/errorActions'
import { AxiosError } from 'axios'

import { createContext, useContext, useState } from 'react'

interface CashierProviderProps {
  children: React.ReactNode
}

interface CashierContextData {
  cashier: Cashier
  fetchCashier: (open: boolean) => Promise<Cashier>
  isLoading: boolean
  transactions: Payments[]
  openCashierModal: boolean
  setOpenCashierModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const CashierContext = createContext({} as CashierContextData)

export function CashierProvider({ children }: CashierProviderProps): JSX.Element {
  const [openCashierModal, setOpenCashierModal] = useState<boolean>(false)
  const [cashier, setCashier] = useState<Cashier>({} as Cashier)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Payments[]>([])

  function fetchCashier(open: boolean): Promise<Cashier> {
    return new Promise((resolve, reject) => {
      api
        .get(`/cashier/?open=${open}`)
        .then((response) => {
          localStorage.setItem('cashier', JSON.stringify(response.data[0]))
          setCashier(response.data[0])
          if (response.data[0]?.id) {
            fetchTransactions(response.data[0]?.id)
          }
          resolve(response.data[0])
        })
        .catch((error: AxiosError) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  function fetchTransactions(cashierId: string) {
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
        fetchCashier,
        transactions,
        isLoading,
        openCashierModal,
        setOpenCashierModal
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
