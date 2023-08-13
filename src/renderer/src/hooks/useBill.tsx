import { ReactNode, createContext, useContext, useState } from 'react'
import { Bill, OrderGroupList } from '../types'
import api from '../services/api'
import { AxiosError, AxiosResponse } from 'axios'
import { errorActions } from '../utils/errorActions'

interface BillProviderProps {
  children: ReactNode
}

interface BillContextData {
  bills: Bill[]
  selectedBill: Bill
  fetchBills: () => void
  fetchBill: (id: string) => void
  ordersGroupList: OrderGroupList[]
  fetchOrders: (billId: string) => void
  handleDeleteOrder: (id: string, operatorCode: string, billId: string) => void
  selectedBills: Bill[]
  addBill: (id: string, reset?: boolean) => void
  getOrdersBills: (billId: string, reset?: boolean) => void
}

export const BillContext = createContext({} as BillContextData)

export function BillProvider({ children }: BillProviderProps): JSX.Element {
  const [bills, setBills] = useState<Bill[]>([] as Bill[])
  const [selectedBill, setSelectedBill] = useState<Bill>({} as Bill)
  const [selectedBills, setSelectedBills] = useState<Bill[]>([] as Bill[])
  const [orders, setOrders] = useState<OrderGroupList[]>([] as OrderGroupList[])

  function fetchBills(): void {
    api
      .get('/bill/')
      .then((response: AxiosResponse) => {
        setBills(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        // console.log('finally');
      })
  }

  function fetchBill(id: string): void {
    api
      .get(`/bill/${id}/`)
      .then((response: AxiosResponse) => {
        setSelectedBill(response.data)
        fetchOrders(response.data.id)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {})
  }

  function fetchOrders(billId: string): void {
    api
      .get(`/order-list/?bill=${billId}`)
      .then((response: AxiosResponse) => {
        setOrders(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        // console.log('finally');
      })
  }

  function handleDeleteOrder(id: string, operatorCode: string, billId: string): void {
    api
      .post(`/order-delete/`, {
        operator_code: operatorCode,
        order_id: id
      })
      .then(() => {
        let newOrders = orders
        setOrders([])
        setTimeout(() => {
          newOrders = newOrders.filter((order) => order.id !== id)
          setOrders([...newOrders])
        }, 300)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        // console.log('finally');
      })
  }

  function getOrdersBills(billId: string, reset?: boolean): void {
    api
      .get(`/order-list/?bill=${billId}`)
      .then((response: AxiosResponse) => {
        if (reset) {
          setOrders([...response.data])
        } else {
          setOrders([...orders, ...response.data])
        }
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  function addBill(id: string, reset?: boolean): void {
    api
      .get(`/bill/${id}/`)
      .then((response: AxiosResponse) => {
        if (reset) {
          setSelectedBills([response.data])
        } else {
          setSelectedBills([...selectedBills, response.data])
        }
        getOrdersBills(response.data.id, reset)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  return (
    <BillContext.Provider
      value={{
        bills,
        selectedBill,
        fetchBills,
        fetchBill,
        ordersGroupList: orders,
        fetchOrders,
        handleDeleteOrder,
        selectedBills,
        addBill,
        getOrdersBills
      }}
    >
      {children}
    </BillContext.Provider>
  )
}

export function useBill(): BillContextData {
  const context = useContext(BillContext)
  return context
}
