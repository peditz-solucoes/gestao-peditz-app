import React, { useCallback, useEffect } from 'react'
import * as S from './styles'
import { Button, Spin, Table, TableProps, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import api from '@renderer/services/api'
import { Icon } from '@renderer/components/Icon'
import {
  FaCashRegister,
  FaMoneyBillAlt,
  FaPercentage,
  FaQrcode,
  FaRegCreditCard,
  FaUsers
} from 'react-icons/fa'
import { formatCurrency } from '@renderer/utils'
import { Link, useParams } from 'react-router-dom'
import { CgChevronLeft } from 'react-icons/cg'
const { Text } = Typography

interface DataType {
  id: string
  payments: string
  bills: {
    id: string
    number?: number
  }[]
  total: string
  created: string
  tip: string
  type?: string
}

interface PaymentType {
  id: string
  payments: {
    payment_method_title: string
    value: string
    note: string | null
    created: string
    id: string
  }[]
  bills: {
    id: string
    number?: number
  }[]
  created: string
  modified: string
  type: string
  tip: string
  total: string
  cashier: string
}

interface CashierType {
  id: string
  open: boolean
  identifier?: string
  initial_value: string
  closed_at: string | null
  opened_by: {
    id: string
    username: string
    first_name: string
    last_name: string
    email: string
  }
  opened_by_name: string
  closed_by: {
    id: string
    username: string
    first_name: string
    last_name: string
    email: string
  } | null
  closed_by_name: string | null
  restaurant: {
    id: string
    title: string
  }
  created: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'type',
    dataIndex: 'type',
    width: 100
  },
  {
    title: 'Comandas',
    dataIndex: 'bills',
    render: (bills) =>
      bills.map((bill) => (
        <Tag color="gold" key={bill.id}>
          {bill.number}
        </Tag>
      ))
  },
  {
    title: 'Pagamentos',
    dataIndex: 'payments',
    render: (payments) =>
      payments.map((payment) => (
        <div key={payment.id}>
          <Tag color="blue" style={{ marginTop: 5 }}>
            {' '}
            {formatCurrency(Number(payment.value))} - {payment.payment_method_title}
          </Tag>
          <br />
        </div>
      ))
  },
  {
    title: 'Data',
    dataIndex: 'created',
    // sorter: {
    //   compare: (a, b) => moment(a.created).unix() - moment(b.created).unix(),
    //   multiple: 2
    // },
    render: (created) => moment(created).format('DD/MM/YYYY HH:mm')
  },
  {
    title: 'Total',
    dataIndex: 'total'
  },
  {
    title: 'Taxa de serviço',
    dataIndex: 'tip'
  }
]

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}

export const CashierDetail: React.FC = () => {
  const [cashier, setCashiers] = React.useState<CashierType | null>(null)
  const [payments, setPayments] = React.useState<PaymentType[]>([])
  const [paymentsData, setPaymentsData] = React.useState<DataType[]>([])
  const hasUpdate = React.useRef(false)
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight)
  const [loading, setLoading] = React.useState(false)
  const [loadingP, setLoadingP] = React.useState(false)
  const { id } = useParams<{ id: string }>()
  const fecthPayments = useCallback((id: string) => {
    setLoadingP(true)
    api
      .get(`/list-payment/?cashier=${id}`)
      .then((response) => {
        setPayments(response.data)
        setPaymentsData(
          response.data.map((payment) => {
            return {
              id: payment.id,
              payments: payment.payments,
              bills: payment.bills,
              total: formatCurrency(Number(payment.total)),
              created: payment.created,
              tip: formatCurrency(Number(payment.tip)),
              type: payment.type === 'BILL' ? 'Comanda' : 'Pedido'
            }
          })
        )
      })
      .finally(() => {
        setLoadingP(false)
      })
  }, [])
  const fecthCashier = useCallback((id: string) => {
    setLoading(true)
    api
      .get(`/cashier/${id}/`)
      .then((response) => {
        setCashiers(response.data)
        fecthPayments(response.data.id)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!hasUpdate.current && id) {
      fecthCashier(id)
      setWindowHeight(window.innerHeight)
      hasUpdate.current = true
    }
  }, [fecthCashier])

  return (
    <>
      <Link to={'/relatorios/caixas-passados'}>
        <Button
          type="link"
          style={{
            marginLeft: '1rem'
          }}
          icon={<CgChevronLeft />}
        >
          Voltar
        </Button>
      </Link>
      <S.Container>
        <Spin spinning={loading}>
          <S.CardInfo>
            <>
              {' '}
              <div>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon
                    icon={<FaCashRegister size={24} />}
                    style={{
                      color: '#2FAA54',
                      backgroundColor: '#C6F6D5',
                      padding: '4px',
                      borderRadius: '6px'
                    }}
                  />
                  Valor final em caixa
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: '24px',
                    color: '#2FAA54'
                  }}
                >
                  {formatCurrency(
                    payments.reduce((acc, payment) => acc + Number(payment.total), 0) +
                      Number(cashier?.initial_value || 0)
                  )}
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Valor inicial
                  <Tag color="gold">{formatCurrency(Number(cashier?.initial_value || 0))}</Tag>
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '5px'
                }}
              >
                <Text type="secondary">
                  Caixa aberto por:{' '}
                  {cashier?.opened_by?.first_name
                    ? `${cashier?.opened_by?.first_name} ${cashier?.opened_by?.last_name}`
                    : cashier?.opened_by_name}
                </Text>
                <Text type="secondary">
                  em {moment(cashier?.created).format('DD/MM/YYYY HH:mm:ss')}
                </Text>
                <Text type="secondary">
                  Caixa fechado por:{' '}
                  {cashier?.closed_by?.first_name
                    ? `${cashier?.closed_by?.first_name} ${cashier?.closed_by?.last_name}`
                    : cashier?.closed_by_name}
                </Text>
                <Text type="secondary">
                  em {moment(cashier?.closed_at).format('DD/MM/YYYY HH:mm:ss')}
                </Text>
              </div>
            </>
          </S.CardInfo>
        </Spin>
        <S.CardsInfoFinance>
          <S.CardInfoFinance>
            <Text
              type="secondary"
              style={{
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon
                icon={<FaRegCreditCard size={24} />}
                style={{
                  color: '#4C0677',
                  backgroundColor: '#a981c4',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              Débito
            </Text>
            <Text
              strong
              style={{
                fontSize: '24px',
                color: '#4C0677'
              }}
            >
              {formatCurrency(
                Number(
                  payments
                    .map((transaction) =>
                      transaction.payments
                        .filter((pay) => pay.payment_method_title === 'Cartão de débito')
                        .map((item) => item.value)
                    )
                    .flatMap((item) => item)
                    .reduce((acc, curr) => Number(acc) + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
          <S.CardInfoFinance>
            <Text
              type="secondary"
              style={{
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon
                icon={<FaRegCreditCard size={24} />}
                style={{
                  color: '#0583F2',
                  backgroundColor: '#A7D7F7',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              Crédito
            </Text>
            <Text
              strong
              style={{
                fontSize: '24px',
                color: '#0583F2'
              }}
            >
              {formatCurrency(
                Number(
                  payments
                    .map((transaction) =>
                      transaction.payments
                        .filter((pay) => pay.payment_method_title === 'Cartão de Crédito')
                        .map((item) => item.value)
                    )
                    .flatMap((item) => item)
                    .reduce((acc, curr) => Number(acc) + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
          <S.CardInfoFinance>
            <Text
              type="secondary"
              style={{
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon
                icon={<FaMoneyBillAlt size={24} />}
                style={{
                  color: '#2FAA54',
                  backgroundColor: '#C6F6D5',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              Dinheiro
            </Text>
            <Text
              strong
              style={{
                fontSize: '24px',
                color: '#2FAA54'
              }}
            >
              {formatCurrency(
                Number(
                  payments
                    .map((transaction) =>
                      transaction.payments
                        .filter((pay) => pay.payment_method_title === 'Dinheiro')
                        .map((item) => item.value)
                    )
                    .flatMap((item) => item)
                    .reduce((acc, curr) => Number(acc) + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
          <S.CardInfoFinance>
            <Text
              type="secondary"
              style={{
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon
                icon={<FaQrcode size={24} />}
                style={{
                  color: '#DD6B20',
                  backgroundColor: '#FEEBC8',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              PIX
            </Text>
            <Text
              strong
              style={{
                fontSize: '24px',
                color: '#DD6B20'
              }}
            >
              {formatCurrency(
                Number(
                  payments
                    .map((transaction) =>
                      transaction.payments
                        .filter((pay) => pay.payment_method_title === 'PIX')
                        .map((item) => item.value)
                    )
                    .flatMap((item) => item)
                    .reduce((acc, curr) => Number(acc) + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
          <S.CardInfoFinance>
            <Text
              type="secondary"
              style={{
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon
                icon={<FaPercentage size={24} />}
                style={{
                  color: '#0583F2',
                  backgroundColor: '#A7D7F7',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              Taxas de serviço
            </Text>
            <Text
              strong
              style={{
                fontSize: '24px',
                color: '#0583F2'
              }}
            >
              {formatCurrency(
                Number(
                  payments
                    .map((transaction) => Number(transaction.tip))
                    .reduce((acc, curr) => acc + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
          <S.CardInfoFinance>
            <Text
              type="secondary"
              style={{
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon
                icon={<FaUsers size={24} />}
                style={{
                  color: '#0583F2',
                  backgroundColor: '#A7D7F7',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              />
              Conveniado
            </Text>
            <Text
              strong
              style={{
                fontSize: '24px',
                color: '#0583F2'
              }}
            >
              {formatCurrency(
                Number(
                  payments
                    .map((transaction) =>
                      transaction.payments
                        .filter((pay) => pay.payment_method_title === 'Conveniado')
                        .map((item) => item.value)
                    )
                    .flatMap((item) => item)
                    .reduce((acc, curr) => Number(acc) + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
        </S.CardsInfoFinance>
        <Table
          loading={loadingP}
          columns={columns}
          dataSource={paymentsData}
          onChange={onChange}
          pagination={false}
          scroll={{ y: windowHeight - 520 }}
        />
      </S.Container>
    </>
  )
}
