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
import { OrderGroupList, OrderList } from '@renderer/types'
import dayjs from 'dayjs'
import { formatCurrency } from '@renderer/utils'
import moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

const { Title, Paragraph } = Typography

interface ModalOrderProps {
  selectedOrder: OrderGroupList | null
  onCancel: () => void
}


const columns: ColumnsType<OrderList> = [
  {
    title: 'Qtd',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (text: string) => <span>{Number(text)}</span>
  },
  {
    title: 'Produto',
    dataIndex: 'product_title',
    key: 'item'
  },
  // {
  //   title: 'Cód.',
  //   dataIndex: 'code',
  //   key: 'code'
  // },
  {
    title: 'Preços',
    dataIndex: 'total',
    key: 'price',
    render: (text: string) => <span>{formatCurrency(Number(text))}</span>
  }
]

export const ModalOrder: React.FC<ModalOrderProps> = ({ selectedOrder, onCancel }) => {
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
            #{selectedOrder?.order_number.toString().padStart(4, '0')}
          </Title>
          <Paragraph
            style={{
              color: 'rgb(72, 84, 96)',
              margin: 0
            }}
          >
            Recebido há {moment(selectedOrder?.created).fromNow()}
          </Paragraph>
        </div>
      }
      open={selectedOrder !== null}
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
              <CalendarOutlined /> {dayjs(selectedOrder?.created).format('DD/MM/YYYY HH:mm')}
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
        dataSource={selectedOrder?.orders}
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
