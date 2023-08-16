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
  fetchBills: (open?: boolean) => void
  fetchBill: (id: string) => void
  orders: OrderGroupList[]
  setOrders: React.Dispatch<React.SetStateAction<OrderGroupList[]>>
  fetchOrders: (billId: string) => void
  selectedBills: Bill[]
  setSelectedBills: React.Dispatch<React.SetStateAction<Bill[]>>
  addBill: (id: string, reset?: boolean) => void
  getOrdersBills: (billId: string, reset?: boolean) => void
  showModalPayment: boolean
  setShowModalPayment: (show: boolean) => void
  addPayment: (paymentId: string) => void
  selectedPayment: string
  OnCloseModalPayment: () => void
  payments: Payments[]
  setPayments: React.Dispatch<React.SetStateAction<Payments[]>>
  DeletePayment: (id: string) => void
}

interface Payments {
  id: string
  value: number
  title: string
}

export const BillContext = createContext({} as BillContextData)

export function BillProvider({ children }: BillProviderProps): JSX.Element {
  const [bills, setBills] = useState<Bill[]>([] as Bill[])
  const [selectedBill, setSelectedBill] = useState<Bill>({} as Bill)
  const [selectedBills, setSelectedBills] = useState<Bill[]>([] as Bill[])
  const [orders, setOrders] = useState<OrderGroupList[]>([] as OrderGroupList[])
  const [showModalPayment, setShowModalPayment] = useState<boolean>(false)
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [payments, setPayments] = useState<Payments[]>([])

  function fetchBills(open?: boolean): void {
    api
      .get(`/bill/?open=${open}`)
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

  function addPayment(paymentId: string): void {
    setSelectedPayment(paymentId)
    setShowModalPayment(true)
  }

  function OnCloseModalPayment(): void {
    setShowModalPayment(false)
    setSelectedPayment('')
  }

  function DeletePayment(id: string): void {
    setPayments((old) => old.filter((payment) => payment.id !== id))
  }

  return (
    <BillContext.Provider
      value={{
        bills,
        selectedBill,
        fetchBills,
        fetchBill,
        orders,
        fetchOrders,
        selectedBills,
        addBill,
        getOrdersBills,
        showModalPayment,
        setShowModalPayment,
        addPayment,
        selectedPayment,
        OnCloseModalPayment,
        payments,
        setPayments,
        DeletePayment,
        setOrders,
        setSelectedBills
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
