import { theme } from '@renderer/theme'
import { Card, Space, Typography } from 'antd'
import React from 'react'
import { IconType } from 'react-icons'
const { Title, Text } = Typography

interface SelectCardProps {
  items: {
    value: string
    label: string
    description?: string
    Icon?: IconType
  }[]
  selected: string
  onChange: (value: string) => void
  title?: string
}

export const SelectCard: React.FC<SelectCardProps> = ({
  items,
  selected = '',
  onChange,
  title
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom: '1rem'
      }}
    >
      <Text
        style={{
          marginBottom: 10
        }}
      >
        {title}
      </Text>
      <Space
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${items.length}, 1fr)`
        }}
      >
        {items.map((item) => (
          <Card
            onClick={(): void => onChange(item.value)}
            key={item.value}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              border:
                (item.value === selected ? '1.5px' : '1px') +
                ' solid ' +
                (item.value === selected ? theme.tokens.colorPrimary : '#ebebeb'),
              cursor: 'pointer'
            }}
            bodyStyle={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem',
              flex: 1,
              height: '100%'
            }}
          >
            {item.Icon && (
              <item.Icon
                size={24}
                color={item.value === selected ? theme.tokens.colorPrimary : '#ebebeb'}
              />
            )}
            <Title
              level={5}
              style={{
                color: item.value === selected ? theme.tokens.colorPrimary : '#a2a2a2',
                userSelect: 'none'
              }}
            >
              {item.label}
            </Title>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 13,
                color: '#666666'
              }}
            >
              {item.description}
            </Text>
          </Card>
        ))}
      </Space>
    </div>
  )
}
