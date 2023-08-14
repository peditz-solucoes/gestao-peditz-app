import api from '@renderer/services/api'
import { Printer } from '@renderer/types'
import { TestPrint } from '@renderer/utils/Printers'
import { errorActions } from '@renderer/utils/errorActions'
import { Form, FormInstance } from 'antd'
import { AxiosError } from 'axios'
import { ReactNode, createContext, useContext, useState } from 'react'

interface PrinterProviderProps {
  children: ReactNode
}

interface PrinterContextData {
  currentTab: string
  isLoading: boolean
  setCurrentTab: (tab: '1' | '2') => void
  showModal: boolean
  setShowModal: (show: boolean) => void
  OnCancelShowModal: () => void
  printers: Printer[]
  fetchPrinters: () => void
  deletePrinter: (id: number) => void
  fetchPrinter: () => void
  selectedPrinter: Printer | undefined
  printerId: number | undefined
  setPrinterId: (id: number) => void
  form: FormInstance<any>
  switchValue: boolean
  setSwitchValue: (value: boolean) => void
  createPrinter: () => void
  updatePrinter: () => void
}

export const PrinterContext = createContext<PrinterContextData>({} as PrinterContextData)

export function PrinterProvider({ children }: PrinterProviderProps) {
  const [currentTab, setCurrentTab] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [printers, setPrinters] = useState<Printer[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | undefined>(undefined)
  const [printerId, setPrinterId] = useState<number | undefined>(undefined)
  const [switchValue, setSwitchValue] = useState(false)
  const [form] = Form.useForm()

  function fetchPrinters() {
    setIsLoading(true)
    api
      .get('/print/')
      .then((response) => {
        setPrinters(response.data)
      })
      .catch((err: AxiosError) => {
        errorActions(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function fetchPrinter() {
    setIsLoading(true)
    api
      .get(`/print/${printerId}/`)
      .then((response) => {
        setSelectedPrinter(response.data)
        setSwitchValue(response.data.active)
        form.setFieldsValue(response.data)
      })
      .catch((err: AxiosError) => {
        errorActions(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function resetedForm() {
    form.resetFields()
    setSwitchValue(false)
    setPrinterId(undefined)
  }

  function createPrinter() {
    setIsLoading(true)
    api
      .post('/print/', form.getFieldsValue())
      .then((response) => {
        fetchPrinters()
        resetedForm()
        setCurrentTab('1')
        TestPrint({ printerName: response.data.name })
      })
      .catch((err: AxiosError) => {
        errorActions(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function updatePrinter() {
    setIsLoading(true)
    api
      .put(`/print/${printerId}/`, form.getFieldsValue())
      .then((response) => {
        fetchPrinters()
        resetedForm()
        setCurrentTab('1')
        TestPrint({ printerName: response.data.name })
      })
      .catch((err: AxiosError) => {
        errorActions(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function deletePrinter(id: number) {
    setIsLoading(true)
    api
      .delete(`/print/${id}/`)
      .then(() => {
        fetchPrinters()
      })
      .catch((err: AxiosError) => {
        errorActions(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function OnCancelShowModal() {
    setCurrentTab('1')
    setShowModal(false)
    setPrinterId(undefined)
    setSwitchValue(false)
    form.resetFields()
  }

  return (
    <PrinterContext.Provider
      value={{
        currentTab,
        isLoading,
        setCurrentTab,
        showModal,
        setShowModal,
        OnCancelShowModal,
        printers,
        fetchPrinters,
        deletePrinter,
        fetchPrinter,
        selectedPrinter,
        form,
        printerId,
        setPrinterId,
        switchValue,
        setSwitchValue,
        createPrinter,
        updatePrinter
      }}
    >
      {children}
    </PrinterContext.Provider>
  )
}

export function usePrinter() {
  const context = useContext(PrinterContext)
  return context
}
