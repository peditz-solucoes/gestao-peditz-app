import api from '@renderer/services/api'
import { CategoryStock, Stock } from '@renderer/types'
import { errorActions } from '@renderer/utils/errorActions'
import { AxiosResponse } from 'axios'
import { ReactNode, createContext, useContext, useState } from 'react'

interface StockProviderProps {
  children: ReactNode
}

interface StockContextData {
  stocks: Stock[]
  categoriesStock: CategoryStock[]
  stockRegisteredId: string | undefined
  setStockRegisteredId: (id: string | undefined) => void
  getStock: () => void
  getCategoriesStock: () => void
  addItemsToStock: (data: { ingredient: string; quantity: string }) => void
  createNewStock: (data: Stock, containsIngredients: boolean) => Promise<unknown>
  createNewTransaction: (data: {
    quantity: string
    unit_price: string
    total: string
    notes: string
    item: string
  }) => Promise<unknown>
  setCategoriesStock: (data: CategoryStock[]) => void
  setCurrentTab: (tab: '1' | '2' | '3') => void
  currentTab: '1' | '2' | '3'
  stockSelected: Stock | undefined
  getOneStock: (id: string) => Promise<unknown>
  deleteStock: (id: string) => void
  updateStock: (data: Stock) => Promise<unknown>
}

export const StockContext = createContext({} as StockContextData)

export function StockProvider({ children }: StockProviderProps): JSX.Element {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [categoriesStock, setCategoriesStock] = useState<CategoryStock[]>([])
  const [stockRegisteredId, setStockRegisteredId] = useState<string | undefined>(undefined)
  const [stockSelected, setStockSelected] = useState<Stock | undefined>(undefined)
  const [currentTab, setCurrentTab] = useState<'1' | '2' | '3'>('1')

  function getStock() {
    api
      .get('/item-stock/')
      .then((response) => {
        setStocks(response.data)
      })
      .catch((error) => {
        errorActions(error)
      })
  }

  function getCategoriesStock() {
    api
      .get('/item-stock-category/')
      .then((response) => {
        setCategoriesStock(response.data)
      })
      .catch((error) => {
        errorActions(error)
      })
  }

  function addItemsToStock(data: { ingredient: string; quantity: string }) {
    api
      .post('/item-ingredient/', {
        ...data,
        item: stockRegisteredId
      })
      .then(() => {
        getStock()
        getCategoriesStock()
      })
  }

  function getOneStock(id: string) {
    return new Promise((resolve, reject) => {
      api
        .get(`/item-stock/${id}/`)
        .then((response) => {
          setStockSelected(response.data)
          resolve(response.data)
        })
        .catch((error) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  function deleteStock(id: string) {
    api
      .delete(`/item-stock/${id}/`)
      .then(() => {
        getStock()
        getCategoriesStock()
      })
      .catch((error) => {
        errorActions(error)
      })
  }

  function createNewStock(data: Stock, containsIngredients: boolean) {
    return new Promise((resolve, reject) => {
      api
        .post('/item-stock/', data)
        .then((response: AxiosResponse) => {
          getOneStock(response.data.id)
          if (containsIngredients) {
            setCurrentTab('3')
          }
          getStock()
          resolve(response.data)
        })
        .catch((error) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  function updateStock(data: Stock) {
    return new Promise((resolve, reject) => {
      api
        .patch(`/item-stock/${data.id}/`, data)
        .then((response: AxiosResponse) => {
          getOneStock(response.data.id)
          getStock()
          resolve(response.data)
        })
        .catch((error) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  function createNewTransaction(data: {
    quantity: string
    unit_price: string
    total: string
    notes: string
    item: string
  }) {
    return new Promise((resolve, reject) => {
      api
        .post('/item-stock-transaction/', data)
        .then((response: AxiosResponse) => {
          getStock()
          getCategoriesStock()
          resolve(response.data)
        })
        .catch((error) => {
          errorActions(error)
          reject(error)
        })
    })
  }

  return (
    <StockContext.Provider
      value={{
        stocks,
        categoriesStock,
        stockRegisteredId,
        setStockRegisteredId,
        getStock,
        getCategoriesStock,
        addItemsToStock,
        setCategoriesStock,
        setCurrentTab,
        createNewStock,
        createNewTransaction,
        currentTab,
        stockSelected,
        getOneStock,
        deleteStock,
        updateStock
      }}
    >
      {children}
    </StockContext.Provider>
  )
}

export function useStock(): StockContextData {
  const context = useContext(StockContext)
  return context
}
