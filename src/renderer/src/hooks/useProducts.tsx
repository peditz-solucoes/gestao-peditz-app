import { ReactNode, createContext, useContext, useState } from 'react'
import { Product, ProductCategory } from '../types'
import api from '../services/api'
import { AxiosError } from 'axios'
import { errorActions } from '../utils/errorActions'
import { message } from 'antd'

interface ProductsProviderProps {
  children: ReactNode
}

interface ProductsContextData {
  currentTab: number
  setCurrentTab: (tab: number) => void
  products: Product[]
  categories: ProductCategory[]
  productForm: ProductFormData
  setProductForm: (data: ProductFormData) => void
  fetchProducts: () => void
  fetchCategories: () => void
  filteredProducts: (data: filterProducts) => void
  createProduct: (data: ProductFormData) => Promise<unknown>
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  patchProduct: (data: ProductPatchFormData) => Promise<unknown>
  isLoading: boolean
  handleDeleteProduct: (id: string) => void
}

interface filterProducts {
  productCategoryId?: string
  active?: boolean
  listed?: boolean
  printer?: string
}
type type_of_sale = 'KG' | 'L' | 'UN'
export interface ProductPatchFormData {
  id?: string
  created?: string
  modified?: string
  complemet_limit?: number
  codigo_ncm?: string
  valor_unitario_comercial?: string
  valor_unitario_tributavel?: string
  product_tax_description?: string
  unidade_comercial?: type_of_sale
  unidade_tributavel?: type_of_sale
  icms_origem?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
  icms_situacao_tributaria?: '102' | '103' | '300' | '400' | '500' | '900'
  icms_aliquota?: string
  icms_base_calculo?: string
  icms_modalidade_base_calculo?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
  category?: ProductCategory
  printer?: number
  title?: string
  product_category?: string
  codigo_produto?: string
  size?: number
  price?: string
  order?: number
  preparation_time?: number
  ean?: string
  active?: boolean
  listed?: boolean
  type_of_sale?: type_of_sale
  description?: string
}
export interface ProductFormData {
  title: string
  product_category: string
  codigo_produto?: string
  size?: number
  price: string
  order?: number
  preparation_time?: number
  ean?: string
  active?: boolean
  listed?: boolean
  type_of_sale: type_of_sale
  description?: string
}

export const ProductsContext = createContext({} as ProductsContextData)

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [currentTab, setCurrentTab] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [productForm, setProductForm] = useState<ProductFormData>({} as ProductFormData)

  const [messageApi] = message.useMessage()
  const success = (msg: string) => {
    messageApi.open({
      type: 'success',
      content: msg
    })
  }

  const alertError = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg
    })
  }

  function fetchProducts() {
    setIsLoading(true)
    api
      .get('/product')
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function fetchCategories() {
    api
      .get('/product-category/')
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        errorActions(error)
      })
  }

  function filteredProducts(data: filterProducts) {
    api
      .get('/product', {
        params: {
          product_category: data.productCategoryId,
          active: data.active,
          listed: data.listed,
          printer: data.printer
        }
      })
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        errorActions(error)
      })
  }

  function createProduct(productData: ProductFormData) {
    return new Promise((resolve, reject) => {
      api
        .post('/product/', productData)
        .then((response) => {
          resolve(response.data)
          setSelectedProduct(response.data)
          setCurrentTab(2)
          fetchProducts()
          success('Produto cadastrado com sucesso!')
        })
        .catch((error) => {
          errorActions(error)
          alertError('Erro ao cadastrar produto!')
          reject(error)
        })
    })
  }

  function patchProduct(productData: ProductPatchFormData) {
    return new Promise((resolve, reject) => {
      api
        .patch(`/product/${selectedProduct?.id}/`, productData)
        .then((response) => {
          resolve(response.data)
          setSelectedProduct(response.data)
          fetchProducts()
          success('Produto atualizado com sucesso!')
        })
        .catch((error) => {
          errorActions(error)
          alertError('Erro ao atualizar produto!')
          reject(error)
        })
    })
  }

  function handleDeleteProduct(id: string) {
    setIsLoading(true)
    api
      .delete(`/product/${id}`)
      .then(() => {
        fetchProducts()
      })
      .catch((error: AxiosError) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <ProductsContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        products,
        categories,
        productForm,
        setProductForm,
        fetchProducts,
        fetchCategories,
        filteredProducts,
        createProduct,
        selectedProduct,
        patchProduct,
        setSelectedProduct,
        isLoading,
        handleDeleteProduct
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  return context
}
