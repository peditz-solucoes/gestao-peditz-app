import { usePrinter } from '@renderer/hooks'
import { Printer } from '@renderer/types'
import Table, { ColumnsType } from 'antd/es/table'
import React, { useEffect } from 'react'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const columns: ColumnsType<Printer> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
    align: 'center'
  },
  {
    title: 'Ativada',
    dataIndex: 'active',
    key: 'active',
    align: 'center',
    render: (text) => <p>{text ? 'Sim' : 'Não'}</p>
  },
  {
    title: 'Largura',
    dataIndex: 'paper_width',
    key: 'paper_width',
    align: 'center',
    render: (text) => <p>{text}mm</p>
  },
  {
    title: 'Ações',
    dataIndex: 'actions',
    key: 'actions',
    align: 'center',
    render: (text) => <div>
      <Button type="primary" shape="circle" icon={<EditOutlined />} />
      <Button type="primary" shape="circle" icon={<EditOutlined />} />
    </div>
  }
]

export const ListPrinter: React.FC = () => {
  const { printers, fetchPrinters, showModal } = usePrinter()

  useEffect(() => {
    fetchPrinters()
  }, [showModal])

  return <Table columns={columns} dataSource={printers} pagination={false} />
}
