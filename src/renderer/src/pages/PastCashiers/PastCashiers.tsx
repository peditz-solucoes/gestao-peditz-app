import React, { useCallback, useEffect } from 'react'
import * as S from './styles'
import { Button, Table, TableProps, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import api from '@renderer/services/api'
import { Link } from 'react-router-dom'

interface DataType {
  id: string
  operator: string
  identifier: string
  created: string
  closed: string
  number: number
}

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'number',
    width: 50,
    align: 'center'
  },
  {
    title: 'Identificador',
    dataIndex: 'identifier',
    render: (identifier) => (
      <Tag color={identifier ? 'gold' : 'red'}>{identifier ? identifier : 'Sem idenficador'}</Tag>
    ),
    align: 'center'
  },
  {
    title: 'Operador',
    dataIndex: 'operator',
    align: 'center'
  },
  {
    title: 'Data',
    dataIndex: 'created',
    sorter: {
      compare: (a, b) => moment(a.created).unix() - moment(b.created).unix(),
      multiple: 2
    },
    render: (created) => moment(created).format('DD/MM/YYYY HH:mm'),
    align: 'center'
  },
  {
    title: 'Ação',
    dataIndex: 'id',
    align: 'center',
    render: (a) => (
      <Link to={a}>
        <Button type="primary">Detalhes</Button>
      </Link>
    )
  }
]

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}

export const PastCashiers: React.FC = () => {
  const [cashiers, setCashiers] = React.useState<DataType[]>()
  const hasUpdate = React.useRef(false)
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight)
  const fecthCashiers = useCallback(() => {
    api.get('/cashier/').then((response) => {
      setCashiers(
        response.data.map((cashier, index) => {
          return {
            id: cashier.id,
            identifier: cashier.identifier,
            operator:
              cashier?.opened_by?.first_name + ' ' + cashier?.opened_by?.last_name ||
              cashier.opened_by_name,
            created: cashier.created,
            number: response.data.length - index
          }
        })
      )
    })
  }, [])

  useEffect(() => {
    if (!hasUpdate.current) {
      fecthCashiers()
      setWindowHeight(window.innerHeight)
      hasUpdate.current = true
    }
  }, [fecthCashiers])

  return (
    <S.Container>
      {/* <Typography.Title level={3}>Todos os caixas</Typography.Title> */}
      <Table
        columns={columns}
        dataSource={cashiers}
        onChange={onChange}
        pagination={{
          pageSize: 50,
          position: ['bottomCenter']
        }}
        scroll={{ y: windowHeight - 280 }}
      />
    </S.Container>
  )
}
