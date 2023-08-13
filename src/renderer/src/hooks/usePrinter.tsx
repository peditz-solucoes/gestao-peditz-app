// import { Printer } from '@renderer/types'
import { ReactNode, createContext, useContext, useState } from 'react'

interface PrinterProviderProps {
  children: ReactNode
}

interface PrinterContextData {
  currentTab: string
  setCurrentTab: (tab: '1' | '2') => void
  showModal: boolean
  setShowModal: (show: boolean) => void
  // printers: Printer[]
}

export const PrinterContext = createContext<PrinterContextData>({} as PrinterContextData)

export function PrinterProvider({ children }: PrinterProviderProps) {
  const [currentTab, setCurrentTab] = useState('1')
  const [showModal, setShowModal] = useState(false)
  // const [printers, setPrinters] = useState<Printer[]>([])

  return (
    <PrinterContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        showModal,
        setShowModal
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
