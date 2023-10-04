import React from 'react'
import { Typography } from 'antd'
import { formatCurrency } from '@renderer/utils'

const { Title, Paragraph } = Typography

interface ItemCardProps {
  data: ProductSelected
}

type ProductSelected = {
  id: string
  title: string
  quantity: number
  price: number
  total: number
}

export const ItemCard: React.FC<ItemCardProps> = ({ data }) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '8px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
          alignItems: 'center'
        }}
      >
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {data?.quantity}x
          </Title>
        </div>
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {data?.title}
          </Title>
          <Paragraph style={{ margin: 0 }}>{formatCurrency(data?.price)}</Paragraph>
        </div>
      </div>
      <div>
        <Title level={4} style={{ margin: 0 }}>
          {formatCurrency(data?.total)}
        </Title>
      </div>
    </div>
  )
}
