import { SelectCard } from '@renderer/components/SelectCard/SelectCard'
import { theme } from '@renderer/theme'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
  Drawer,
  Divider,
  Space
} from 'antd'
import { TbNewSection } from 'react-icons/tb'
import { FaBoxesPacking } from 'react-icons/fa6'
import React, { useEffect, useState } from 'react'
import { BsArrowDownSquareFill } from 'react-icons/bs'
import api from '@renderer/services/api'
import { PlusOutlined } from '@ant-design/icons'
import { CategoryStock, Stock } from '@renderer/types'
import { on } from 'events'
import { brlToNumber, formatToBRL } from '@renderer/utils'

const { Title, Text } = Typography

interface RegisterStocksProps {
  visible: boolean
  onClose: () => void
  onUpdate: () => void
}

export const DrawerRegister: React.FC<RegisterStocksProps> = ({ onClose, visible, onUpdate }) => {
  const [newStock, setNewStock] = React.useState(false)
  const [typeOfMovement, setTypeOfMovement] = React.useState<'input' | 'output'>('input')
  const [categories, setCategories] = useState<CategoryStock[]>([])
  const [stocks, setStocks] = React.useState<Stock[]>([])
  const [name, setName] = useState('')
  const [form] = Form.useForm()
  const [childrenDrawer, setChildrenDrawer] = useState(false)

  useEffect(() => {
    getStock()
    getCategories()
  }, [visible])

  const onFinish = (values: any): void => {
    if (newStock) {
      createNewStock(values)
    } else {
      createNewTransaction({
        ...values,
        unit_price: values.unit_price ? brlToNumber(values.unit_price) : 0,
        total: !values.unit_price ? 0 : brlToNumber(values.unit_price) * values.quantity,
        quantity: typeOfMovement === 'input' ? values.quantity : -values.quantity
      })
    }
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setCategories([...categories, { id: name, title: name }])
    setName('')
    // setTimeout(() => {
    //   inputRef.current?.focus();
    // }, 0);
  }

  function createNewStock(data: Stock): void {
    api.post('/item-stock/', data).then((response) => {
      onClose()
      form.resetFields()
      onUpdate()
      getCategories()
      setChildrenDrawer(true)
    })
  }

  function createNewTransaction(data: {
    quantity: string
    unit_price: string
    total: string
    notes: string
    item: string
  }): void {
    api.post('/item-stock-transaction/', data).then((response) => {
      form.resetFields()
      onClose()
      onUpdate()
      getCategories()
    })
  }

  function getStock() {
    api.get('/item-stock/').then((response) => {
      setStocks(response.data)
    })
  }

  function getCategories() {
    api.get('/item-stock-category/').then((response) => {
      setCategories(response.data)
    })
  }

  return (
    <Drawer
      title="Registrar estoque ou movimentação"
      placement={'right'}
      width={600}
      closable={true}
      onClose={onClose}
      open={visible}
      key={'right'}
    >
      <Alert
        type="info"
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
        description="Por favor, informe se se trata de um estoque novo ou de um estoque já existente."
        showIcon
        closable
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          justifyContent: 'center',
          padding: '16px 0'
        }}
      >
        <Card
          onClick={(): void => setNewStock(true)}
          key={'1'}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            border:
              (newStock ? '1.5px' : '1px') +
              ' solid ' +
              (newStock ? theme.tokens.colorPrimary : '#ebebeb'),
            cursor: 'pointer'
          }}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            flex: 1,
            height: '100%'
          }}
        >
          <TbNewSection color={newStock ? theme.tokens.colorPrimary : '#ebebeb'} />

          <Title
            level={5}
            style={{
              color: newStock ? theme.tokens.colorPrimary : '#a2a2a2',
              userSelect: 'none'
            }}
          >
            Novo Estoque
          </Title>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#666666'
            }}
          >
            Estoque que não foi registrado no sistema.
          </Text>
        </Card>
        <Card
          onClick={(): void => setNewStock(false)}
          key={'1'}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            border:
              (!newStock ? '1.5px' : '1px') +
              ' solid ' +
              (!newStock ? theme.tokens.colorPrimary : '#ebebeb'),
            cursor: 'pointer'
          }}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            flex: 1,
            height: '100%'
          }}
        >
          <FaBoxesPacking color={!newStock ? theme.tokens.colorPrimary : '#ebebeb'} />

          <Title
            level={5}
            style={{
              color: !newStock ? theme.tokens.colorPrimary : '#a2a2a2',
              userSelect: 'none'
            }}
          >
            Atualizar Estoque
          </Title>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#666666'
            }}
          >
            Estoque que já foi registrado no sistema.
          </Text>
        </Card>
      </div>

      <div>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          {newStock ? (
            <Form.Item label="Nome" name="title">
              <Input placeholder="Digite o nome do estoque." />
            </Form.Item>
          ) : (
            <Form.Item label="Selecione o estoque" name="item">
              <Select
                placeholder="Digite o nome ou escolha as opções."
                options={stocks.map((x) => ({ value: x.id, label: x.title }))}
              />
            </Form.Item>
          )}
          {newStock && (
            <>
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
                  options={categories.map((item) => ({ label: item.title, value: item.title }))}
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
            </>
          )}
          {!newStock && (
            <>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  justifyContent: 'center',
                  padding: '16px 0'
                }}
              >
                <div
                  onClick={(): void => setTypeOfMovement('input')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px',
                    border:
                      (typeOfMovement === 'input' ? '1.5px' : '1px') +
                      ' solid ' +
                      (typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#ebebeb'),
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <TbNewSection
                    color={typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#a2a2a2'}
                  />

                  <Title
                    level={5}
                    style={{
                      color: typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#a2a2a2',
                      userSelect: 'none',
                      margin: 0
                    }}
                  >
                    Entrada
                  </Title>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 13,
                      color: typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#666666',
                      margin: 0
                    }}
                  >
                    Registrar entrada de estoque.
                  </Text>
                </div>
                <div
                  onClick={(): void => setTypeOfMovement('output')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px',
                    border:
                      (typeOfMovement === 'output' ? '1.5px' : '1px') +
                      ' solid ' +
                      (typeOfMovement === 'output' ? '#ed4747' : '#ebebeb'),
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <BsArrowDownSquareFill
                    color={typeOfMovement === 'output' ? '#ed4747' : '#a2a2a2'}
                  />

                  <Title
                    level={5}
                    style={{
                      color: typeOfMovement === 'output' ? '#ed4747' : '#a2a2a2',
                      userSelect: 'none',
                      margin: 0
                    }}
                  >
                    Saída
                  </Title>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 13,
                      color: typeOfMovement === 'output' ? '#ed4747' : '#666666',
                      margin: 0
                    }}
                  >
                    Registrar saída de estoque.
                  </Text>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '15px'
                }}
              >
                <Form.Item
                  label="Movimento do estoque"
                  name="quantity"
                  tooltip="A quantidade de produtos que você está movimentando nessa transação, seja entrada ou saida."
                >
                  {typeOfMovement === 'input' ? (
                    <InputNumber placeholder="0" addonBefore="+" />
                  ) : (
                    <InputNumber placeholder="0" addonBefore="-" />
                  )}
                </Form.Item>

                {typeOfMovement === 'input' && (
                  <Form.Item
                    name="unit_price"
                    label="Valor unitario"
                    tooltip="O quanto você está pagando por cada unidade."
                  >
                    <Input
                      onChange={(e): void => {
                        form.setFieldsValue({
                          unit_price: formatToBRL(e.target.value)
                        })
                      }}
                    />
                  </Form.Item>
                )}
              </div>
              <div>
                <Form.Item
                  label="Anotação"
                  name="notes"
                  tooltip="Caso precise informar algo sobre o estoque que está entrando."
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Deixe alguma notificação para essa remessa."
                  />
                </Form.Item>
              </div>
            </>
          )}
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
      </div>
      {/* <Drawer
        title="Adicionar ingredientes para esse estoque"
        width={600}
        closable={true}
        onClose={() => setChildrenDrawer(false)}
        open={childrenDrawer}
      >
        
      </Drawer> */}
    </Drawer>
  )
}
