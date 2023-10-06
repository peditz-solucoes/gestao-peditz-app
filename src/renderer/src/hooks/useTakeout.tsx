import { ReactNode, createContext, useContext, useState } from 'react'
import { Product } from '@renderer/types'

interface TakeoutProviderProps {
  children: ReactNode
}

interface TakeoutContextData {
  productsSelected: ProductSelected[]
  addProductToTakeout: (product: Product) => void
  removeProductToTakeout: (id: string) => void
  clearTakeout: () => void
}

export const TakeoutContext = createContext({} as TakeoutContextData)

type ProductSelected = {
  id: string
  title: string
  quantity: number
  price: number
  total: number
}

export function TakeoutProvider({ children }: TakeoutProviderProps): JSX.Element {
  const [productsSelected, setProductsSelected] = useState<ProductSelected[]>([])

  function addProductToTakeout(product: Product): void {
    const productSelected = productsSelected.find((p) => p.id === product.id)

    if (productSelected) {
      productSelected.quantity += 1
      productSelected.total = productSelected.price * productSelected.quantity
      setProductsSelected([...productsSelected])
    } else {
      const newProductSelected: ProductSelected = {
        id: product.id,
        title: product.title,
        quantity: 1,
        price: Number(product.price),
        total: Number(product.price)
      }
      setProductsSelected([...productsSelected, newProductSelected])
    }
  }

  function removeProductToTakeout(id: string): void {
    const productExists = productsSelected.find((x) => x.id === id)
    if (productExists && productExists.quantity > 1) {
      productExists.quantity -= 1
      productExists.total = productExists.quantity * productExists.price
      setProductsSelected([...productsSelected])
    } else {
      setProductsSelected(productsSelected.filter((x) => x.id !== id))
    }
  }

  function clearTakeout(): void {
    setProductsSelected([])
  }

  return (
    <TakeoutContext.Provider
      value={{
        productsSelected,
        addProductToTakeout,
        clearTakeout,
        removeProductToTakeout
      }}
    >
      {children}
    </TakeoutContext.Provider>
  )
}

export function useTakeout(): TakeoutContextData {
  const context = useContext(TakeoutContext)
  return context
}
