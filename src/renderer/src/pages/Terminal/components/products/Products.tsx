import { CaretRightOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Collapse, Input, InputRef, List, Modal, Typography } from 'antd'
import React, { useEffect } from 'react'
import { formatCurrency } from '../../../../utils'
import { useTerminal } from '../../../../hooks/useTerminal'
import { OrderGroupList, Product } from '../../../../types'
import api from '../../../../services/api'
import { ProductDrawer } from '../productDrawer'
import { Order } from '@renderer/utils/Printers'
import { AxiosError, AxiosResponse } from 'axios'
import { errorActions } from '@renderer/utils/errorActions'
type CategoryGroup = {
  category: string
  categoryId: string
  products: Product[]
}

export const Products: React.FC = () => {
  const searchInput = React.useRef<InputRef>(null)
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const { selectedBill, cart, setCart, currentTab, setCurrentTab } = useTerminal()
  const [selectedProduct, setSelectedProduct] = React.useState<string>('')
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([])
  const [searchValue, setSearchValue] = React.useState<string>('')
  const [loadingSend, setLoadingSend] = React.useState<boolean>(false)
  const [orders, setOrders] = React.useState<OrderGroupList[]>([])
  const operatorCodePassInput = React.useRef<InputRef>(null)
  const [operatorCode, setOperatorCode] = React.useState<string>('')
  const [modalCodeOpen, setModalCodeOpen] = React.useState<boolean>(false)
  const [sendError, setSendError] = React.useState<string>('')
  function getOrdersBills(billId: string): void {
    api
      .get(`/order-list/?bill=${billId}`)
      .then((response: AxiosResponse) => {
        setOrders([...response.data])
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }
  const fetchProducts = async (): Promise<void> => {
    setLoading(true)
    api
      .get('/product/')
      .then((response) => {
        setProducts(response.data)
        setFilteredProducts(response.data)
        searchInput.current?.focus()
        setSearchValue('')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function groupProductsByCategory(p: Product[]): CategoryGroup[] {
    const categoryGroups: { [key: string]: CategoryGroup } = {}

    p.forEach((Product) => {
      const category = Product.category.title
      const categoryId = Product.category.id
      if (!categoryGroups[category]) {
        categoryGroups[category] = { category, categoryId, products: [] }
      }
      categoryGroups[category].products.push(Product)
    })

    return Object.values(categoryGroups)
  }

  const searchProduct = (): void => {
    if (!searchValue) {
      setFilteredProducts(products)
      return
    }
    const filteredProducts = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        product?.codigo_produto?.toLowerCase().includes(searchValue.toLowerCase())
      )
    })
    if (filteredProducts.length === 1) {
      setSelectedProduct(filteredProducts[0].id)
    } else {
      setFilteredProducts(filteredProducts)
    }
  }

  useEffect(() => {
    if (currentTab === '2') {
      setOrders([])
      fetchProducts()
      if (selectedBill.id) {
        getOrdersBills(selectedBill.id)
      }
    }
  }, [currentTab])

  function sendOrder(): void {
    setLoadingSend(true)
    if (operatorCode) {
      setSendError('')
      api
        .post('/order/', {
          bill_id: selectedBill.id,
          operator_code: operatorCode,
          order_items: cart
        })
        .then((response) => {
          setCart([])
          console.log(response.data)
          Order(
            response.data.restaurant.title,
            response.data.bill?.table?.title || '',
            String(response.data.bill?.number) || '',
            response.data.order_items,
            response.data?.collaborator_name || '',
            response.data?.created || ''
          )
          setOperatorCode('')
          setModalCodeOpen(false)
          setCurrentTab('1')
        })
        .catch((error) => {
          if (error.response?.data?.detail) {
            setSendError(error.response?.data?.detail)
          } else {
            setSendError('Erro ao enviar pedido')
          }
        })
        .finally(() => {
          setLoadingSend(false)
        })
    } else {
      setSendError('Informe o código do operador')
      setLoadingSend(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '0 1rem'
        }}
      >
        <Input.Search
          ref={searchInput}
          value={searchValue}
          onChange={(e): void => setSearchValue(e.target.value)}
          onSearch={searchProduct}
          placeholder="Pesquisar o nome ou código do produto"
          style={{
            width: '360px'
          }}
          size="large"
        />
        <Button disabled={loading} size="large" onClick={fetchProducts}>
          <ReloadOutlined spin={loading} />
        </Button>
      </div>
      <div
        style={{
          display: 'grid',
          height: 'calc(100vh - 250px)',
          gridTemplateColumns: '1fr 2fr 1fr',
          width: '100%',
          flex: 1,
          marginTop: '1rem',
          flexGrow: 1,
          gap: '0.5rem',
          position: 'relative'
        }}
      >
        <Card
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 !important',
            alignItems: 'center'
          }}
          bodyStyle={{
            padding: '0 !important'
          }}
        >
          <Typography.Title
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
              marginTop: '1rem'
            }}
            level={4}
          >
            Comanda {selectedBill.number}
          </Typography.Title>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '100%',
              maxHeight: 'calc(100vh - 250px)',
              overflowY: 'auto'
            }}
          >
            {orders.map((orderG) =>
              orderG.orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    width: '100%'
                  }}
                >
                  <Typography.Text
                    style={{
                      margin: '0',
                      width: '100%',
                      fontSize: '1.2rem',
                      // marginLeft: '14px',
                      fontWeight: 'bold',
                      maxWidth: '100%',
                      wordBreak: 'break-all',
                      wordWrap: 'break-word'
                    }}
                  >
                    {Number(order.quantity)}x {order.product_title}
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    style={{
                      margin: '0',
                      width: '100%',
                      marginLeft: '30px'
                    }}
                  >
                    {order.note}
                  </Typography.Text>
                  {order.complements.map((complement) => {
                    return (
                      <div key={complement.id}>
                        <Typography.Text
                          style={{
                            margin: '0',
                            width: '100%',
                            marginLeft: '30px',
                            fontWeight: 'bold'
                          }}
                        >
                          {complement.complement_group_title}
                        </Typography.Text>
                        {complement.items.map((ite) => (
                          <div key={ite.id}>
                            <Typography.Text
                              style={{
                                margin: '0',
                                width: '100%',
                                marginLeft: '30px'
                              }}
                            >
                              {Number(ite.quantity) > 1 ? ite.quantity + 'x ' : '-'}{' '}
                              {ite.complement_title}
                            </Typography.Text>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </Card>
        <div
          style={{
            display: 'flex',
            height: 'calc(100vh - 250px)',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexGrow: 1,
              flex: 1,
              maxHeight: `calc(100vh -250px)`,
              overflowY: 'auto',
              justifyContent: 'flex-start',
              flexDirection: 'column'
            }}
          >
            <Collapse
              //   bordered={false}
              defaultActiveKey={['1']}
              //   ghost
              size="large"
              accordion
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              items={groupProductsByCategory(filteredProducts).map((category) => ({
                key: category.categoryId,
                label: category.category,
                children: (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.3rem 0.3rem'
                    }}
                  >
                    {category.products.map((product) => (
                      <Card
                        key={product.id}
                        style={{
                          width: '200px',
                          minWidth: '200px',
                          cursor: 'pointer',
                          minHeight: '120px'
                        }}
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        <Typography.Title
                          style={{
                            textAlign: 'center',
                            marginBottom: '0'
                          }}
                          level={5}
                          ellipsis={{
                            rows: 3,
                            suffix: ''
                          }}
                        >
                          {product.codigo_produto} - {product.title}
                        </Typography.Title>
                        <Typography.Title
                          style={{
                            textAlign: 'center',
                            marginTop: '0',
                            marginBottom: '0'
                          }}
                          level={5}
                        >
                          {formatCurrency(Number(product.price))}
                        </Typography.Title>
                      </Card>
                    ))}
                  </div>
                )
              }))}
            />
          </div>
        </div>
        <Card
          bodyStyle={{
            padding: '0 !important'
          }}
          style={{
            padding: '0 !important'
          }}
        >
          <List
            size="large"
            style={{
              width: '100%',
              margin: '0 !important',
              height: 'calc(100vh - 300px)',
              overflowY: 'auto',
              flexGrow: 1,
              flex: 1
            }}
            header={<Typography.Title level={4}>Resumo</Typography.Title>}
            bordered
            dataSource={cart}
            renderItem={(item, index) => (
              <List.Item
                style={{
                  padding: '0.5rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0 0.5rem',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex'
                      }}
                    >
                      <Button
                        size="large"
                        onClick={() => {
                          const itemIndex = index
                          const newCart = [...cart]
                          newCart.splice(itemIndex, 1)
                          setCart([...newCart])
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography.Title
                      level={5}
                      ellipsis={{
                        rows: 2,
                        suffix: ''
                      }}
                      style={{
                        margin: '0',
                        width: '100%'
                      }}
                    >
                      {item.quantity}x {item.product_title}
                    </Typography.Title>
                    <Typography.Text
                      style={{
                        margin: '0',
                        width: '100%'
                      }}
                    >
                      {item.notes}
                    </Typography.Text>
                    {item.complements.map((complement) => {
                      return (
                        <div>
                          <Typography.Text
                            style={{
                              margin: '0',
                              width: '100%',
                              marginLeft: '14px',
                              fontWeight: 'bold'
                            }}
                          >
                            {complement.complement_title}
                          </Typography.Text>
                          {complement.items.map((ite) => (
                            <div>
                              <Typography.Text
                                style={{
                                  margin: '0',
                                  width: '100%',
                                  marginLeft: '30px'
                                }}
                              >
                                {ite.quantity > 1 ? ite.quantity + 'x ' : '-'} {ite.item_title}
                              </Typography.Text>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </List.Item>
            )}
          />
          <Button
            style={{
              marginTop: '0.5rem'
            }}
            size="large"
            type="primary"
            block
            loading={loadingSend}
            disabled={cart.length === 0}
            onClick={(): void => {
              setModalCodeOpen(true)
              setTimeout(() => {
                operatorCodePassInput.current?.focus()
              }, 100)
            }}
          >
            Enviar Pedidos
          </Button>
        </Card>
      </div>
      <Modal
        title="Confimar Senha de Operador"
        open={modalCodeOpen}
        onCancel={(): void => setModalCodeOpen(false)}
        onOk={(): void => {
          sendOrder()
        }}
        confirmLoading={loadingSend}
      >
        {sendError && (
          <Alert
            style={{
              marginBottom: '1rem'
            }}
            message={sendError}
            type="error"
            showIcon
          />
        )}
        <Input.Password
          value={operatorCode}
          onChange={(e): void => setOperatorCode(e.target.value)}
          placeholder="Código"
          ref={operatorCodePassInput}
          onPressEnter={(): void => {
            sendOrder()
          }}
        />
      </Modal>
      <ProductDrawer visible={selectedProduct} onClose={(): void => setSelectedProduct('')} />
    </div>
  )
}
