import React, { useCallback, useEffect } from 'react'
import * as S from './styles'
import { Avatar, Spin, Statistic, Typography } from 'antd'
import {
  FaCalendarCheck,
  FaConciergeBell,
  FaMoneyBillWave,
  FaUserCheck,
  FaUserFriends
} from 'react-icons/fa'
import { formatCurrency } from '@renderer/utils'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import api from '@renderer/services/api'
import dayjs from 'dayjs'

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

export const Dashboard: React.FC = () => {
  const [loadingP, setLoadingP] = React.useState(false)
  const [payments, setPayments] = React.useState<PaymentType[]>([])
  const hasUpdate = React.useRef(false)
  useEffect(() => {
    if (!hasUpdate.current) {
      fecthPayments(dayjs().startOf('month').format(), dayjs().format(), '')
      hasUpdate.current = true
    }
  }, [])
  const fecthPayments = useCallback((startdate: string, endDate: string, cashier?: string) => {
    setLoadingP(true)
    api
      .get(
        `/list-payment/?cashier=${cashier}&datetime_range_after=${startdate}&datetime_range_before=${endDate}`
      )
      .then((response) => {
        setPayments(response.data)
      })
      .finally(() => {
        setLoadingP(false)
      })
  }, [])
  return (
    <S.Container>
      <S.RowMetrics>
        <S.Card>
          <S.CardTitle>
            <div>
              <Avatar
                size={'large'}
                icon={<FaConciergeBell style={{ color: '#0583F2' }} />}
                style={{
                  backgroundColor: '#BEE3F8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
            <Title level={5} style={{ margin: '0', color: '#A0AEC0' }} italic>
              Pedidos Recebidos
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
            <Paragraph strong style={{ margin: '0', fontSize: '1.75rem', color: '#0583F2' }}>
              0
            </Paragraph>
            <Statistic
              value={0}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </div>
        </S.Card>
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
                Rendimento Total
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
                {formatCurrency(payments.reduce((acc, curr) => acc + Number(curr.total), 0))}
              </Paragraph>
              <Statistic
                value={dayjs().format('MMMM/YYYY')}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
                prefix={<FaCalendarCheck />}
              />
            </div>
          </S.Card>
        </Spin>
        <S.Card>
          <S.CardTitle>
            <div>
              <Avatar
                size={'large'}
                icon={<FaUserFriends style={{ color: '#DD6B20' }} />}
                style={{
                  backgroundColor: '#FEEBC8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
            <Title level={5} style={{ margin: '0', color: '#A0AEC0' }} italic>
              Visitas diárias
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
            <Paragraph strong style={{ margin: '0', fontSize: '1.75rem', color: '#DD6B20' }}>
              0
            </Paragraph>
            <Statistic
              value={0}
              precision={2}
              valueStyle={{ color: '#cf1322', fontSize: '0.75rem' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </div>
        </S.Card>
        <S.Card>
          <S.CardTitle>
            <div>
              <Avatar
                size={'large'}
                icon={<FaUserCheck style={{ color: '#8D6ADA' }} />}
                style={{
                  backgroundColor: '#E9D8FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
            <Title level={5} style={{ margin: '0', color: '#A0AEC0' }} italic>
              Gastos com estoque
            </Title>
          </S.CardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'row',
              gap: '0.5rem'
            }}
          >
            <Paragraph strong style={{ margin: '0', fontSize: '1.75rem', color: '#8D6ADA' }}>
              {formatCurrency(0)}{' '}
            </Paragraph>

            <Statistic
              value={0}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </div>
        </S.Card>
      </S.RowMetrics>
      {/* <div
        style={{
          width: '50%',
          height: '350px',
          backgroundColor: '#fff',
          borderRadius: '0.5rem',
          padding: '1rem',
          boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.1)'
        }}
      >
        <ChartBar />
      </div> */}
    </S.Container>
  )
}
