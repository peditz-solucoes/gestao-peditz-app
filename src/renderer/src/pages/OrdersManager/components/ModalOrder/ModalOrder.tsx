import { Button, Divider, Modal, Table } from 'antd'
import React from 'react'
import { Typography } from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  PhoneOutlined,
  WalletOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

const { Title, Paragraph } = Typography

interface ModalOrderProps {
  isModalOpen: boolean
  onCancel: () => void
}

interface DataType {
  key: string
  quantity: number
  item: string
  code: number
  price: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Qtd',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Produto',
    dataIndex: 'item',
    key: 'item'
  },
  {
    title: 'Cód.',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Preços',
    dataIndex: 'price',
    key: 'price'
  }
]

const data: DataType[] = [
  {
    key: '1',
    quantity: 5,
    item: 'Hamburguer de Frango',
    code: 123,
    price: 10.99
  },
  {
    key: '2',
    quantity: 3,
    item: 'Pizza Margherita',
    code: 456,
    price: 7.49
  },
  {
    key: '3',
    quantity: 8,
    item: 'Salmão Grelhado',
    code: 789,
    price: 14.99
  },
  {
    key: '4',
    quantity: 2,
    item: 'Massa Carbonara',
    code: 321,
    price: 5.99
  },
  {
    key: '5',
    quantity: 6,
    item: 'Tacos de Carne Asada',
    code: 654,
    price: 12.49
  },
  {
    key: '6',
    quantity: 4,
    item: 'Sopa de Tomate',
    code: 987,
    price: 9.99
  },
  {
    key: '7',
    quantity: 7,
    item: 'Salada Caesar',
    code: 234,
    price: 8.99
  },
  {
    key: '8',
    quantity: 1,
    item: 'Sanduíche de Peito de Peru',
    code: 567,
    price: 6.49
  },
  {
    key: '9',
    quantity: 10,
    item: 'Tigela de Ramen',
    code: 876,
    price: 19.99
  },
  {
    key: '10',
    quantity: 3,
    item: 'Sobremesa Cheesecake',
    code: 432,
    price: 11.49
  }
]

export const ModalOrder: React.FC<ModalOrderProps> = ({ isModalOpen, onCancel }) => {
  return (
    <Modal
      width={750}
      title={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '30%'
          }}
        >
          <Title level={5} style={{ color: 'rgb(72, 84, 96)', margin: 0 }}>
            #0001
          </Title>
          <Paragraph
            style={{
              color: 'rgb(72, 84, 96)',
              margin: 0
            }}
          >
            Recebido há 4 min
          </Paragraph>
        </div>
      }
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
    >
      <Divider style={{ marginTop: 0, marginBottom: 8 }} />
      <div
        style={{
          width: '100%',
          border: '1px solid rgb(224, 224, 224)',
          borderRadius: '5px',
          padding: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <UserOutlined /> Lucas Carvalho
            </Paragraph>
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <ShoppingOutlined /> Retirada
            </Paragraph>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <PhoneOutlined /> +55 11 99999-9999
            </Paragraph>
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <WalletOutlined /> Dinheiro (Sem troco)
            </Paragraph>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Paragraph style={{ margin: 0, fontSize: '1rem' }}>
              <CalendarOutlined /> 03/10/2023 - 21:44
            </Paragraph>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        scroll={{ y: 240 }}
        pagination={false}
        style={{
          margin: '15px 0'
        }}
        dataSource={data}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Button>Imprimir pedido</Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="default" danger onClick={onCancel}>
            Recusar
          </Button>
          <Button type="primary" style={{ marginRight: '10px' }}>
            Aceitar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
