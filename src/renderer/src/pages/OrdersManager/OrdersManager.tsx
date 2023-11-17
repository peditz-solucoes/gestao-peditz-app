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
import { ClockCircleOutlined } from '@ant-design/icons'
import api from '@renderer/services/api'
import { Cashier, OrderGroupList } from '@renderer/types'
import dayjs from 'dayjs'
import { formatCurrency } from '@renderer/utils'
import { CgNotes } from 'react-icons/cg'
import { IoStorefrontOutline } from 'react-icons/io5'
import { FaMotorcycle } from 'react-icons/fa'
const { Text } = Typography
// const items: MenuProps['items'] = [
//   {
//     label: 'Transferir Pendentes para concluido',
//     key: '0'
//   }
// ]

function FormatType(type: 'DELIVERY' | 'TAKEOUT' | 'BILL'): { icon: JSX.Element; text: string } {
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
  const form = useRef<FormInstance>(null)
  const fetchCashiers = useCallback(async () => {
    setLoadingCashiers(true)
    api
      .get('/cashier/')
      .then((response) => {
        setCashiers(response.data)
        if (response.data.find((item: Cashier) => item.open)) {
          fetchOrdersGroup('', response.data.find((item: Cashier) => item.open)?.id)
          form.current?.setFieldsValue({
            cashier: response.data.find((item: Cashier) => item.open)?.id
          })
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
            text: getContrastYIQ(item.color || 'rgb(255,255,255)')
          }
        })
      )
    })
  }, [])

  const fetchOrdersGroup = useCallback(
    async (type: 'DELIVERY' | 'TAKEOUT' | 'BILL' | '', cashier?: string) => {
      setLoadingOrdersGroup(true)
      api
        .get(`/order-list/?type=${type}&cashier=${cashier}`)
        .then((response) => {
          setOrdersGroup(response.data)
        })
        .finally(() => {
          setLoadingOrdersGroup(false)
        })
    },
    []
  )

  const getContrastYIQ = useCallback((rgbcolor: string) => {
    const r = parseInt(rgbcolor.split(',')[0].split('(')[1], 10)
    const g = parseInt(rgbcolor.split(',')[1], 10)
    const b = parseInt(rgbcolor.split(',')[2].split(')')[0], 10)
    // Calcula a luminância
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    // Retorna preto para cores claras e branco para cores escuras
    return yiq >= 128 ? 'black' : 'white'
  }, [])

  useEffect(() => {
    fetchStatus()
    fetchCashiers()
  }, [fetchStatus])

  return (
    <>
      <S.Container>
        {/* <S.HeaderContainer>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <S.TagStatus
              icon={<AiOutlineCoffee />}
              bgColor="rgba(219, 154, 0, 0.1)"
              borderColor="rgb(219, 154, 0)"
            >
              Pendentes
            </S.TagStatus>
            <S.TagStatus
              icon={<AiOutlineCheck />}
              borderColor="rgb(110, 6, 214)"
              bgColor="rgba(110, 6, 214, 0.1)"
            >
              Aceito
            </S.TagStatus>
            <S.TagStatus
              icon={<AiFillClockCircle />}
              borderColor="rgb(255, 130, 102)"
              bgColor="rgba(255, 130, 102, 0.1)"
            >
              Em preparo
            </S.TagStatus>
            <S.TagStatus
              icon={<GiFullMotorcycleHelmet />}
              borderColor="rgb(102, 136, 255)"
              bgColor="rgba(102, 136, 255, 0.1)"
            >
              Esperando o entregador
            </S.TagStatus>
            <S.TagStatus
              icon={<FaMotorcycle />}
              borderColor="rgb(0, 165, 121)"
              bgColor="rgba(0, 165, 121, 0.1)"
            >
              Saiu para entrega
            </S.TagStatus>
            <S.TagStatus
              icon={<FaConciergeBell />}
              borderColor="rgb(28, 175, 28)"
              bgColor="rgba(28, 175, 28, 0.1)"
            >
              Concluido
            </S.TagStatus>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
            }}
          >
            <Input.Search placeholder="Buscar pelo nº do pedido ou comanda" size="large" />
            <Button
              size="large"
              type="default"
              icon={<AiTwotoneSetting />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                padding: '5px'
              }}
            />
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button
                size="large"
                type="default"
                icon={<SlOptionsVertical />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  padding: '5px'
                }}
              />
            </Dropdown>
          </div>
        </S.HeaderContainer>
        <S.OrdersContainer>
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
        </S.OrdersContainer> */}
        <div>
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
              fetchOrdersGroup(values.type || '', values.cashier)
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
        </div>
        <Spin spinning={loadingOrdersGroup} tip="Carregando pedidos..." size="large">
          <div
            style={{
              display: 'flex',
              gap: '0.8rem'
            }}
          >
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
                    backgroundColor: item.color || 'rgb(255,255,255)',
                    color: item.text || 'rgb(0,0,0)',
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
                            <Tag style={{ margin: 0 }} color="blue" icon={<ClockCircleOutlined />}>
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
                              {FormatType(orderGroup?.type as 'DELIVERY' | 'TAKEOUT' | 'BILL').icon}{' '}
                              {FormatType(orderGroup?.type as 'DELIVERY' | 'TAKEOUT' | 'BILL').text}
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
          </div>
        </Spin>
      </S.Container>
      <ModalOrder selectedOrder={selectedOrder} onCancel={(): void => setSelectedOrder(null)} />
    </>
  )
}
