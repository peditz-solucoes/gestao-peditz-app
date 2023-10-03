import React, { useEffect } from 'react'
import * as S from './styles'
import { Button, Col, Divider, Spin, Table } from 'antd'
import { AppstoreOutlined, BarsOutlined, FilterOutlined, ShoppingOutlined } from '@ant-design/icons'
import { CardProducts } from '../../components/CardProducts/CardProducts'
import { DrawerFilterProducts } from '../../components/DrawerFilterProducts/DrawerFilterProducts'
import { DrawerProduct } from '../../components/DrawerProduct/DrawerProduct'
import { Product } from '../../types'
import { ColumnsType } from 'antd/es/table'
import { formatCurrency } from '../../utils'
import { useProducts } from '../../hooks'

type CategoryGroup = {
  category: string
  products: Product[]
}

export const Products: React.FC = () => {
  const [visibleFilter, setVisibleFilter] = React.useState(false)
  const [visibleCardProduct, setVisibleCardProduct] = React.useState(true)
  const [visibleDrawerProduct, setVisibleDrawerProduct] = React.useState(false)
  const {
    products,
    filteredProducts,
    fetchProducts,
    setSelectedProduct,
    isLoading,
    handleDeleteProduct
  } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [])

  function groupProductsByCategory(): CategoryGroup[] {
    const categoryGroups: { [key: string]: CategoryGroup } = {}

    filteredProducts.forEach((Product) => {
      const category = Product.category.title
      if (!categoryGroups[category]) {
        categoryGroups[category] = { category, products: [] }
      }
      categoryGroups[category].products.push(Product)
    })

    return Object.values(categoryGroups)
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Nome',
      dataIndex: 'title',
      align: 'center',
      key: 'name'
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      align: 'center',
      sorter: (a, b): number => {
        return a.category.title.localeCompare(b.category.title)
      },
      render: (category: { title: string }) => category.title,
      sortDirections: ['descend'],
      key: 'category'
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      align: 'center',
      key: 'price',
      render: (price: string) => formatCurrency(Number(price))
    },
    {
      title: 'Ipressora',
      dataIndex: 'printer_detail',
      align: 'center',
      key: 'printer_detail',
      render: (printer_detail: { id: number; name: string }) => printer_detail.name
    },
    {
      title: 'Código',
      dataIndex: 'codigo_produto',
      align: 'center',
      key: 'codigo_produto',
      sorter: (a, b): number => {
        return Number(a?.codigo_produto || 0) - Number(b?.codigo_produto || 0)
      },
      sortDirections: ['ascend', 'descend'],
      render: (codigo_produto: string) => codigo_produto
    },
    {
      title: 'Ações',
      key: 'action',
      align: 'center',
      render: (record: Product) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            justifyContent: 'center'
          }}
        >
          <Button
            type="primary"
            size="small"
            onClick={(): void => {
              setSelectedProduct(record)
              setVisibleDrawerProduct(true)
            }}
          >
            Editar
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={(): void => handleDeleteProduct(record.id)}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ]

  return (
    <>
      <S.Container>
        <S.Header>
          <Button
            type="primary"
            style={{
              backgroundColor: '#2FAA54'
            }}
            onClick={(): void => setVisibleDrawerProduct(true)}
          >
            <ShoppingOutlined /> Criar um produto
          </Button>
          <Button type="default" onClick={(): void => setVisibleCardProduct(!visibleCardProduct)}>
            {visibleCardProduct ? <AppstoreOutlined /> : <BarsOutlined />}
          </Button>
          <Button onClick={(): void => setVisibleFilter(!visibleFilter)}>
            <FilterOutlined />
          </Button>
        </S.Header>
        <Spin spinning={isLoading} size="large">
          <div
            style={{
              overflow: 'auto',
              overflowX: 'hidden',
              height: 'calc(100vh - 160px)',
              display: 'flex',
              marginTop: '20px',
              flexDirection: 'column',
              gap: '40px'
            }}
          >
            {!visibleCardProduct ? (
              groupProductsByCategory().map((category, k) => {
                return (
                  <div key={k}>
                    <S.TitleCategory>
                      {category.category} <Divider type="horizontal" />
                    </S.TitleCategory>
                    <S.RowProduct>
                      {category.products.map((Product) => {
                        return (
                          <Col span={4} key={Product.id}>
                            <CardProducts
                              key={Product.id}
                              data={Product}
                              onUpdate={fetchProducts}
                              onEditClick={(product): void => {
                                setVisibleDrawerProduct(true)
                                setSelectedProduct(product)
                              }}
                            />
                          </Col>
                        )
                      })}
                    </S.RowProduct>
                  </div>
                )
              })
            ) : (
              <div
                style={{
                  padding: '0 40px'
                }}
              >
                <Table
                  columns={columns}
                  dataSource={products}
                  pagination={false}
                  scroll={{ y: 'calc(100vh - 220px)' }}
                />
              </div>
            )}
          </div>
        </Spin>
      </S.Container>
      <DrawerFilterProducts
        visible={visibleFilter}
        onClose={(): void => setVisibleFilter(false)}
        products={products}
      />
      <DrawerProduct
        visible={visibleDrawerProduct}
        onClose={(): void => setVisibleDrawerProduct(false)}
      />
    </>
  )
}
