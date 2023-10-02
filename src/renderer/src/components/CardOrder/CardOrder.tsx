import React from 'react'
import * as S from './styles'
import { Button, Dropdown, MenuProps, Typography } from 'antd'
import { SlOptionsVertical } from 'react-icons/sl'
import { UserOutlined, ShoppingOutlined } from '@ant-design/icons'
import { BsCash } from 'react-icons/bs'
import { formatCurrency } from '@renderer/utils'

const { Title, Paragraph } = Typography

export const CardOrder: React.FC = () => {
  const items: MenuProps['items'] = [
    {
      label: (
        <p>
          Mover para <b>aceito</b>
        </p>
      ),
      key: '1'
    },
    {
      label: (
        <p>
          Mover para <b>em preparo</b>
        </p>
      ),
      key: '2'
    },
    {
      label: (
        <p>
          Mover para <b>esperando o entregador</b>
        </p>
      ),
      key: '3'
    },
    {
      label: (
        <p>
          Mover para <b>saiu para entrega</b>
        </p>
      ),
      key: '4'
    },
    {
      label: (
        <p>
          Mover para <b>concluido</b>
        </p>
      ),
      key: '5'
    }
  ]

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <S.Container>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 10px'
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            #0001
          </Title>
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button
              size="small"
              type="default"
              icon={<SlOptionsVertical />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                padding: '5px'
              }}
            />
          </Dropdown>
        </header>
        <S.OrderInfo>
          <Paragraph
            style={{
              fontSize: '1rem',
              margin: '0 0 5px 0',
              color: 'rgb(72, 84, 96)'
            }}
          >
            <UserOutlined /> Lucas Carvalho
          </Paragraph>
          <Paragraph
            style={{
              fontSize: '1rem',
              margin: '0 0 5px 0',
              color: 'rgb(72, 84, 96)'
            }}
          >
            <ShoppingOutlined /> Retirada
          </Paragraph>
          <Paragraph
            style={{
              fontSize: '1rem',
              margin: '0 0 5px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'rgb(72, 84, 96)'
            }}
          >
            <BsCash /> Cartão de crédito
          </Paragraph>
        </S.OrderInfo>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Paragraph
            style={{
              fontSize: '0.85rem',
              margin: '0 0 5px 0',
              color: 'rgb(72, 84, 96)'
            }}
          >
            Recebido há 45 minutos
          </Paragraph>
          <Paragraph
            style={{
              fontSize: '1.15rem',
              margin: '0 0 5px 0',
              color: 'rgb(72, 84, 96)',
              fontWeight: 'bold'
            }}
          >
            {formatCurrency(15)}
          </Paragraph>
        </div>
      </S.Container>
    </Dropdown>
  )
}
