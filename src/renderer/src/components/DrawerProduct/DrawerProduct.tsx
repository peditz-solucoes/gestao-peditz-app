import { Drawer, FormInstance, Tabs, TabsProps } from 'antd'
import React, { useEffect } from 'react'
import { useProducts } from '../../hooks'
import { ProductInfo } from './components/ProductInfo'
import { ProductFiscal } from './components/ProductFiscal'
import { ProductComplement } from './components/ProductComplement'
import { Prices } from './components/Prices'
import { formatToBRL } from '@renderer/utils'

interface DrawerProductProps {
  visible: boolean
  onClose: () => void
}

export const DrawerProduct: React.FC<DrawerProductProps> = ({ onClose, visible }) => {
  const { fetchCategories, currentTab, selectedProduct, setSelectedProduct, setCurrentTab } =
    useProducts()
  const formRef = React.useRef<FormInstance>(null)
  const formFiscalRef = React.useRef<FormInstance>(null)

  useEffect(() => {
    fetchCategories()
    if (selectedProduct) {
      formRef.current?.setFieldsValue({
        title: selectedProduct.title,
        product_category: selectedProduct.product_category,
        description: selectedProduct.description,
        price: formatToBRL(selectedProduct.price),
        codigo_produto: selectedProduct.codigo_produto,
        order: selectedProduct.order,
        active: selectedProduct.active,
        listed: selectedProduct.listed,
        type_of_sale: selectedProduct.type_of_sale,
        printer: selectedProduct.printer
      })
      formFiscalRef.current?.setFieldsValue(selectedProduct)
    }
  }, [visible, selectedProduct])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <h4>Informações básicas</h4>,
      children: <ProductInfo formRef={formRef} />,
      disabled: `${currentTab}` !== '1' && selectedProduct == null
    },
    {
      key: '4',
      label: <h4>Preços</h4>,
      children: <Prices />,
      disabled: `${currentTab}` !== '4' && selectedProduct == null
    },
    {
      key: '2',
      label: <h4>Fiscal</h4>,
      children: <ProductFiscal formRef={formFiscalRef} />,
      disabled: `${currentTab}` !== '2' && selectedProduct == null
    },
    {
      key: '3',
      label: <h4>Complementos</h4>,
      children: <ProductComplement />,
      disabled: `${currentTab}` !== '3' && selectedProduct == null
    }
  ]

  return (
    <>
      <Drawer
        title={selectedProduct ? 'Editar produto' : 'Criar produto'}
        width={800}
        placement="right"
        onClose={(): void => {
          onClose()
          setSelectedProduct(null)
          setCurrentTab(1)
          formRef.current?.resetFields()
        }}
        open={visible}
        bodyStyle={{ padding: '0 20px' }}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          activeKey={`${currentTab}`}
          onTabClick={(key): void => {
            setCurrentTab(parseInt(key))
          }}
        />
      </Drawer>
    </>
  )
}
