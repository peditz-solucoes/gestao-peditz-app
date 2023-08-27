import { Button, Drawer, Form, Input, Select, Space, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { Printer, Product } from '../../types'
import { useProducts } from '../../hooks'
import api from '@renderer/services/api'
import { errorActions } from '@renderer/utils/errorActions'
import { AxiosError } from 'axios'

interface DrawerFilterProps {
  visible: boolean
  onClose: () => void
  products: Product[]
}

export const DrawerFilterProducts: React.FC<DrawerFilterProps> = ({ visible, onClose }) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [printer, setPrinter] = useState<Printer[]>([])
  const { filterProducts, fetchCategories, categories, setFilteredProducts, products } =
    useProducts()

  useEffect(() => {
    fetchCategories()
    getPrinters()
    setOpen(visible)
  }, [visible])

  const onFinish = (values: any) => {
    filterProducts({
      category: values.category,
      active: values.active,
      listed: values.listed,
      name: values.title,
      printer: values.printer
    })
  }

  function getPrinters() {
    api
      .get('/print/')
      .then((response) => {
        setPrinter(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  function resetForm() {
    form.resetFields()
  }

  function handleResetFilter() {
    resetForm()
    setFilteredProducts(products)
    setOpen(false)
  }

  return (
    <Drawer
      title="Filtre por Produtos"
      placement={'right'}
      closable={true}
      onClose={() => {
        onClose()
        resetForm()
      }}
      open={open}
      key={'right'}
      destroyOnClose
    >
      <Form
        form={form}
        name="filterProducts"
        layout="vertical"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        onFinish={onFinish}
      >
        <div>
          <Form.Item label="Nome do Produto" name="title">
            <Input placeholder="nome" />
          </Form.Item>

          <Form.Item label="Categoria" name="category">
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Selecione uma categoria"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={categories.map((category) => {
                return {
                  value: category.title,
                  label: category.title
                }
              })}
            />
          </Form.Item>

          <Space
            direction="horizontal"
            style={{
              display: 'flex',
              gap: '20px'
            }}
          >
            <Form.Item label="Ativo" name="active" initialValue={true}>
              <Switch checkedChildren="Sim" unCheckedChildren="Não" defaultChecked={true} />
            </Form.Item>

            <Form.Item label="Listado" name="listed" initialValue={true}>
              <Switch checkedChildren="Sim" unCheckedChildren="Não" defaultChecked={true} />
            </Form.Item>
          </Space>
          <Form.Item label="impressoras" name="printer">
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Selecione uma categoria"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={printer.map((print) => {
                return {
                  value: print.name,
                  label: print.name
                }
              })}
            />
          </Form.Item>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <Button danger style={{ flex: 1 }} onClick={handleResetFilter}>
            Resetar filtros
          </Button>
          <Form.Item style={{ flex: 1 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Buscar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  )
}
