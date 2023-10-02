import React, { useCallback, useEffect } from 'react'
import * as S from './styles'
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  FormInstance,
  Select,
  Spin,
  Table,
  Tag,
  Typography
} from 'antd'
import { FaCalendarCheck, FaCoins, FaMoneyBillWave } from 'react-icons/fa'
import { formatCurrency } from '@renderer/utils'
import { ChartBar } from './components/ChartBar'
import { PaymentsCards } from './components/PaymentsCards'
import api from '@renderer/services/api'
// import { ChartBar } from './components/ChartBar'
const { RangePicker } = DatePicker
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import { PieChart } from './components/PieChat'
import { ColumnsType, TableProps } from 'antd/es/table'
dayjs.locale('pt-br')
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

const DATE_FORMAT = 'DD/MM/YYYY HH:mm'
const { Title, Paragraph } = Typography
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

type Resumo = {
  label: string
  total: number
}

function organizePayments(payments: PaymentType[]): Resumo[] {
  const groupedPayments: { [key: string]: number } = {}

  for (const payment of payments) {
    const date = dayjs(payment.created)
    const formattedDate = date.format('DD/MM - ddd')

    if (!groupedPayments[formattedDate]) {
      groupedPayments[formattedDate] = 0
    }

    groupedPayments[formattedDate] += parseFloat(payment.total)
  }

  const resumo: Resumo[] = []

  for (const [date, total] of Object.entries(groupedPayments)) {
    resumo.push({
      label: date,
      total: +total.toFixed(2)
    })
  }

  return resumo.sort(
    (a, b) => dayjs(a.label, 'DD/MM - ddd').valueOf() - dayjs(b.label, 'DD/MM - ddd').valueOf()
  )
}

function organizePaymentsByMethod(payments: PaymentType[]): Resumo[] {
  const groupedPayments: { [key: string]: number } = {}

  for (const payment of payments) {
    for (const innerPayment of payment.payments) {
      const method = innerPayment.payment_method_title

      if (!groupedPayments[method]) {
        groupedPayments[method] = 0
      }

      groupedPayments[method] += parseFloat(innerPayment.value)
    }
  }

  const paymentSummary: Resumo[] = []

  for (const [method, total] of Object.entries(groupedPayments)) {
    paymentSummary.push({
      label: method,
      total: +total.toFixed(2)
    })
  }

  return paymentSummary
}

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

const columns: ColumnsType<DataType> = [
  {
    title: 'type',
    dataIndex: 'type',
    width: 100,
    align: 'center'
  },
  {
    title: 'Comandas',
    dataIndex: 'bills',
    align: 'center',
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
    align: 'center',
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
    align: 'center',
    // sorter: {
    //   compare: (a, b) => moment(a.created).unix() - moment(b.created).unix(),
    //   multiple: 2
    // },
    render: (created) => dayjs(created).format('DD/MM/YYYY HH:mm')
  },
  {
    title: 'Total',
    align: 'center',
    dataIndex: 'total'
  },
  {
    title: 'Taxa de serviço',
    align: 'center',
    dataIndex: 'tip'
  }
]
export const FinancialStats: React.FC = () => {
  const [cashiers, setCashiers] = React.useState<CashierType[]>([])
  const [payments, setPayments] = React.useState<PaymentType[]>([])
  const hasUpdate = React.useRef(false)
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight)
  const [loading, setLoading] = React.useState(false)
  const [loadingP, setLoadingP] = React.useState(false)
  const [paymentsData, setPaymentsData] = React.useState<DataType[]>([])
  const fecthPayments = useCallback((startdate: string, endDate: string, cashier?: string) => {
    setLoadingP(true)
    api
      .get(
        `/list-payment/?cashier=${cashier}&datetime_range_after=${startdate}&datetime_range_before=${endDate}`
      )
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
  const fecthCashiers = useCallback(() => {
    setLoading(true)
    api
      .get(`/cashier/`)
      .then((response) => {
        setCashiers(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!hasUpdate.current) {
      fecthCashiers()
      fecthPayments(dayjs().subtract(6, 'day').startOf('day').format(), dayjs().format(), '')
      setWindowHeight(window.innerHeight)
      hasUpdate.current = true
    }
  }, [])
  const formSearch = React.useRef<FormInstance>(null)
  const filterOption = (input: string, option?: { label: string; value: string }): boolean =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }
  return (
    <S.Container>
      <Form
        ref={formSearch}
        onFinish={(e: { date: [string, string]; cashier: string }): void => {
          if (e.cashier) {
            fecthPayments('', '', e.cashier)
          } else {
            fecthPayments(
              dayjs(e.date[0]).startOf('day').format(),
              dayjs(e.date[1]).endOf('day').format(),
              ''
            )
          }
        }}
        initialValues={{
          date: [
            dayjs(dayjs().subtract(6, 'day').startOf('day'), DATE_FORMAT),
            dayjs(dayjs().endOf('day'), DATE_FORMAT)
          ],
          cashier: undefined
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Form.Item name="date">
            <RangePicker
              format={DATE_FORMAT}
              placeholder={['Data inicial', 'Data final']}
              showTime
              size="large"
              allowClear={false}
              disabled={loading || loadingP}
            />
          </Form.Item>
          <Form.Item name="cashier">
            <Select
              loading={loading || loadingP}
              disabled={loading || loadingP}
              showSearch
              size="large"
              placeholder="Buscar por caixa"
              style={{ width: '200px' }}
              allowClear
              filterOption={filterOption}
              options={cashiers.map((cashier) => ({
                label: cashier.identifier + ' ' + dayjs(cashier.created).format('DD/MM/YYYY HH:mm'),
                value: cashier.id
              }))}
            />
          </Form.Item>
          <Form.Item name="cashier">
            <Button htmlType="submit" size="large" loading={loadingP}>
              Buscar
            </Button>
          </Form.Item>
        </div>
      </Form>
      <S.RowMetrics>
        <Spin spinning={loadingP}>
          <S.Card>
            <S.CardTitle>
              <div>
                <Avatar
                  size={'large'}
                  icon={<FaMoneyBillWave style={{ color: '#31AB56' }} />}
                  style={{
                    backgroundColor: '#C6F6D5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
              <Title level={5} style={{ margin: '0', color: '#A0AEC0' }} italic>
                Faturamento Total
              </Title>
            </S.CardTitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}
            >
              <Paragraph strong style={{ margin: '0', fontSize: '1.75rem', color: '#31AB56' }}>
                {formatCurrency(
                  payments.reduce((acc, curr) => {
                    return acc + Number(curr.total)
                  }, 0)
                )}
              </Paragraph>
              {/* <Statistic
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              /> */}
            </div>
          </S.Card>
        </Spin>
      </S.RowMetrics>
      <Spin spinning={loadingP}>
        <PaymentsCards
          data={organizePaymentsByMethod(payments)}
          serviceFee={payments.reduce((acc, curr) => {
            return acc + Number(curr.tip)
          }, 0)}
        />
      </Spin>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 0.5fr 0.5fr',
          gap: '1rem'
        }}
      >
        <Spin spinning={loadingP} size="large">
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              padding: '1rem',
              boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.1)'
            }}
          >
            <ChartBar
              title="Faturamento por dia"
              dataName="Faturamento"
              data={organizePayments(payments)}
            />
          </div>
        </Spin>
        <Spin
          spinning={loadingP}
          size="large"
          style={{
            height: '100%'
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              padding: '1rem',
              height: '100%',
              boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.1)'
            }}
          >
            <PieChart
              title="Fat. por forma de pagamento"
              dataF={organizePaymentsByMethod(payments)}
            />
          </div>
        </Spin>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Spin spinning={loadingP}>
            <S.Card>
              <S.CardTitle>
                <div>
                  <Avatar
                    size={'large'}
                    icon={<FaCalendarCheck style={{ color: '#31AB56' }} />}
                    style={{
                      backgroundColor: '#C6F6D5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </div>
                <Title level={5} style={{ margin: '0', color: '#A0AEC0' }} italic>
                  Dia que mais faturou
                </Title>
              </S.CardTitle>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Paragraph
                  strong
                  style={{ margin: '0', opacity: 0.7, fontSize: '1rem', color: '#31AB56' }}
                >
                  {dayjs(
                    organizePayments(payments).sort((a, b) => Number(b.total) - Number(a.total))[0]
                      ?.label,
                    'DD/MM - ddd'
                  ).format('DD/MM - dddd')}
                </Paragraph>
                <Paragraph
                  strong
                  style={{ margin: '0', fontWeight: 'bold', fontSize: '1.75rem', color: '#31AB56' }}
                >
                  {formatCurrency(
                    Number(
                      organizePayments(payments).sort(
                        (a, b) => Number(b.total) - Number(a.total)
                      )[0]?.total
                    ) || 0
                  )}
                </Paragraph>
              </div>
            </S.Card>
          </Spin>
          <Spin spinning={loadingP}>
            <S.Card>
              <S.CardTitle>
                <div>
                  <Avatar
                    size={'large'}
                    icon={<FaCoins style={{ color: '#31AB56' }} />}
                    style={{
                      backgroundColor: '#C6F6D5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </div>
                <Title level={5} style={{ margin: '0', color: '#A0AEC0' }} italic>
                  Faturamento médio/dia
                </Title>
              </S.CardTitle>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Paragraph
                  strong
                  style={{ margin: '0', fontWeight: 'bold', fontSize: '1.75rem', color: '#31AB56' }}
                >
                  {formatCurrency(
                    Number(
                      organizePayments(payments).reduce(
                        (acc, curr) => acc + Number(curr.total),
                        0
                      ) / organizePayments(payments).length
                    ) || 0
                  )}
                </Paragraph>
              </div>
            </S.Card>
          </Spin>
        </div>
      </div>
      <Table
        loading={loadingP}
        columns={columns}
        dataSource={paymentsData}
        onChange={onChange}
        pagination={false}
        style={{
          marginTop: '1.5rem'
        }}
        scroll={{ y: windowHeight - 220 }}
      />
    </S.Container>
  )
}
