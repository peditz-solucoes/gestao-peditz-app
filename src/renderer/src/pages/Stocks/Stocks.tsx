import React, { useEffect } from 'react'
import * as S from './styles'
import { Button, Input, Modal, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { DrawerRegister } from './components/DrawerRegister/DrawerRegister'
import { Stock } from '@renderer/types'
import api from '@renderer/services/api'
import { useStock } from '@renderer/hooks'

export const Stocks: React.FC = () => {
  const [visibleModalRegister, setVisibleModalRegister] = React.useState(false)
  const { getStock, stocks, deleteStock, setCurrentTab, setStockRegisteredId, getOneStock } =
    useStock()

  useEffect(() => {
    getStock()
  }, [])

  const columns: ColumnsType<Stock> = [
    {
      title: 'Nome',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: 'Quantidade',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center'
    },
    {
      title: 'Quantidade mínima',
      dataIndex: 'minimum_stock',
      key: 'minimum_stock',
      align: 'center'
    },
    {
      title: 'EAN',
      dataIndex: 'barcode',
      key: 'barcode',
      align: 'center'
    },
    {
      title: 'Unidade de medida',
      dataIndex: 'product_type',
      key: 'product_type',
      align: 'center'
    },
    {
      title: 'Ações',
      key: 'action',
      align: 'center',
      render: (record: Stock) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            justifyContent: 'center'
          }}
        >
          <Button
            type="primary"
            size="small"
            onClick={() => {
              getOneStock(record.id)
              setCurrentTab('3')
              setVisibleModalRegister(true)
            }}
          >
            Editar
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Deseja excluir este estoque?',
                content: 'Esta ação não poderá ser desfeita.',
                okText: 'Excluir',
                cancelText: 'Cancelar',
                onOk: () => deleteStock(record.id as string),
                okType: 'danger'
              })
            }}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ]

  return (
    <>
      <S.Container>
        <S.Header>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px'
            }}
          >
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setVisibleModalRegister(true)}
            >
              Adicionar estoque
            </Button>
            <Input.Search placeholder="Nome do estoque" size="large" />
          </div>
        </S.Header>
        <Table columns={columns} dataSource={stocks} pagination={false} scroll={{ y: 700 }} />
      </S.Container>
      <DrawerRegister
        visible={visibleModalRegister}
        onClose={() => {
          setStockRegisteredId(undefined)
          setCurrentTab('1')
          setVisibleModalRegister(false)
        }}
        onUpdate={() => getStock()}
      />
    </>
  )
}
