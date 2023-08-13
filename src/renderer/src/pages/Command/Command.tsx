import React, { useEffect, useState } from 'react'
import * as S from './styles'
import {
  Avatar,
  Badge,
  Button,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
  Typography
} from 'antd'
import { AiFillPrinter, AiOutlineCheckCircle } from 'react-icons/ai'
import { ImBin } from 'react-icons/im'
import Table, { ColumnsType } from 'antd/es/table'
import { formatCurrency } from '../../utils'
import { ClockCircleOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import { BsCashCoin, BsFillDatabaseFill } from 'react-icons/bs'
import { FaBookReader, FaUserAlt, FaUserTie, FaWallet } from 'react-icons/fa'
import { MdTableRestaurant } from 'react-icons/md'
import { useBill } from '../../hooks/useBill'
import { useParams } from 'react-router-dom'
import { JoinCommandModal } from './Components/JoinCommandModal'
import { FormOfPayment, OrderList } from '../../types'
import api from '../../services/api'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'
import { OpenCashier } from '@renderer/utils/Printers'

const { Text, Title } = Typography
const { Option } = Select
const { confirm } = Modal

//  tipagem dos dados da tabela de formas de pagamento
interface DataFormOfPaymentsType {
  key: string
  type: string
  value: number
  time: string
}

// colunas da tabela de formas de pagamento
const columnsFormOfPayments: ColumnsType<DataFormOfPaymentsType> = [
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    render: (type) => <Tag color="green">{type}</Tag>
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    key: 'value',
    align: 'center',
    render: (value) => formatCurrency(value)
  },
  {
    title: 'Hora',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    render: () => new Date().toLocaleTimeString()
  },
  {
    title: 'Ação',
    key: 'action',
    align: 'center',
    render: () => (
      <Space size="middle">
        <Button type="primary" danger icon={<ImBin />}>
          Cancelar
        </Button>
      </Space>
    )
  }
]

// dados da tabela de formas de pagamento
const dataFormOfPayments: DataFormOfPaymentsType[] = [
  {
    key: '1',
    type: 'Dinheiro',
    value: 32.0,
    time: '10:00'
  },
  {
    key: '2',
    type: 'Cartão',
    value: 42.0,
    time: '10:00'
  }
]

export const Command: React.FC = () => {
  const [visibleJoinCommandModal, setVisibleJoinCommandModal] = useState<boolean>(false)
  const [onTip, setOnTip] = React.useState<boolean>(true)
  const [operatorCode, setOperatorCode] = useState<string>('')
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])
  const { selectedBills, handleDeleteOrder, ordersGroupList, addBill } = useBill()
  const { id } = useParams()

  useEffect(() => {
    // fetchBill(id as string)
    addBill(id as string, true)
    fetchFormOfPayments()
  }, [])

  const columns: ColumnsType<OrderList> = [
    {
      title: 'Nome',
      dataIndex: 'product_title',
      key: 'product_title',
      align: 'center'
    },
    {
      title: 'Preço',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (price) => (
        <Tag
          color="green"
          style={{
            fontSize: '1rem',
            padding: '0.25rem'
          }}
        >
          {formatCurrency(price)}
        </Tag>
      )
    },
    {
      title: 'Qtd',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (amount) => <InputNumber defaultValue={amount} />
    },
    {
      title: 'Ações',
      key: 'action',
      align: 'center',
      render: (r) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            icon={<ImBin />}
            onClick={(): void => {
              showDeleteConfirm({
                id: r.id,
                name: r.product_title,
                amount: r.quantity,
                price: r.total
              })
            }}
          >
            Cancelar
          </Button>
        </Space>
      )
    }
  ]

  function fetchFormOfPayments(): void {
    api
      .get(`/payment-method/`)
      .then((response) => {
        setFormOfPayment(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  const showDeleteConfirm = (props: {
    id: string
    name: string
    price: string
    amount: number
  }): void => {
    confirm({
      title: 'Você tem certeza que quer cancelar o item da comanda?',
      icon: <ExclamationCircleFilled />,
      content: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <Text>
            Nome do item: <strong>{props.name}</strong>
          </Text>
          <Text>
            Preço do item: <strong>{formatCurrency(Number(props.price))}</strong>
          </Text>
          <Text>
            Quantidade: <strong>{props.amount}</strong>
          </Text>

          <div>
            <label
              style={{
                fontWeight: 'bold'
              }}
            >
              {' '}
              Codigo operacional
            </label>
            <Input.Password
              placeholder="Insira o codigo operacional"
              value={operatorCode}
              onChange={(e): void => {
                setOperatorCode(e.target.value)
              }}
            />
          </div>
        </div>
      ),
      okText: 'Confirmar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        handleDeleteOrder(props.id, operatorCode, id as string)
      },
      onCancel() {
        setOperatorCode('')
      }
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: OrderList[]): void => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    }
  }

  const dataTable = ordersGroupList.flatMap((order) => {
    return order.orders
  })

  return (
    <>
      <S.Container>
        <S.RowCards>
          <S.CardInfo>
            <Avatar
              size={48}
              icon={<FaBookReader size={24} />}
              style={{
                backgroundColor: '#2FAA54'
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Comanda:
              </Title>
              <Text
                type="secondary"
                strong
                style={{
                  fontSize: '1.25rem'
                }}
              >
                Nº {selectedBills[0]?.number || 'Não informada'}
              </Text>
            </div>
          </S.CardInfo>
          <S.CardInfo>
            <Avatar
              size={48}
              icon={<MdTableRestaurant size={24} />}
              style={{
                backgroundColor: '#2FAA54'
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Mesa:
              </Title>
              <Text
                type="secondary"
                strong
                style={{
                  fontSize: '1.25rem'
                }}
              >
                Nº {selectedBills[0]?.table_datail?.title || 'Não informada'}
              </Text>
            </div>
          </S.CardInfo>
          <S.CardInfo>
            <Avatar
              size={48}
              icon={<FaUserAlt size={24} />}
              style={{
                backgroundColor: '#2FAA54'
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Garçom:
              </Title>
              <Text
                type="secondary"
                strong
                style={{
                  fontSize: '1.15rem'
                }}
              >
                {selectedBills[0]?.opened_by_name || 'Não informado'}
              </Text>
            </div>
          </S.CardInfo>
          <S.CardInfo>
            <Avatar
              size={48}
              icon={<FaUserTie size={24} />}
              style={{
                backgroundColor: '#2FAA54'
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Cliente:
              </Title>
              <Text
                type="secondary"
                strong
                style={{
                  fontSize: '1.15rem'
                }}
              >
                {selectedBills[0]?.client_name || 'Não informado'}
              </Text>
            </div>
          </S.CardInfo>
        </S.RowCards>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px'
          }}
        >
          <S.ResumeCommand>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Space.Compact style={{ width: 300 }}>
                <Select defaultValue={'percent'}>
                  <Option value="percent">%</Option>
                  <Option value="cash">R$</Option>
                </Select>
                <Input defaultValue="10" />
                <Button
                  type={onTip ? 'primary' : 'dashed'}
                  icon={onTip && <AiOutlineCheckCircle />}
                  onClick={(): void => setOnTip(!onTip)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {onTip ? 'Gorjeta Aplicada' : 'Aplicar Gorjeta'}
                </Button>
              </Space.Compact>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'row'
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={(): void => setVisibleJoinCommandModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  Comanda
                </Button>
                <Button
                  type="primary"
                  icon={<AiFillPrinter size={24} />}
                  onClick={(): void => {
                    OpenCashier({
                      initial_value: '0',
                      opened_by_name: 'teste',
                      restaurant: {
                        id: '1',
                        title: 'teste'
                      }
                    })
                  }}
                  size="large"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  Imprimir
                </Button>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={dataTable}
              pagination={false}
              scroll={{ y: 450 }}
              rowKey={(record): string => record.id as string}
              rowSelection={{
                type: 'checkbox',
                ...rowSelection
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <>
                    <h3>{record.product_title}</h3>
                    {record.note && <p>Observação: {record.note}</p>}
                    {record.complements.map((complement) => (
                      <>
                        <h4>{complement.complement_group_title}</h4>
                        {complement.items.map((item) => (
                          <span key={item.id}>
                            {Number(item.quantity)}-{item.complement_title},{' '}
                          </span>
                        ))}
                      </>
                    ))}
                  </>
                )
              }}
            />

            <S.ActionsPayments>
              {formOfPayment.map((payment) => (
                <Button
                  key={payment.id}
                  type="primary"
                  size="large"
                  style={{
                    flex: 1
                  }}
                >
                  {payment.title}
                </Button>
              ))}
            </S.ActionsPayments>
          </S.ResumeCommand>
          <S.ResumeFinance>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 20
                  }}
                >
                  Valor Total:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {' '}
                  {formatCurrency(120)} <Badge count={<FaWallet style={{ color: '#2FAA54' }} />} />
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 20
                  }}
                >
                  Pago:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {' '}
                  {formatCurrency(120)}{' '}
                  <Badge count={<BsCashCoin style={{ color: '#2FAA54' }} />} />
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 20
                  }}
                >
                  Faltante:
                </Text>{' '}
                <Text
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {formatCurrency(120)}
                  <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />} />
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 20
                  }}
                >
                  Troco:
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {formatCurrency(120)}
                  <Badge count={<BsFillDatabaseFill style={{ color: '#a49d16' }} />} />
                </Text>
              </div>
            </div>
            <div>
              <Table
                columns={columnsFormOfPayments}
                dataSource={dataFormOfPayments}
                pagination={false}
                scroll={{ y: 380 }}
              />
            </div>
            <S.ActionsPayments>
              <Button type="primary" size="large" style={{ flex: 1 }}>
                Finalizar Comanda
              </Button>
            </S.ActionsPayments>
          </S.ResumeFinance>
        </div>
      </S.Container>
      <JoinCommandModal
        visible={visibleJoinCommandModal}
        onCancel={(): void => setVisibleJoinCommandModal(false)}
        billId={id as string}
      />
    </>
  )
}
