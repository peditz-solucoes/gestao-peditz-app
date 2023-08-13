import { usePrinter } from '@renderer/hooks'
import { Printer } from '@renderer/types'
import Table, { ColumnsType } from 'antd/es/table'
import React, { useEffect } from 'react'
import { Button, Spin } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

export const ListPrinter: React.FC = () => {
  const {
    printers,
    fetchPrinters,
    showModal,
    OnCancelShowModal,
    setCurrentTab,
    deletePrinter,
    isLoading,
    setPrinterId
  } = usePrinter()

  useEffect(() => {
    fetchPrinters()
  }, [showModal])

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
      render: (_, print) => (
        <div
          style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center' }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setPrinterId(print.id as number)
              setCurrentTab('2')
            }}
          />
          <Button
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => deletePrinter(print.id as number)}
          />
        </div>
      )
    }
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <Spin spinning={isLoading}>
        <div>
          <Table
            columns={columns}
            dataSource={printers}
            pagination={false}
            rowKey={(record): number => record.id as number}
          />
        </div>
      </Spin>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px'
        }}
      >
        <Button style={{ flex: 1 }} danger onClick={OnCancelShowModal}>
          Cancelar
        </Button>
        <Button style={{ flex: 1 }} type="primary" onClick={() => setCurrentTab('2')}>
          Registrar impressora
        </Button>
      </div>
    </div>
  )
}
