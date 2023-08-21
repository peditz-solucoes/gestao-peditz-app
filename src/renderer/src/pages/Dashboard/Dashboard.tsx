import React from 'react'
import * as S from './styles'
import { Avatar, Statistic, Typography } from 'antd'
import { FaConciergeBell, FaMoneyBillWave, FaUserCheck, FaUserFriends } from 'react-icons/fa'
import { formatCurrency } from '@renderer/utils'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { ChartBar } from './components/ChartBar'

const { Title, Paragraph } = Typography

export const Dashboard: React.FC = () => {
  // const data = [
  //   { year: '1991', value: 3 },
  //   { year: '1992', value: 4 },
  //   { year: '1993', value: 3.5 },
  //   { year: '1994', value: 5 },
  //   { year: '1995', value: 4.9 },
  //   { year: '1996', value: 6 },
  //   { year: '1997', value: 7 },
  //   { year: '1998', value: 9 },
  //   { year: '1999', value: 13 }
  // ]

  // const config = {
  //   data,
  //   width: 800,
  //   height: 400,
  //   autoFit: false,
  //   xField: 'year',
  //   yField: 'value',
  //   point: {
  //     size: 5,
  //     shape: 'diamond'
  //   },
  //   label: {
  //     style: {
  //       fill: '#aaa'
  //     }
  //   }
  // }

  // let chart

  // return <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />

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
              1569
            </Paragraph>
            <Statistic
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </div>
        </S.Card>
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
              {formatCurrency(18934)}
            </Paragraph>
            <Statistic
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </div>
        </S.Card>
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
              1569
            </Paragraph>
            <Statistic
              value={11.28}
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
              {formatCurrency(1406)}{' '}
            </Paragraph>

            <Statistic
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </div>
        </S.Card>
      </S.RowMetrics>
      <div
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
      </div>
    </S.Container>
  )
}
