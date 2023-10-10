import { PlusOutlined } from '@ant-design/icons'
import { useStock } from '@renderer/hooks'
import { Button, Divider, Form, Input, Select, Space } from 'antd'
import React, { useState } from 'react'

export const NewStock: React.FC = () => {
  const { categoriesStock, setCategoriesStock, createNewStock } = useStock()
  const [name, setName] = useState('')
  const [form] = Form.useForm()

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setCategoriesStock([...categoriesStock, { id: name, title: name }])
    setName('')
    // setTimeout(() => {
    //   inputRef.current?.focus();
    // }, 0);
  }

  const onFinish = (values: any): void => {
    createNewStock(values, true)
  }

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.Item label="Nome" name="title">
        <Input placeholder="Digite o nome do estoque." />
      </Form.Item>
      <Form.Item label="Categoria" name="category">
        <Select
          style={{ flex: 1 }}
          placeholder="Busque a categoria ou adicione uma nova."
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="nova categoria."
                  // ref={inputRef}
                  style={{ width: '100%' }}
                  value={name}
                  onChange={onNameChange}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                  Add nova categoria
                </Button>
              </Space>
            </>
          )}
          options={categoriesStock.map((item) => ({ label: item.title, value: item.title }))}
        />
      </Form.Item>
      <Form.Item label="Descrição" name="description">
        <Input.TextArea placeholder="Descrição do estoque" />
      </Form.Item>
      <Form.Item label="Codigo de barras" name="barcode">
        <Input placeholder="Descrição do estoque" />
      </Form.Item>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridGap: '16px'
        }}
      >
        <Form.Item label="Quantidade minima" name="minimum_stock">
          <Input placeholder="0" />
        </Form.Item>
        <Form.Item label="Estoque disponivel" name="stock">
          <Input placeholder="0" />
        </Form.Item>
        <Form.Item label="Tipo de medida" name="product_type">
          <Select
            placeholder="Unidade de medida"
            options={[
              {
                label: 'KG',
                value: 'KG'
              },
              {
                label: 'Litros',
                value: 'L'
              },
              {
                label: 'Unidade',
                value: 'UN'
              },
              {
                label: 'Caixa',
                value: 'CX'
              },
              {
                label: 'Pacote',
                value: 'PCT'
              }
            ]}
          />
        </Form.Item>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: '10px',
          position: 'absolute',
          bottom: 0
        }}
      >
        <Form.Item>
          <Button danger type="default" size="large" style={{ width: 200 }}>
            cancelar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" style={{ width: 200 }}>
            Registrar
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}
