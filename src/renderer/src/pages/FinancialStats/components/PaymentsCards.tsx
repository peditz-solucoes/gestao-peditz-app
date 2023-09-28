import { Statistic, Typography } from 'antd'
import React from 'react'
const { Text } = Typography
import {
  FaChartPie,
  FaCoins,
  FaMoneyBillAlt,
  FaPercentage,
  FaQrcode,
  FaRegCreditCard,
  FaUsers
} from 'react-icons/fa'
import * as S from './styles'
import { Icon } from '@renderer/components/Icon'
import { formatCurrency } from '@renderer/utils'

interface PaymentType {
  data: {
    label: string
    total: number
  }[]
  serviceFee: number
}
const colors = [
  {
    color: '#4C0677',
    backgroundColor: '#a981c4'
  },
  {
    color: '#0583F2',
    backgroundColor: '#A7D7F7'
  },
  {
    color: '#2FAA54',
    backgroundColor: '#C6F6D5'
  },
  {
    color: '#DD6B20',
    backgroundColor: '#FEEBC8'
  },
  {
    color: '#F43F5E',
    backgroundColor: '#FECDD3'
  }
]

const icons = [
  {
    form: 'PIX',
    icon: <FaQrcode size={24} />
  },
  {
    form: 'Dinheiro',
    icon: <FaMoneyBillAlt size={24} />
  },
  {
    form: 'Cartão',
    icon: <FaRegCreditCard size={24} />
  },
  {
    form: 'Conveniado',
    icon: <FaUsers size={24} />
  }
]

export const PaymentsCards: React.FC<PaymentType> = ({ data, serviceFee }) => {
  return (
    <S.CardsInfoFinance>
      {data.map((item, key) => (
        <S.CardInfoFinance key={item.label}>
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
              icon={
                icons.find((icon) => icon.form === item.label.split(' ')[0])?.icon || <FaCoins />
              }
              style={{
                color: colors[key]?.color || '#0583F2',
                backgroundColor: colors[key]?.backgroundColor || '#A7D7F7',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                textTransform: 'capitalize'
              }}
            />
            {item.label.split(' ')[item.label.split(' ').length - 1]}
          </Text>
          <Text
            strong
            style={{
              fontSize: '24px',
              color: colors[key]?.color || '#0583F2'
            }}
          >
            {formatCurrency(item.total)}
          </Text>
          <Statistic
            value={(item.total / data.reduce((acc, curr) => acc + curr.total, 0)) * 100}
            precision={2}
            valueStyle={{ color: '#3f8600', fontSize: '0.75rem' }}
            prefix={<FaChartPie />}
            suffix="%"
          />
        </S.CardInfoFinance>
      ))}

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
          {formatCurrency(serviceFee || 0)}
        </Text>
      </S.CardInfoFinance>
    </S.CardsInfoFinance>
  )
}
