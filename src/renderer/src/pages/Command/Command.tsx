import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { Avatar, Badge, Button, Empty, Input, Select, Space, Tag, Typography, message } from 'antd'
import { AiFillPrinter, AiOutlineCheckCircle } from 'react-icons/ai'
import { ImBin } from 'react-icons/im'
import Table, { ColumnsType } from 'antd/es/table'
import { brlToNumber, formatCurrency, formatToBRL } from '../../utils'
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
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
import { Option } from 'antd/es/mentions'
import { ModalCloseBill } from './Components/ModalCloseBill'

const discounts = [
  {
    code: 'DESC10',
    value: 10
  }
]

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
  const { selectedBills, orders, addBill, addPayment, payments, DeletePayment, fetchBill } =
    useBill()
  const [tipInput, setTipInput] = useState<string>('10')
  const [tipApply, setTipApply] = useState<boolean>(false)
  const [onTip, setOnTip] = useState<number>(0)
  const [typeOnTip, setTypeOnTip] = useState<string>('percent')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [visibleModalCloseBill, setVisibleModalCloseBill] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)
  const { id } = useParams()

  useEffect(() => {
    addBill(id as string, true)
    fetchFormOfPayments()
    setHeight(window.innerHeight)
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
      title: 'Qtd',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 80,
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
      title: 'Produto',
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
      title: 'Responsável',
      key: 'collaborator_name',
      align: 'center',
      render: (r) => <Tag icon={<UserOutlined />}>{r.collaborator_name}</Tag>
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
            disabled={!selectedBills[0]?.open}
            icon={<ImBin />}
            onClick={() => {
              setSelectExcluseItem(r)
              setVisibleModal(true)
            }}
          ></Button>
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

  function handleApplyPayment(): void {
    setIsLoading(true)
    api
      .post('/payment/', {
        bills: selectedBills.map((bill) => bill.id),
        pyments_methods: payments.map((payment) => ({ id: payment.id, value: payment.value })),
        discount: Number(discount.toFixed(2))
      })
      .then(() => {
        window.location.reload()
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handlePrint(): void {
    BillPrinter({
      discount: discount,
      number: `${selectedBills.map((bill) => bill.number).join(', ')}`,
      serviceTax: onTip,
      total: Number((total - onTip).toFixed(2)),
      subtotal: Number(total.toFixed(2)),
      permanenceTime: selectedBills[0].created,
      products: orders
        .map((order) => {
          return order.orders.map((product) => {
            return {
              title: product.product?.title,
              quantity: Number(product.quantity),
              price: Number(product.total),
              complementItems: product.complements.map((complement) => {
                return complement.items.map((item) => {
                  return { title: item.complement_title, quantity: item.quantity }
                })
              })
            }
          })
        })
        .flatMap((product) => product) as any
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: OrderList[]): void => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)

      const selected: TaxData = {
        payments_methods: [],
        tax_items: selectedRows.map((item) => {
          return {
            product_id: item.id as string,
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
    return order.orders.flatMap((product) => {
      return {
        ...product,
        collaborator_name: order.collaborator_name
      }
    })
  })

  const [discount, setDiscount] = useState<number>(0)
  // Resume finance
  const subTotal = orders.map((o) => Number(o.total)).reduce((a, b) => a + b, 0)
  const total = orders.map((o) => Number(o.total)).reduce((a, b) => a + b, 0) + onTip - discount
  const paid = payments.map((p) => Number(p.value)).reduce((a, b) => a + b, 0)
  const missing = Number((total - paid).toFixed(2))
  const [discountCode, setDiscountCode] = useState<string>('')

  function handleTip(): void {
    const input = brlToNumber(tipInput)
    if (!tipApply) {
      setTipApply(true)
      if (typeOnTip === 'percent') {
        setOnTip((Number(input) / 100) * total)
      } else {
        setOnTip(Number(input))
      }
    } else {
      setTipApply(false)
      setOnTip(0)
    }
  }

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
                {selectedBills.length > 0 &&
                selectedBills.map((bill) => bill.table_datail.title).length > 0
                  ? `Nº ${selectedBills.map((bill) => bill.table_datail.title)}`
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
                  ? Array.from(new Set(selectedBills.map((bill) => bill.opened_by_name)))
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
                {selectedBills.length > 0 &&
                selectedBills.map((bill) => bill.client_name).filter((name) => name !== '').length >
                  0
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
          <S.ResumeCommand billOpen={selectedBills[0]?.open}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: `${selectedBills[0]?.open ? 'space-between' : 'flex-end'}`,
                alignItems: 'center'
              }}
            >
              {selectedBills[0]?.open && (
                <Space.Compact style={{ width: 300 }}>
                  <Select
                    defaultValue={'percent'}
                    onChange={(value) => {
                      setTipInput('')
                      setTipApply(false)
                      setOnTip(0)
                      setTypeOnTip(value)
                    }}
                  >
                    <Option value="percent">%</Option>
                    <Option value="cash">R$</Option>
                  </Select>
                  <Input
                    defaultValue={tipInput}
                    value={tipInput}
                    onChange={(e) =>
                      typeOnTip === 'cash'
                        ? setTipInput(formatToBRL(e.target.value))
                        : setTipInput(e.target.value)
                    }
                    style={{
                      width: '100px'
                    }}
                  />
                  <Button
                    type={tipApply ? 'primary' : 'dashed'}
                    icon={tipApply && <AiOutlineCheckCircle />}
                    disabled={tipInput === ''}
                    onClick={() => {
                      handleTip()
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      justifyContent: 'center'
                    }}
                  >
                    {!tipApply && 'Aplicar gorjeta'}
                  </Button>
                </Space.Compact>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'row'
                }}
              >
                {!tipApply && (
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
                )}
                <Button
                  type="primary"
                  icon={<AiFillPrinter size={24} />}
                  onClick={handlePrint}
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

            {!selectedBills[0]?.open && (
              <Empty
                description={
                  <>
                    <Title level={4}>Comanda fechada</Title>
                  </>
                }
              />
            )}
            <Table
              columns={columns}
              dataSource={dataTable}
              pagination={false}
              scroll={{ y: selectedBills[0]?.open ? height - 550 : 250 }}
              rowKey={(record): string => record.id as string}
              rowSelection={{
                type: 'checkbox',
                ...rowSelection
              }}
              expandable={{
                showExpandColumn: selectedBills[0]?.open,
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
                  disabled={!selectedBills[0]?.open}
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
          {selectedBills.length > 0 && selectedBills[0]?.open && (
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
                    SubTotal:
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
                    {formatCurrency(subTotal)}{' '}
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
                    Taxa de serviço:
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {formatCurrency(onTip)}{' '}
                    <Badge count={<BsFillDatabaseFill style={{ color: '#a49d16' }} />} />
                  </Text>
                </div>
                {discount > 0 && (
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
                      Desconto:
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: 'red'
                      }}
                    >
                      -{formatCurrency(discount)}{' '}
                      <Badge count={<BsFillDatabaseFill style={{ color: '#a49d16' }} />} />
                    </Text>
                  </div>
                )}

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
                    Total:
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
                    Restante:
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
                    {missing < 0 ? formatCurrency(0) : formatCurrency(missing)}{' '}
                    <Badge count={<FaWallet style={{ color: '#2FAA54' }} />} />
                  </Text>
                </div>
                <Input
                  placeholder="Desconto"
                  value={discountCode}
                  onChange={(e): void => {
                    setDiscount(0)
                    setDiscountCode(e.target.value)
                  }}
                  suffix={
                    <Button
                      size="small"
                      onClick={(): void => {
                        const discontValue = discounts.find((d) => d.code === discountCode)?.value
                        if (!discontValue) {
                          message.error('Código de desconto inválido')
                          return
                        }
                        const dis = (discontValue / 100) * total
                        setDiscount(dis > total ? total : dis)
                      }}
                      disabled={discount > 0 || !discountCode}
                    >
                      Aplicar
                    </Button>
                  }
                />
              </div>
              <div>
                <Table
                  columns={columnsFormOfPayments as []}
                  dataSource={payments}
                  pagination={false}
                  scroll={{ y: 'calc(100vh - 4em)' }}
                  rowKey={(record): string => record.id as string}
                />
              </div>

              <S.ActionsPayments>
                <Button
                  danger
                  type="primary"
                  size="large"
                  style={{ flex: 1 }}
                  onClick={() => setVisibleModalCloseBill(true)}
                >
                  Fechar Comanda
                </Button>

                <Button
                  type="primary"
                  size="large"
                  style={{ flex: 1 }}
                  onClick={handleApplyPayment}
                  loading={isLoading}
                  disabled={missing > 0}
                >
                  Finalizar Comanda
                </Button>
              </S.ActionsPayments>
            </S.ResumeFinance>
          )}
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
      <ModalCloseBill
        visible={visibleModalCloseBill}
        onClose={() => setVisibleModalCloseBill(false)}
        onFetch={() => fetchBill(id as string)}
        billId={id as string}
      />
    </>
  )
}
