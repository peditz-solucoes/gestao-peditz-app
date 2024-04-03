import * as S from './styles'
import {
  FaCashRegister,
  FaRegCreditCard,
  FaMoneyBillAlt,
  FaQrcode,
  FaPercentage,
  FaExclamationTriangle
} from 'react-icons/fa'
import { Icon } from '../../components/Icon'
import { Typography, Table, Button, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ModalCashier } from '../../components/ModalCashier/ModalCashier'
import { formatCurrency } from '../../utils'
import { useCashier } from '@renderer/hooks'
import api from '@renderer/services/api'
import { useCallback, useState } from 'react'
import { printStats } from '@renderer/utils/Printers'

const { Text, Title } = Typography

interface payment {
  id: string
  methodPayment: string
  value: string
  tax: string
  date: string
  bills: string
  type: string
}

const columns: ColumnsType<payment> = [
  {
    title: 'MÉTODO DE PAGAMENTO',
    dataIndex: 'methodPayment',
    align: 'center',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'VALOR',
    dataIndex: 'value',
    align: 'center',
    render: (text) => (
      <Tag color="#2FAA54" style={{ width: '80px', textAlign: 'center' }}>
        {text}
      </Tag>
    )
  },
  {
    title: 'TAXA DE SERVIÇO',
    dataIndex: 'tax',
    align: 'center',
    render: (text) => (
      <Tag color="#E58B4A" style={{ width: '80px', textAlign: 'center' }}>
        {text}
      </Tag>
    )
  },
  {
    title: 'DATA',
    dataIndex: 'date',
    align: 'center'
  },
  {
    title: 'CANAL DE VENDAS',
    dataIndex: 'type',
    align: 'center'
  }
]

export const CashierPage: React.FC = () => {
  const { transactions, cashier, setOpenCashierModal, isLoading } = useCashier()

  const mapTypePayment = (type: string) => {
    switch (type) {
      case 'BILL':
        return 'Comanda'
      case 'TAKEOUT':
        return 'Balcão'
      case 'DELIVERY':
        return 'Delivery'
      default:
        return 'Não identificado'
    }
  }

  function mapPaymentsToTableData() {
    return transactions
      .map((transaction) => {
        return transaction.payments.map((payment) => {
          return {
            id: payment.id,
            methodPayment: payment.payment_method_title,
            bills: transaction.bills.map((bill) => bill.number).join(', '),
            tax: formatCurrency(Number(transaction.tip)),
            date: new Date(transaction.created).toLocaleString(),
            value: formatCurrency(Number(payment.value)),
            type: mapTypePayment(transaction.type)
          } as payment
        })
      })
      .flatMap((payment) => payment)
  }

  const totalCashier =
    transactions
      .map((transaction) => Number(transaction.total))
      .reduce((acc, curr) => acc + Number(curr), 0) + Number(cashier?.initial_value)
  const [cashierStatsLoading, setCashierStatsLoading] = useState(false)
  const fetchStats = useCallback(() => {
    setCashierStatsLoading(true)
    api
      .get(`/cashier-stats/${cashier?.id}`)
      .then((response) => {
        console.log(response.data)
        printStats(response.data)
      })
      .finally(() => {
        setCashierStatsLoading(false)
      })
  }, [])

  return (
    <>
      <S.Container>
        <S.CardInfo>
          {cashier?.open ? (
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
                  Valor em caixa
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: '24px',
                    color: '#2FAA54'
                  }}
                >
                  {formatCurrency(totalCashier)}
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
                  Caixa aberto por: {cashier.opened_by_name || 'Usuário sem nome'}
                </Text>
                <Text type="secondary">em {new Date(cashier.created).toLocaleString()}</Text>
                <S.ButtonBox type="primary" danger onClick={() => setOpenCashierModal(true)}>
                  Fechar Caixa
                </S.ButtonBox>
                <S.ButtonBox onClick={fetchStats} loading={cashierStatsLoading}>
                  Relatório
                </S.ButtonBox>
              </div>
            </>
          ) : (
            <div
              style={{
                width: '100%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    backgroundColor: '#FEE2E2'
                  }}
                >
                  <Icon
                    icon={
                      <FaExclamationTriangle
                        size={36}
                        style={{
                          color: '#d32121'
                        }}
                      />
                    }
                  />
                  <Title
                    level={1}
                    style={{
                      fontSize: '24px'
                    }}
                  >
                    Caixa Fechado
                  </Title>
                </div>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Clique no botão abaixo para abrir um novo caixa.
                </Text>
                <Button size="large" type="primary" onClick={() => setOpenCashierModal(true)}>
                  Abrir Caixa
                </Button>
              </div>
            </div>
          )}
        </S.CardInfo>
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
              Receita com Débito
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
                  transactions
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
              Receita com Crédito
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
                  transactions
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
              Receita em dinheiro
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
                  transactions
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
              Receita com pix
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
                  transactions
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
                  transactions
                    .map((transaction) => Number(transaction.tip))
                    .reduce((acc, curr) => acc + Number(curr), 0)
                    .toFixed(2)
                )
              )}
            </Text>
          </S.CardInfoFinance>
        </S.CardsInfoFinance>
        <S.TableContainer>
          <Table
            columns={columns}
            dataSource={mapPaymentsToTableData()}
            pagination={false}
            scroll={{ y: 'calc(100vh - 30em)' }}
            size="middle"
            loading={isLoading}
            rowKey={(row) => row.id}
            // style={{
            //   width: 'calc(100vw - 320px)'
            // }}
          />
        </S.TableContainer>
      </S.Container>
      <ModalCashier />
    </>
  )
}
