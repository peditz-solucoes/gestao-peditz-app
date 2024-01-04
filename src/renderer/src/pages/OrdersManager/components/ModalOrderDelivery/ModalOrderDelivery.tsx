import {
  Alert,
  Button,
  Divider,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Typography,
  Form,
  Input,
  Select,
  Space
} from 'antd'
import React, { useEffect, useState } from 'react'
import {
  UserOutlined,
  ShoppingOutlined,
  PhoneOutlined,
  WalletOutlined,
  CalendarOutlined,
  ShopOutlined,
  HomeOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import {
  DeliveryOrder,
  FormOfPayment,
  OrderComplementList,
  OrderList,
  StatusDelivery
} from '@renderer/types'
import dayjs from 'dayjs'
import { brlToNumber, formatCurrency, formatToBRL } from '@renderer/utils'
import moment from 'moment'
import 'moment/locale/pt-br'
import { deliveryStatus, getLastStatus } from '@renderer/utils/deliveryStatus'
import { FaMoneyBill, FaMotorcycle } from 'react-icons/fa'
import api from '@renderer/services/api'
import { errorActions } from '@renderer/utils/errorActions'
import { AxiosError } from 'axios'
import { OrderDelivery } from '@renderer/utils/Printers'

moment.locale('pt-br')

const { Title, Paragraph } = Typography

interface ModalOrderProps {
  selectedOrder: DeliveryOrder | null
  onCancel: () => void
  nextStatus: (status: StatusDelivery, order: string) => void
  statusError: string
  loadUpdateStatus: boolean
  update: () => void
}

const columns: ColumnsType<OrderList> = [
  {
    title: 'Qtd',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text: string) => <span>{Number(text)}</span>,
    width: 70
  },
  {
    title: 'Produto',
    dataIndex: 'product_title',
    key: 'item'
  },
  {
    title: 'Detalhes',
    key: 'complements',
    dataIndex: 'complements',
    render: (a: OrderComplementList[]) => (
      <>
        {a.map((item) =>
          item.items.map((item2) => (
            <p key={item2.id}>
              {Number(item2.quantity)}x {item2.complement_title}
            </p>
          ))
        )}
      </>
    )
  },
  {
    title: 'Preço',
    dataIndex: 'total',
    key: 'price',
    render: (text: string) => <span>{formatCurrency(Number(text))}</span>
  }
]

export const ModalOrderDelivery: React.FC<ModalOrderProps> = ({
  selectedOrder,
  onCancel,
  nextStatus,
  statusError,
  loadUpdateStatus,
  update
}) => {
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])
  const [formOfPayments, setFormOfPayments] = useState<
    {
      id: string
      value: string
    }[]
  >([])
  const [paymentError, setPaymentError] = useState<string>('' as string)
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false)

  function launchPayments(): void {
    setPaymentLoading(true)
    setPaymentError('')
    if (formOfPayments.reduce((acc, item) => acc + brlToNumber(item.value), 0) > 0) {
      api
        .post(`/payment-delivery/`, {
          payments_types: formOfPayments.map((item) => ({
            id: item.id,
            value: brlToNumber(item.value)
          })),
          order: selectedOrder?.id
        })
        .then(() => {
          update()
        })
        .catch((error: AxiosError) => {
          setPaymentError(JSON.stringify(error.response?.data))
        })
        .finally(() => {
          setPaymentLoading(false)
        })
    } else {
      setPaymentError('Informe o valor pago!')
      setPaymentLoading(false)
    }
  }

  function fetchFormOfPayments(): void {
    api
      .get(`/payment-method/`)
      .then((response) => {
        setFormOfPayment(response.data)
        setFormOfPayments(
          selectedOrder?.payment_method.id
            ? [
                {
                  id: selectedOrder?.payment_method.id,
                  value: formatCurrency(
                    Number(selectedOrder?.order_group.total) +
                      Number(selectedOrder?.delivery_price || 0)
                  )
                }
              ]
            : []
        )
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }
  const nextStatusOrder = (status: StatusDelivery): StatusDelivery => {
    return deliveryStatus[deliveryStatus.findIndex((item) => item.status === status) + 1].status
  }
  const getAdress = (): string => {
    return (
      selectedOrder?.street +
      ', ' +
      selectedOrder?.number +
      ' - ' +
      selectedOrder?.neighborhood +
      ' ' +
      (selectedOrder?.complement ? ' - ' + selectedOrder?.complement : '') +
      ', ' +
      selectedOrder?.city +
      ' - ' +
      selectedOrder?.state
    )
  }

  const printOrder = (): void => {
    const restaurant = JSON.parse(localStorage.getItem('restaurant-info') || '{}')
    const orderOrganized = selectedOrder?.order_group.orders.map((order_item) => {
      return {
        product_price: order_item.product.price,
        notes: order_item.note || ' ',
        product_title: order_item.product.title,
        printer_name: 'caixa',
        product_id: order_item.product.id,
        quantity: order_item.quantity,
        items: order_item.complements.map((c_item) => {
          return {
            complement_id: c_item.id as string,
            complement_title: c_item.complement_group_title,
            items: c_item.items.map((c_item_item) => {
              return {
                item_title: c_item_item.complement_title,
                quantity: c_item_item.quantity,
                item_id: c_item_item.id
              }
            })
          }
        })
      }
    })
    OrderDelivery(
      restaurant?.title || '',
      selectedOrder?.number || '',
      selectedOrder?.payment_method_title || '',
      orderOrganized as [],
      selectedOrder?.order_group.total || ' ',
      selectedOrder?.created || '',
      selectedOrder?.client_name || '',
      {
        adress: selectedOrder?.street + ', ' + selectedOrder?.number,
        district: selectedOrder?.neighborhood || ' ',
        complement: selectedOrder?.complement || ' ',
        cep: selectedOrder?.postal_code || ' ',
        phone: selectedOrder?.client_phone || ' ',
        city: selectedOrder?.city || ''
      }
    )
  }

  useEffect(() => {
    if (selectedOrder) {
      setPaymentError('')
      setPaymentLoading(false)
      fetchFormOfPayments()
    }
  }, [selectedOrder])

  return (
    <Modal
      width={750}
      title={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '30%'
          }}
        >
          <Title level={5} style={{ color: 'rgb(72, 84, 96)', margin: 0 }}>
            #{selectedOrder?.order_group?.order_number.toString().padStart(4, '0')}
          </Title>
          <Paragraph
            style={{
              color: 'rgb(72, 84, 96)',
              margin: 0
            }}
          >
            <Tag
              style={{ fontSize: '1rem' }}
              color={
                deliveryStatus.find((item) => item.status === getLastStatus(selectedOrder))
                  ?.color || 'default'
              }
            >
              {deliveryStatus.find((item) => item.status === getLastStatus(selectedOrder))?.title ||
                'delivery'}
            </Tag>{' '}
            Recebido há {moment(selectedOrder?.created).fromNow()}
          </Paragraph>
        </div>
      }
      open={selectedOrder !== null}
      onCancel={onCancel}
      footer={null}
    >
      <Divider style={{ marginTop: 0, marginBottom: 8 }} />
      <div
        style={{
          width: '100%',
          border: '1px solid rgb(224, 224, 224)',
          borderRadius: '5px',
          padding: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <UserOutlined /> {selectedOrder?.client_name}
            </Paragraph>
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              {selectedOrder?.takeaway ? (
                <>
                  <ShopOutlined /> Retirada
                </>
              ) : (
                <>
                  <ShoppingOutlined />
                  Entrega
                </>
              )}
            </Paragraph>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <PhoneOutlined />{' '}
              <Button
                onClick={(): void => {
                  window.open(
                    `https://api.whatsapp.com/send?phone=${selectedOrder?.client_phone.replace(
                      '+',
                      ''
                    )}`,
                    '_blank'
                  )
                }}
              >
                {selectedOrder?.client_phone}
              </Button>
            </Paragraph>
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <WalletOutlined /> {selectedOrder?.payment_method.title}(
              {selectedOrder?.troco && Number(selectedOrder?.troco) > 0 ? (
                <>Troco para: {formatCurrency(Number(selectedOrder?.troco || 0))}</>
              ) : (
                'Sem troco'
              )}
              )
            </Paragraph>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <CalendarOutlined /> {dayjs(selectedOrder?.created).format('DD/MM/YYYY HH:mm')}
            </Paragraph>
          </div>
        </div>
        {!selectedOrder?.takeaway && (
          <>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '10px'
              }}
            >
              <HomeOutlined />{' '}
              <Button
                type="link"
                onClick={(): void => {
                  window.open('https://www.google.com/maps/place/' + getAdress(), '_blank')
                }}
              >
                {getAdress()}
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '10px'
              }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
                  <FaMotorcycle />
                  {' Taxa de enterega: '}
                  {Number(selectedOrder?.delivery_price) > 0
                    ? formatCurrency(Number(selectedOrder?.delivery_price || 0))
                    : 'Grátis'}
                </Paragraph>
                <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
                  <FaMoneyBill />
                  {' Valor a receber: '}
                  {formatCurrency(
                    Number(selectedOrder?.order_group.total) +
                      Number(selectedOrder?.delivery_price || 0)
                  )}
                </Paragraph>
              </div>
            </div>
          </>
        )}
      </div>
      {selectedOrder &&
        getLastStatus(selectedOrder) === 'DELIVERED' &&
        !selectedOrder.payment_group && (
          <div
            style={{
              marginTop: '16px'
            }}
          >
            <Form layout="vertical">
              {formOfPayments.map((form, key) => (
                <Space key={form.id} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item>
                    <Select
                      size="large"
                      showSearch
                      placeholder="Selecione a forma de pagamento"
                      optionFilterProp="children"
                      value={form.id}
                      onChange={(value): void => {
                        setFormOfPayments((prev) => {
                          const newFormOfPayments = [...prev]
                          newFormOfPayments[key].id = value
                          return newFormOfPayments
                        })
                      }}
                      style={{
                        width: '250px'
                      }}
                      filterOption={(input, option): boolean =>
                        (option?.label ?? '').includes(input)
                      }
                      filterSort={(optionA, optionB): number =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={formOfPayment.map((f) => ({
                        label: f.title,
                        value: f.id
                      }))}
                    />
                  </Form.Item>
                  <Form.Item rules={[{ required: true, message: 'Informe o valor pago!' }]}>
                    <Input
                      placeholder="Valor"
                      size="large"
                      style={{
                        width: '100%'
                      }}
                      value={form.value}
                      onChange={(e): void => {
                        setFormOfPayments((prev) => {
                          const newFormOfPayments = [...prev]
                          newFormOfPayments[key].value = formatToBRL(e.target.value)
                          return newFormOfPayments
                        })
                      }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={(): void => {
                      setFormOfPayments((prev) => {
                        const newFormOfPayments = [...prev]
                        newFormOfPayments.splice(key, 1)
                        return newFormOfPayments
                      })
                    }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={(): void => {
                    setFormOfPayments([...formOfPayments, { id: '', value: '' }])
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Adicionar Pagamento
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      <Table
        columns={columns}
        scroll={{ y: 240 }}
        pagination={false}
        style={{
          margin: '15px 0'
        }}
        dataSource={selectedOrder?.order_group.orders}
      />
      <div
        style={{
          marginBottom: '16px'
        }}
      >
        {statusError && <Alert type="error" message={statusError} />}
        {paymentError && <Alert type="error" message={paymentError} />}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Button onClick={printOrder}>Imprimir pedido</Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedOrder &&
            getLastStatus(selectedOrder) !== 'DELIVERED' &&
            getLastStatus(selectedOrder) !== 'CANCELED' && (
              <Popconfirm
                title="Cancelar pedido"
                description="Você tem certeza que deseja cancelar o pedido?"
                onConfirm={(): void => {
                  nextStatus('CANCELED', selectedOrder?.id || '')
                }}
                onCancel={(): void => {}}
                okText="Cancelar pedido"
                cancelText="Voltar"
                okButtonProps={{ type: 'primary', danger: true }}
              >
                <Button type="default" danger loading={loadUpdateStatus}>
                  {selectedOrder?.status && selectedOrder?.status.length > 1
                    ? 'Cancelar pedido'
                    : 'Recusar'}
                </Button>
              </Popconfirm>
            )}
          {selectedOrder &&
            getLastStatus(selectedOrder) !== 'DELIVERED' &&
            getLastStatus(selectedOrder) !== 'CANCELED' && (
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                disabled={!selectedOrder}
                onClick={(): void =>
                  nextStatus(nextStatusOrder(getLastStatus(selectedOrder)), selectedOrder?.id || '')
                }
                loading={loadUpdateStatus}
              >
                {selectedOrder?.status && selectedOrder?.status.length > 1 ? 'Próximo' : 'Aceitar'}
              </Button>
            )}
          {selectedOrder &&
            getLastStatus(selectedOrder) === 'DELIVERED' &&
            !selectedOrder.payment_group && (
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                disabled={!selectedOrder}
                onClick={(): void => launchPayments()}
                loading={paymentLoading}
              >
                Confirmar pagamento
              </Button>
            )}
        </div>
      </div>
    </Modal>
  )
}
