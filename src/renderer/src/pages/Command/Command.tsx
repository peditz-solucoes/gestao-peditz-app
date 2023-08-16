import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { Avatar, Badge, Button, Space, Tag, Typography } from 'antd'
import { AiFillPrinter } from 'react-icons/ai'
import { ImBin } from 'react-icons/im'
import Table, { ColumnsType } from 'antd/es/table'
import { formatCurrency } from '../../utils'
import { ClockCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { BsCashCoin, BsFillDatabaseFill } from 'react-icons/bs'
import { FaBookReader, FaUserAlt, FaUserTie, FaWallet } from 'react-icons/fa'
import { MdTableRestaurant } from 'react-icons/md'
import { useBill } from '../../hooks/useBill'
import { useParams } from 'react-router-dom'
import { JoinCommandModal } from './Components/JoinCommandModal'
import { FormOfPayment, OrderList, TaxData } from '../../types'
import api from '../../services/api'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'
import { ModalPayment } from './Components/ModalPayment'
import { ModalConfirmDeleteItem } from './Components/ModalConfirmDeleteItem'
import { BillPrinter } from '@renderer/utils/Printers'
import { NfceEmitModal } from './Components/NfceEmitModal'

const { Text, Title } = Typography

//  tipagem dos dados da tabela de formas de pagamento
interface DataFormOfPaymentsType {
  id: string
  value: number
  title: string
}

export const Command: React.FC = () => {
  // Estado que controla o modal de juntar comandas
  const [visibleJoinCommandModal, setVisibleJoinCommandModal] = useState<boolean>(false)
  // Estado que guarda as formas de pagamento
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])
  // Estado que guarda os produtos que vão ser emitidos nota fiscal
  const [selectedNfce, setSelectedNfce] = useState<TaxData>({} as TaxData)
  // Estado que controla o modal de emitir nota fiscal
  const [visibleModalNfce, setVisibleModalNfce] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [selectExcluseItem, setSelectExcluseItem] = useState<OrderList>({} as OrderList)
  const { selectedBills, orders, addBill, addPayment, payments, DeletePayment } = useBill()
  const { id } = useParams()

  useEffect(() => {
    // fetchBill(id as string)
    addBill(id as string, true)
    fetchFormOfPayments()
  }, [])

  const columnsFormOfPayments: ColumnsType<DataFormOfPaymentsType> = [
    {
      title: 'Tipo',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (title) => <Tag color="green">{title}</Tag>
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      render: (value) => formatCurrency(value)
    },
    {
      title: 'Ação',
      key: 'action',
      align: 'center',
      render: (_, payment) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            shape="circle"
            onClick={() => DeletePayment(payment.id)}
            icon={<DeleteOutlined />}
          />
        </Space>
      )
    }
  ]

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
          {formatCurrency(Number(price))}
        </Tag>
      )
    },
    {
      title: 'Qtd',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (amount) => (
        <Tag
          color="blue"
          style={{
            fontSize: '1rem',
            padding: '0.25rem'
          }}
        >
          {Number(amount)}
        </Tag>
      )
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
            onClick={() => {
              setSelectExcluseItem(r)
              setVisibleModal(true)
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: OrderList[]): void => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)

      const selected: TaxData = {
        payments_methods: [],
        tax_items: selectedRows.map((item) => {
          return {
            product_id: item.product.id as string,
            title: item.product_title,
            quantity: Number(item.quantity),
            price: Number(item.total)
          }
        })
      }

      setSelectedNfce(selected)
    }
  }

  const dataTable = orders.flatMap((order) => {
    return order.orders
  })

  // Resume finance
  const total = orders.map((o) => Number(o.total)).reduce((a, b) => a + b, 0)
  const paid = payments.map((p) => Number(p.value)).reduce((a, b) => a + b, 0)
  const missing = total - paid < 0 ? 0 : total - paid
  const change = paid - total < 0 ? 0 : paid - total

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
                {selectedBills.length > 0
                  ? `Nº ${selectedBills.map((bill) => bill.number).join(', ')}`
                  : 'Não informada'}
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
                {selectedBills.length > 0
                  ? `Nº ${selectedBills.map((bill) => bill.table_datail.title).join(', ')}`
                  : 'Não informada'}
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
                {selectedBills.length > 0
                  ? selectedBills.map((bill) => bill.opened_by_name).join(', ')
                  : 'Não informado'}
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
                {selectedBills.length > 0
                  ? selectedBills.map((bill) => bill.client_name).join(', ')
                  : 'Não informado'}
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
                {/* <Select defaultValue={'percent'}>
                  <Option value="percent">%</Option>
                  <Option value="cash">R$</Option>
                </Select>
                <Input defaultValue="10" /> */}
                {/* <Button
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
                </Button> */}
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
                  onClick={() => BillPrinter()}
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
                {selectedNfce?.tax_items?.length > 0 && (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setVisibleModalNfce(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    Emitir Nfc-e
                  </Button>
                )}
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
                expandedRowRender: (data) => (
                  <>
                    <h3>{data.product_title}</h3>
                    {data.note && <p>Observação: {data.note}</p>}
                    {data.complements.map((complement) => (
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
                  onClick={() => addPayment(payment.id as string)}
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
                  {formatCurrency(total)}{' '}
                  <Badge count={<FaWallet style={{ color: '#2FAA54' }} />} />
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
                  {formatCurrency(paid)}{' '}
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
                  {formatCurrency(missing)}
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
                  {formatCurrency(change)}
                  <Badge count={<BsFillDatabaseFill style={{ color: '#a49d16' }} />} />
                </Text>
              </div>
            </div>
            <div>
              <Table
                columns={columnsFormOfPayments}
                dataSource={payments}
                pagination={false}
                scroll={{ y: 380 }}
                rowKey={(record): string => record.id as string}
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
      <ModalPayment />
      <ModalConfirmDeleteItem
        onClose={() => setVisibleModal(false)}
        visible={visibleModal}
        data={{
          id: selectExcluseItem.id as string,
          name: selectExcluseItem.product_title as string,
          amount: selectExcluseItem.quantity,
          price: selectExcluseItem.total,
          billId: id as string
        }}
      />
      <NfceEmitModal
        onClose={() => setVisibleModalNfce(false)}
        visible={visibleModalNfce}
        data={selectedNfce}
      />
    </>
  )
}
