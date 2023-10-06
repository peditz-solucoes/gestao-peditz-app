import React, { useEffect } from 'react'
import * as S from './styles'
import { Button, Input, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { DrawerRegister } from './components/DrawerRegister/DrawerRegister'
import { Stock } from '@renderer/types'
import api from '@renderer/services/api'

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
  // {
  //   title: 'Ações',
  //   key: 'action',
  //   align: 'center',
  //   render: () => (
  //     <div
  //       style={{
  //         display: 'flex',
  //         flexDirection: 'row',
  //         gap: '8px',
  //         justifyContent: 'center'
  //       }}
  //     >
  //       <Button type="primary" size="small">
  //         Editar
  //       </Button>
  //       <Button type="primary" danger size="small">
  //         Excluir
  //       </Button>
  //     </div>
  //   )
  // }
]

export const Stocks: React.FC = () => {
  const [visibleModalRegister, setVisibleModalRegister] = React.useState(false)
  const [stocks, setStocks] = React.useState<Stock[]>([])

  useEffect(() => {
    getStock()
  }, [])

  function getStock() {
    api.get('/item-stock/').then((response) => {
      setStocks(response.data)
    })
  }

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
        onClose={() => setVisibleModalRegister(false)}
				onUpdate={() => getStock()}
      />
    </>
  )
}
