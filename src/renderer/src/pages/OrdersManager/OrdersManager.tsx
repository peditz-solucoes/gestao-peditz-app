import React, { useCallback, useEffect, useRef } from 'react'
import * as S from './styles'
import { AiOutlineCoffee } from 'react-icons/ai'
import {
  Button,
  Card,
  Form,
  FormInstance,
  Input,
  // MenuProps,
  Select,
  Spin,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { ModalOrder } from './components/ModalOrder/ModalOrder'
import { ClockCircleOutlined, SwapOutlined } from '@ant-design/icons'
import api from '@renderer/services/api'
import { Cashier, DeliveryOrder, OrderGroupList, StatusDelivery } from '@renderer/types'
import dayjs from 'dayjs'
import { formatCurrency } from '@renderer/utils'
import { CgNotes } from 'react-icons/cg'
import { IoStorefrontOutline } from 'react-icons/io5'
import { FaMotorcycle } from 'react-icons/fa'
import { ModalOrderDelivery } from './components/ModalOrderDelivery/ModalOrderDelivery'
import { deliveryStatus, getLastStatus } from '@renderer/utils/deliveryStatus'
import { AxiosError, AxiosResponse } from 'axios'
const { Text } = Typography
type ORDER_TYPE = 'DELIVERY' | 'TAKEOUT' | 'BILL' | ''
function FormatType(type: ORDER_TYPE): { icon: JSX.Element; text: string } {
  switch (type) {
    case 'DELIVERY':
      return {
        icon: <FaMotorcycle color="green" size={16} />,
        text: 'Delivery'
      }
    case 'TAKEOUT':
      return {
        icon: <IoStorefrontOutline color="green" size={16} />,
        text: 'Balcão'
      }
    case 'BILL':
      return {
        icon: <CgNotes color="green" size={16} />,
        text: 'Comanda'
      }
    default:
      return {
        icon: <AiOutlineCoffee color="green" size={16} />,
        text: 'Balcão'
      }
  }
}
import audioa from '../../assets/audio.mp3'

interface StatusProps {
  id: string
  created: string
  modified: string
  status: string
  color: string | null
  active: boolean
  order: number
  text?: string | null
  restaurant: string
}
export const OrdersManager: React.FC = () => {
  // const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [status, setStatus] = React.useState<StatusProps[]>([])
  const [cashiers, setCashiers] = React.useState<Cashier[]>([])
  const [loadingCashiers, setLoadingCashiers] = React.useState(false)
  const [ordersGroup, setOrdersGroup] = React.useState<OrderGroupList[]>([])
  const [loadingOrdersGroup, setLoadingOrdersGroup] = React.useState(false)
  const [selectedOrder, setSelectedOrder] = React.useState<OrderGroupList | null>(null)
  const [selectedOrderDelivery, setSelectedOrderDelivery] = React.useState<DeliveryOrder | null>(
    null
  )
  const [deliveryOrders, setDeliveryOrders] = React.useState<DeliveryOrder[]>([])
  const [orderType, setOrderType] = React.useState<ORDER_TYPE>('DELIVERY')
  const form = useRef<FormInstance>(null)

  const fetchCashiers = useCallback(async () => {
    setLoadingCashiers(true)
    api
      .get('/cashier/')
      .then((response) => {
        setCashiers(response.data)
        if (response.data.find((item: Cashier) => item.open)) {
          form.current?.setFieldsValue({
            cashier: response.data.find((item: Cashier) => item.open)?.id,
            type: orderType
          })
          form.current?.submit()
        }
      })
      .finally(() => {
        setLoadingCashiers(false)
      })
  }, [])

  const fetchStatus = useCallback(async () => {
    api.get('/order-status/').then((response) => {
      setStatus(
        response.data.map((item: StatusProps) => {
          return {
            ...item,
            text: getContrastYIQ(item?.color ?? 'rgb(255,255,255)')
          }
        })
      )
    })
  }, [])

  const fetchDeliveryOrders = useCallback(async (cashier?: string, order?: string) => {
    return new Promise((resolve, reject) => {
      api
        .get(`/delivery-restaurant/?order_group__cashier=${cashier}`)
        .then((response) => {
          setDeliveryOrders(response.data)
          if (
            order &&
            response.data.find((item) => item.order_group.order_number === Number(order))
          ) {
            setSelectedOrderDelivery(
              response.data.find((item) => item.order_group.order_number === Number(order))
            )
          }
          resolve(response.data)
        })
        .finally(() => {
          setLoadingOrdersGroup(false)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }, [])

  const fetchOrdersGroup = useCallback(
    async (type: 'DELIVERY' | 'TAKEOUT' | 'BILL' | '', cashier?: string, order?: string) => {
      setOrderType(type)
      setLoadingOrdersGroup(true)
      if (type === 'DELIVERY') {
        fetchDeliveryOrders(cashier, order)
      } else {
        api
          .get(`/order-list/?type=${type}&cashier=${cashier}`)
          .then((response) => {
            setOrdersGroup(response.data)
          })
          .finally(() => {
            setLoadingOrdersGroup(false)
          })
      }
    },
    []
  )
  const [loadUpdateStatus, setLoadUpdateStatus] = React.useState(false)
  const [updateStatusError, setUpdateStatusError] = React.useState('')
  const nextStatus = useCallback((status: StatusDelivery, order: string) => {
    setLoadUpdateStatus(true)
    setUpdateStatusError('')
    api
      .post('delivery-status/', { title: status, order, made_product: status !== 'WAITING' })
      .then(() => {
        fetchDeliveryOrders(form.current?.getFieldValue('cashier'), '')
        setSelectedOrderDelivery(null)
      })
      .catch((err) => {
        setUpdateStatusError(
          err.response.data?.non_field_errors
            ? err.response.data?.non_field_errors[0]
            : 'Erro ao atualizar status'
        )
      })
      .finally(() => {
        setLoadUpdateStatus(false)
      })
  }, [])

  const getContrastYIQ = useCallback((rgbcolor: string) => {
    const r = parseInt(rgbcolor.split(',')[0].split('(')[1], 10)
    const g = parseInt(rgbcolor.split(',')[1], 10)
    const b = parseInt(rgbcolor.split(',')[2].split(')')[0], 10)
    // Calcula a luminância
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    // Retorna preto para cores claras e branco para cores escuras
    return yiq >= 128 ? 'black' : 'white'
  }, [])

  const [socket, setSocket] = React.useState<WebSocket | null>(null)
  const [, setConnectedWs] = React.useState(false)
  const [, setLoadingConnectSocket] = React.useState(false)
  const playAudio = (): void => {
    // Tocar um arquivo de áudio
    const audio = new Audio(audioa)
    audio.play()
  }

  const connectSocket = useCallback(async (): Promise<void> => {
    setLoadingConnectSocket(true)
    api
      .get('/restaurant/')
      .then((response: AxiosResponse) => {
        if (!socket) {
          const newSocket = new WebSocket(
            `wss://api-peditz-gestao.up.railway.app/ws/pedidos/${response.data[0].id}/`
          )

          newSocket.onopen = (): void => {
            setLoadingConnectSocket(false)
            setSocket(newSocket)
            setConnectedWs(true)
          }

          newSocket.onmessage = (event): void => {
            const eventParse = JSON.parse(event.data)
            const delivery = JSON.parse(eventParse?.delivery)
            if (delivery) {
              playAudio()
              fetchDeliveryOrders(form.current?.getFieldValue('cashier'), '')
            }
          }

          newSocket.onerror = (): void => {
            setConnectedWs(false)
            setSocket(null)
            setLoadingConnectSocket(false)
          }

          newSocket.onclose = (): void => {
            setConnectedWs(false)
            setSocket(null)
            setLoadingConnectSocket(false)
          }

          // return () => newSocket.close()
        }
      })
      .catch((err: AxiosError) => console.log(err.response?.data))
  }, [])

  useEffect(() => {
    fetchStatus()
    fetchCashiers()
    connectSocket()
  }, [fetchStatus])

  return (
    <>
      <S.Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Form
            style={{
              display: 'flex',
              gap: '0.8rem'
            }}
            ref={form}
            onFinish={(values: {
              type: 'DELIVERY' | 'TAKEOUT' | 'BILL' | ''
              cashier: string
              order: string
            }): void => {
              fetchOrdersGroup(values.type || '', values.cashier, values.order)
            }}
          >
            <Form.Item name="type">
              <Select
                style={{
                  width: '220px'
                }}
                size="large"
                placeholder="Qual tipo de pedio?"
                options={[
                  {
                    label: 'Todos os pedidos',
                    value: ''
                  },
                  {
                    label: 'Balcão',
                    value: 'TAKEOUT'
                  },
                  {
                    label: 'Delivery',
                    value: 'DELIVERY'
                  },
                  {
                    label: 'Comanda',
                    value: 'BILL'
                  }
                ]}
                loading={loadingCashiers}
                defaultValue={''}
              />
            </Form.Item>
            <Form.Item name="cashier">
              <Select
                style={{
                  width: '220px'
                }}
                size="large"
                placeholder="Selecione o caixa"
                options={cashiers.map((item) => ({
                  label: item.identifier,
                  value: item.id
                }))}
                loading={loadingCashiers}
              />
            </Form.Item>
            <Form.Item name="order">
              <Input type="text" size="large" prefix="#" placeholder="Número do pedido" />
            </Form.Item>
            <Form.Item name="order">
              <Button type="primary" size="large" htmlType="submit">
                Buscar
              </Button>
            </Form.Item>
          </Form>
          <Button
            size="large"
            icon={<SwapOutlined />}
            style={{
              transform: 'rotate(90deg)'
            }}
            onClick={(): void => {
              const reverse = deliveryOrders.reverse()
              setDeliveryOrders([...reverse])
            }}
          />
        </div>
        <Spin spinning={loadingOrdersGroup} tip="Carregando pedidos..." size="large">
          <div
            style={{
              display: 'flex',
              gap: '0.8rem'
            }}
          >
            {orderType === 'DELIVERY' ? (
              deliveryStatus.map((item) => (
                <div
                  key={item.status}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '220px',
                    gap: '0.8rem'
                  }}
                >
                  <Card
                    bodyStyle={{
                      borderRadius: '7px',
                      backgroundColor: item.color || 'rgb(255,255,255)',
                      color: item.text || 'rgb(0,0,0)',
                      padding: '0.7rem 1rem'
                    }}
                  >
                    {item.title}
                  </Card>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem',
                      height: 'calc(100vh - 240px)',
                      overflowY: 'auto'
                    }}
                    className="scrollbar"
                  >
                    {deliveryOrders
                      .filter((orderGroup) => getLastStatus(orderGroup) === item.status)
                      .map((orderGroup) => (
                        <Card
                          key={orderGroup.id}
                          style={{
                            width: '100%',
                            cursor: 'pointer'
                          }}
                          bodyStyle={{
                            padding: '0.7rem',
                            width: '100%'
                          }}
                          title={`Pedido #${orderGroup?.order_group?.order_number}`}
                          headStyle={{
                            padding: '0.5rem',
                            margin: 0
                          }}
                          extra={
                            <Tooltip title="Tempo de espera">
                              <Tag
                                style={{ margin: 0 }}
                                color={
                                  dayjs().diff(dayjs(orderGroup?.status[0].created), 'minute') > 30
                                    ? 'red'
                                    : 'blue'
                                }
                                icon={<ClockCircleOutlined />}
                              >
                                {String(
                                  dayjs().diff(dayjs(orderGroup?.status[0].created), 'hour')
                                ).padStart(2, '0')}{' '}
                                {':'}{' '}
                                {String(
                                  dayjs().diff(dayjs(orderGroup?.status[0].created), 'minute') % 60
                                ).padStart(2, '0')}
                              </Tag>
                            </Tooltip>
                          }
                          onClick={(): void => {
                            setSelectedOrderDelivery(orderGroup)
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              width: '100%'
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                              }}
                            >
                              <Text>
                                {FormatType('DELIVERY').icon} {FormatType('DELIVERY').text}{' '}
                                {orderGroup.payment_group && <Tag color="green">Pago</Tag>}
                              </Text>
                              <strong>
                                <Text
                                  style={{
                                    color: 'green'
                                  }}
                                >
                                  {formatCurrency(
                                    Number(orderGroup?.delivery_price || 0) +
                                      Number(orderGroup?.order_group.total || 0)
                                  )}
                                </Text>
                              </strong>
                              <Button>
                                {getLastStatus(orderGroup) === 'DELIVERED' ||
                                getLastStatus(orderGroup) === 'CANCELED'
                                  ? 'FINALIZADO'
                                  : 'Avançar'}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <>
                {status.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '220px',
                      gap: '0.8rem'
                    }}
                  >
                    <Card
                      bodyStyle={{
                        borderRadius: '7px',
                        backgroundColor: item?.color ?? 'rgb(255,255,255)',
                        color: item?.text ?? 'rgb(0,0,0)',
                        padding: '0.7rem 1rem'
                      }}
                    >
                      {item.status}
                    </Card>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        height: 'calc(100vh - 240px)',
                        overflowY: 'auto'
                      }}
                    >
                      {ordersGroup
                        .filter((orderGroup) => orderGroup.status?.id === item.id)
                        .reverse()
                        .map((orderGroup) => (
                          <Card
                            key={orderGroup.id}
                            style={{
                              width: '100%',
                              cursor: 'pointer'
                            }}
                            bodyStyle={{
                              padding: '0.7rem',
                              width: '100%'
                            }}
                            title={`Pedido #${orderGroup.order_number}`}
                            headStyle={{
                              padding: '0.5rem',
                              margin: 0
                            }}
                            extra={
                              <Tooltip title="Última atualização">
                                <Tag
                                  style={{ margin: 0 }}
                                  color="blue"
                                  icon={<ClockCircleOutlined />}
                                >
                                  {dayjs(orderGroup?.modified).format('HH:mm')}
                                </Tag>
                              </Tooltip>
                            }
                            onClick={(): void => {
                              setSelectedOrder(orderGroup)
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                width: '100%'
                              }}
                            >
                              <div
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.5rem'
                                }}
                              >
                                <Text>
                                  {
                                    FormatType(orderGroup?.type as 'DELIVERY' | 'TAKEOUT' | 'BILL')
                                      .icon
                                  }{' '}
                                  {
                                    FormatType(orderGroup?.type as 'DELIVERY' | 'TAKEOUT' | 'BILL')
                                      .text
                                  }
                                  {orderGroup.type === 'BILL' && (
                                    <Tag
                                      style={{
                                        marginLeft: '0.5rem'
                                      }}
                                    >
                                      {orderGroup.bill
                                        ? `Pedido #${orderGroup.bill.number}`
                                        : `Não identificado`}
                                    </Tag>
                                  )}
                                </Text>
                                <strong>
                                  <Text
                                    style={{
                                      color: 'green'
                                    }}
                                  >
                                    {formatCurrency(Number(orderGroup?.total || 0))}
                                  </Text>
                                </strong>
                                <Button>Avançar</Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </Spin>
      </S.Container>
      <ModalOrder
        selectedOrder={selectedOrder}
        onCancel={(): void => {
          setSelectedOrderDelivery(null)
          setSelectedOrder(null)
        }}
      />
      <ModalOrderDelivery
        selectedOrder={selectedOrderDelivery}
        onCancel={(): void => {
          setSelectedOrderDelivery(null)
          setSelectedOrder(null)
        }}
        statusError={updateStatusError}
        loadUpdateStatus={loadUpdateStatus}
        nextStatus={nextStatus}
        update={(): void => {
          fetchDeliveryOrders(form.current?.getFieldValue('cashier'), '')
          setSelectedOrderDelivery(null)
        }}
      />
    </>
  )
}
