import { useEffect, useState } from 'react'
import * as S from './styles'
import {
  FaCashRegister,
  FaRegCreditCard,
  FaMoneyBillAlt,
  FaQrcode,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle
} from 'react-icons/fa'
import { Icon } from '../../components/Icon'
import { Typography, Table, Button } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ModalCashier } from '../../components/ModalCashier/ModalCashier'
import api from '../../services/api'
import { Cashier, Payments } from '../../types'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'
import { formatCurrency } from '../../utils'

const { Text, Title } = Typography

const columns: ColumnsType<Payments> = [
  {
    title: 'STATUS',
    dataIndex: 'status',
    width: '5%',
    render: (status) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {status === 'Entrada' && (
          <FaArrowUp
            style={{
              backgroundColor: '#00A65A',
              color: '#fff',
              fontSize: '1.5rem',
              padding: '0.25rem',
              borderRadius: '50%'
            }}
          />
        )}
        {status === 'Saida' && (
          <FaArrowDown
            style={{
              backgroundColor: '#d32121',
              color: '#fff',
              fontSize: '1.5rem',
              padding: '0.25rem',
              borderRadius: '50%'
            }}
          />
        )}
      </div>
    ),
    align: 'center'
  },
  {
    title: 'MÉTODO DE PAGAMENTO',
    dataIndex: 'methodPayment',
    align: 'center'
  },
  {
    title: 'VALOR',
    dataIndex: 'value',
    align: 'center'
  },
  {
    title: 'TAXA DE SERVIÇO',
    dataIndex: 'tax',
    align: 'center'
  },
  {
    title: 'DATA',
    dataIndex: 'date',
    align: 'center'
  }
]

export const CashierPage: React.FC = () => {
  const [cashier, setCashier] = useState<Cashier>({} as Cashier)
  const [openModal, setOpenModal] = useState(false)
  const [transactions, setTransactions] = useState<Payments[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCashier()
  }, [])

  function fetchCashier() {
    api
      .get('/cashier/?open=true')
      .then((response) => {
        console.log(response.data)
        setCashier(response.data[0])
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {})
  }

  function fetchTransactions(cashierId: string) {
    setIsLoading(true)
    api
      .get(`/list-payment/?cashier=${cashierId}`)
      .then((response) => {
        setTransactions(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleOpenTradingBox() {
    setOpenModal(true)
  }

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
                  {formatCurrency(Number(cashier.initial_value))}
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
                <S.ButtonBox type="primary" danger onClick={handleOpenTradingBox}>
                  Fechar Caixa
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
                <Button size="large" type="primary" onClick={handleOpenTradingBox}>
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
              R$ 1.500,00
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
              R$ 1.500,00
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
              R$ 1.500,00
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
              R$ 1.500,00
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
              R$ 1.500,00
            </Text>
          </S.CardInfoFinance>
        </S.CardsInfoFinance>

        <Table columns={columns} dataSource={undefined} size="middle" loading={isLoading} />
      </S.Container>
      <ModalCashier
        cashierId={cashier?.id}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onFetch={fetchCashier}
        type={cashier && cashier.open ? 'close' : 'open'}
      />
    </>
  )
}
