import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import * as S from './styles'
import {
  Button,
  Card,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Space,
  Switch,
  Tabs,
  Transfer,
  Typography
} from 'antd'
import { DeleteOutlined, SaveOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Product, ProductComplement, ProductComplementItem } from '../../types'
import { useProducts } from '../../hooks'
import api from '@renderer/services/api'
import { DataType, TableComplemts } from './table'
import { IoAdd, IoCheckboxOutline, IoRadioButtonOn } from 'react-icons/io5'
import { FaDivide } from 'react-icons/fa'
import { CgArrowTopRight } from 'react-icons/cg'
import { TransferDirection } from 'antd/es/transfer'
import { SelectCard } from '@renderer/components/SelectCard/SelectCard'

const { Title } = Typography

export const Complements: React.FC = () => {
  const [complements, setComplements] = React.useState<ProductComplement[]>([])
  const [loading, setLoading] = React.useState(false)
  const hasUpdate = React.useRef(false)
  const addFormRef = React.useRef<FormInstance>(null)
  const [input_type, setInputType] = React.useState<string>('')
  const [max_value, setMaxValue] = React.useState<number>(1)
  const [min_value, setMinValue] = React.useState<number>(0)
  const [required, setRequired] = React.useState<boolean>(false)
  const [business_rules, setBusinessRules] = React.useState<string>('')
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const { products, fetchProducts } = useProducts()
  const [drawer, setDrawer] = React.useState(false)
  const [complementToEdit, setComplementToEdit] = React.useState<ProductComplement | null>(null)
  const [loadingToAdd, setLoadingToAdd] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState('1')
  const [dataSource, setDataSource] = React.useState<DataType[]>([])
  const fetchComplements = useCallback(async () => {
    setLoading(true)
    api
      .get('product-complement/')
      .then((response) => {
        setComplements(response.data)
        setDataSource(
          response.data.map((i, key) => ({
            title: i.title,
            key: String(key),
            input_type: i.input_type,
            business_rule: i.business_rules,
            order: i.order,
            complement: {
              complement: i,
              onClick: (complement: ProductComplement): void => {
                setDrawer(true)
                setComplementToEdit(complement)
                addFormRef.current?.setFieldsValue({
                  title: complement.title
                })
                setInputType(complement.input_type)
                setBusinessRules(complement.business_rules)
                setMaxValue(complement.max_value)
                setMinValue(complement.min_value)
                if (complement.min_value > 0) {
                  setRequired(true)
                }
                setTargetKeys(complement.products ?? [])
              }
            }
          }))
        )
        fetchProducts()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!hasUpdate.current) {
      fetchComplements()
    }
  }, [])

  const handleAddComplement = useCallback(
    async (e) => {
      console.log({ ...e, input_type, max_value, min_value, required, business_rules })
      if (input_type && business_rules) {
        if (complementToEdit) {
          setLoadingToAdd(true)
          api
            .patch('product-complement/' + complementToEdit.id + '/', {
              ...e,
              input_type,
              max_value,
              min_value,
              business_rules
            })
            .then((response) => {
              fetchComplements()
              setComplementToEdit(response.data)
            })
            .finally(() => {
              setLoadingToAdd(false)
            })
        } else {
          setLoadingToAdd(true)
          api
            .post('product-complement/', {
              ...e,
              input_type,
              max_value,
              min_value,
              business_rules,
              order: complements.length
            })
            .then((response) => {
              fetchComplements()
              setComplementToEdit(response.data)
              setCurrentTab('2')
            })
            .finally(() => {
              setLoadingToAdd(false)
            })
        }
      }
    },
    [input_type, max_value, min_value, required, business_rules]
  )

  const [complementItens, setComplementItens] = React.useState<ProductComplementItem[]>([])
  const [editing, setEditing] = React.useState<string[]>([])
  const [loadingItems, setLoadingItems] = React.useState(false)
  const fetchComplementItens = useCallback(async () => {
    api
      .get('product-complement-item', {
        params: {
          complementCategory: complementToEdit?.id
        }
      })
      .then((response) => {
        setComplementItens(response.data)
        setEditing([])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoadingItems(false)
      })
  }, [complementToEdit])

  const formItemAdd = useRef<FormInstance>(null)

  const updateComplementItem = useCallback(
    async (item: ProductComplementItem) => {
      setLoadingItems(true)
      api
        .patch('product-complement-item/' + item.id + '/', {
          ...item
        })
        .then(() => {
          const editIndex = editing.findIndex((i) => i === item.id)
          const newEditing = [...editing]
          console.log(newEditing)
          newEditing.splice(editIndex, 1)
          console.log(newEditing)
          setEditing([...newEditing])
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoadingItems(false)
        })
    },
    [editing, complementItens]
  )

  useEffect(() => {
    if (complementToEdit && currentTab === '2') {
      fetchComplementItens()
    }
  }, [complementToEdit, currentTab])

  return (
    <S.Container>
      <S.Header>
        <Button
          type="primary"
          style={{
            backgroundColor: '#2FAA54'
          }}
          size="large"
          onClick={(): void => setDrawer(!drawer)}
        >
          <ShoppingOutlined /> Criar um complemento
        </Button>
      </S.Header>

      <div
        style={{
          padding: '20px'
        }}
      >
        {complements.length > 0 && (
          <TableComplemts
            dataSource={dataSource}
            setDataSource={setDataSource}
            isLoading={loading}
            updateDataSource={(): Promise<void> => fetchComplements()}
          />
        )}
      </div>
      <Drawer
        title={
          complementToEdit ? `Editar complemento ${complementToEdit.title}` : 'Criar complemento'
        }
        onClose={(): void => {
          setDrawer(false)
          setComplementToEdit(null)
          setCurrentTab('1')
          addFormRef.current?.resetFields()
          setInputType('')
          setBusinessRules('')
          setMaxValue(1)
          setMinValue(0)
          setRequired(false)
        }}
        open={drawer}
        width={900}
      >
        <Tabs
          activeKey={currentTab}
          onChange={(key): void => {
            setCurrentTab(key)
          }}
          items={[
            {
              label: 'Configurações',
              children: (
                <div>
                  <Form
                    ref={addFormRef}
                    layout="vertical"
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onFinish={handleAddComplement}
                  >
                    <Form.Item
                      label="Título"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: 'Campo obrigatório'
                        }
                      ]}
                    >
                      <Input size="large" placeholder="Título" />
                    </Form.Item>
                    <SelectCard
                      title="* Selecione o tipo de escolha desse complemento"
                      items={[
                        {
                          label: 'CheckBox',
                          value: 'checkbox',
                          Icon: IoCheckboxOutline,
                          description:
                            'Multipla escolha: O usuário pode escolher mais de um item nesse complemento'
                        },
                        {
                          label: 'Radio',
                          value: 'radio',
                          Icon: IoRadioButtonOn,
                          description:
                            'Única escolha: O usuário pode escolher apenas um item nesse complemento'
                        },
                        {
                          label: 'Número',
                          value: 'number',
                          Icon: IoAdd,
                          description:
                            'Campo Livre: O usuário pode escrever uma quantidade nesse complemento'
                        }
                      ]}
                      selected={input_type}
                      onChange={(e): void => {
                        setInputType(e)
                        if (e === 'radio') {
                          setMaxValue(1)
                          setBusinessRules('maior')
                        } else {
                          setBusinessRules('')
                          setMaxValue(2)
                        }
                      }}
                    />
                    {input_type && input_type !== 'radio' && (
                      <SelectCard
                        title="* Selecione a regra para calcular o valor final do complemento"
                        items={[
                          {
                            label: 'Maior Valor',
                            value: 'maior',
                            Icon: CgArrowTopRight,
                            description:
                              'O valor final do complemento será o maior valor dos items escolhidos pelo usuário'
                          },
                          {
                            label: 'Soma dos Valores',
                            value: 'soma',
                            Icon: IoAdd,
                            description:
                              'O valor final do complemento será a soma dos valores dos items escolhidos pelo usuário'
                          },
                          {
                            label: 'Média dos Valores',
                            value: 'media',
                            Icon: FaDivide,
                            description:
                              'O valor final do complemento será a média dos valores dos items escolhidos pelo usuário'
                          }
                        ]}
                        selected={business_rules}
                        onChange={(e): void => {
                          setBusinessRules(e)
                        }}
                      />
                    )}

                    <Space>
                      <Form.Item label="Complemento obrigatório?">
                        <Switch
                          checked={required}
                          onChange={(e): void => {
                            if (e) {
                              setMinValue(1)
                            } else {
                              setMinValue(0)
                            }
                            setRequired(e)
                          }}
                          size="default"
                          checkedChildren="Sim"
                          unCheckedChildren="Não"
                        />
                      </Form.Item>
                      {input_type !== 'radio' && (
                        <>
                          <>
                            {required && (
                              <Form.Item
                                label="Quantidade mínima"
                                tooltip="Qual a quantidade mínima de itens pode ter esse complemento ? "
                              >
                                <InputNumber
                                  onChange={(e): void => {
                                    setMinValue(e ?? 0)
                                  }}
                                  defaultValue={1}
                                  size="large"
                                  value={min_value}
                                  min={1}
                                  max={max_value}
                                />
                              </Form.Item>
                            )}
                          </>
                          <Form.Item
                            label="Quantidade máxima"
                            tooltip="Qual a quantidade máxima de itens pode ter esse complemento ? "
                          >
                            <InputNumber
                              onChange={(e): void => {
                                if (e && e < min_value) {
                                  setMinValue(e)
                                }
                                if (e && e == 1) {
                                  setInputType('radio')
                                  setBusinessRules('maior')
                                }
                                setMaxValue(e ?? 1)
                              }}
                              value={max_value}
                              defaultValue={2}
                              size="large"
                              min={1}
                            />
                          </Form.Item>
                        </>
                      )}
                    </Space>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px'
                      }}
                    >
                      <Button
                        disabled={!input_type || !business_rules}
                        htmlType="submit"
                        type="primary"
                        size="large"
                        loading={loadingToAdd}
                      >
                        {complementToEdit ? 'Salvar' : 'Cadastar'}
                      </Button>
                    </div>
                  </Form>
                </div>
              ),
              key: '1'
            },
            {
              label: 'Items',
              disabled: complementToEdit === null,
              children: (
                <div>
                  {complementItens.map((item) => (
                    <Card key={item.id} style={{ marginBottom: '1rem' }}>
                      <Form layout="vertical">
                        <Space
                          style={{
                            width: '100%',
                            alignItems: 'flex-end',
                            gap: '1rem'
                          }}
                        >
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                            label="Título"
                          >
                            <Input
                              value={item.title}
                              onChange={(e): void => {
                                const items = [...complementItens]
                                const newValue = item
                                const index = complementItens.findIndex((i) => i.id === item.id)
                                newValue.title = e.target.value
                                items[index] = newValue
                                if (!editing.includes(item.id as string)) {
                                  setEditing([...editing, item.id as string])
                                }
                                setComplementItens([...items])
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Preço"
                            style={{
                              width: '100%'
                            }}
                          >
                            <Input
                              value={item.price}
                              type="number"
                              onChange={(e): void => {
                                const items = [...complementItens]
                                const newValue = item
                                const index = complementItens.findIndex((i) => i.id === item.id)
                                newValue.price = String(e.target.value) ?? 0
                                items[index] = newValue
                                if (!editing.includes(item.id as string)) {
                                  setEditing([...editing, item.id as string])
                                }
                                setComplementItens([...items])
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Quantidade mínima"
                            style={{
                              width: '100%'
                            }}
                          >
                            <InputNumber
                              style={{
                                width: '100%'
                              }}
                              min={0}
                              value={item.min_value}
                              onChange={(e): void => {
                                const items = [...complementItens]
                                const newValue = item
                                const index = complementItens.findIndex((i) => i.id === item.id)
                                newValue.min_value = e ?? 0
                                items[index] = newValue
                                if (!editing.includes(item.id as string)) {
                                  setEditing([...editing, item.id as string])
                                }
                                setComplementItens([...items])
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Quantidade máxima"
                            style={{
                              width: '100%'
                            }}
                          >
                            <InputNumber
                              style={{
                                width: '100%'
                              }}
                              min={0}
                              value={item.max_value}
                              onChange={(e): void => {
                                const items = [...complementItens]
                                const newValue = item
                                const index = complementItens.findIndex((i) => i.id === item.id)
                                newValue.max_value = e ?? 0
                                items[index] = newValue
                                if (!editing.includes(item.id as string)) {
                                  setEditing([...editing, item.id as string])
                                }
                                setComplementItens([...items])
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                          >
                            <Button
                              size="large"
                              icon={<DeleteOutlined />}
                              shape="circle"
                              danger
                            ></Button>
                          </Form.Item>
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                          >
                            <Button
                              size="large"
                              icon={<SaveOutlined />}
                              shape="circle"
                              type={editing.includes(item.id as string) ? 'primary' : 'default'}
                              onClick={(): Promise<void> => updateComplementItem(item)}
                              disabled={!editing.includes(item.id as string)}
                              loading={loadingItems}
                            ></Button>
                          </Form.Item>
                        </Space>
                        <Space>
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                            label="Ativo"
                          >
                            <Switch
                              checked={item.active}
                              onChange={(): void => {
                                const items = [...complementItens]
                                const newValue = item
                                const index = complementItens.findIndex((i) => i.id === item.id)
                                newValue.active = !item.active
                                items[index] = newValue
                                if (!editing.includes(item.id as string)) {
                                  setEditing([...editing, item.id as string])
                                }
                                setComplementItens([...items])
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                            label="Ordem"
                          >
                            <InputNumber
                              value={item.order}
                              onChange={(e): void => {
                                const items = [...complementItens]
                                const newValue = item
                                const index = complementItens.findIndex((i) => i.id === item.id)
                                newValue.order = e ?? 0
                                items[index] = newValue
                                if (!editing.includes(item.id as string)) {
                                  setEditing([...editing, item.id as string])
                                }
                                setComplementItens([...items])
                              }}
                            />
                          </Form.Item>
                        </Space>
                      </Form>
                    </Card>
                  ))}
                  <div>
                    <Card style={{ marginBottom: '1rem' }}>
                      Adicionar item
                      <Form
                        ref={formItemAdd}
                        layout="vertical"
                        onFinish={(e): void => {
                          setLoadingItems(true)
                          console.log(e)
                          api
                            .post('product-complement-item/', {
                              ...e,
                              complementCategory: complementToEdit?.id,
                              active: true,
                              order: complementItens.length,
                              price: String(e.price)
                            })
                            .then((response) => {
                              setComplementItens([...complementItens, response.data])
                              formItemAdd.current?.resetFields()
                            })
                            .finally(() => {
                              setLoadingItems(false)
                            })
                        }}
                      >
                        <Space
                          style={{
                            width: '100%',
                            alignItems: 'flex-end',
                            gap: '1rem'
                          }}
                        >
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                            label="Título"
                            name="title"
                            rules={[
                              {
                                required: true,
                                message: 'Campo obrigatório'
                              }
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            label="Preço"
                            style={{
                              width: '100%'
                            }}
                            name="price"
                            initialValue={'0'}
                          >
                            <Input type="number" />
                          </Form.Item>
                          <Form.Item
                            label="Quantidade mínima"
                            style={{
                              width: '100%'
                            }}
                            name={'min_value'}
                            initialValue={0}
                          >
                            <InputNumber
                              style={{
                                width: '100%'
                              }}
                              min={0}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Quantidade máxima"
                            style={{
                              width: '100%'
                            }}
                            name="max_value"
                            initialValue={0}
                          >
                            <InputNumber
                              style={{
                                width: '100%'
                              }}
                              min={0}
                            />
                          </Form.Item>
                          <Form.Item
                            style={{
                              width: '100%'
                            }}
                          >
                            <Button
                              size="large"
                              icon={<SaveOutlined />}
                              shape="circle"
                              type="primary"
                              htmlType="submit"
                              loading={loadingItems}
                            ></Button>
                          </Form.Item>
                        </Space>
                      </Form>
                    </Card>
                  </div>
                </div>
              ),
              key: '2'
            },
            {
              disabled: complementToEdit === null,
              label: 'Produtos',
              children: (
                <div>
                  <Title level={5}>Selecione os produtos que usarão este complemento.</Title>
                  <div>
                    <Transfer
                      dataSource={products.map((product) => ({ ...product, key: product.id }))}
                      showSearch
                      filterOption={(inputValue: string, option: Product): boolean =>
                        option.category.title
                          .toLowerCase()
                          .trim()
                          .includes(inputValue.toLowerCase().trim()) ||
                        option.title.toLowerCase().trim().includes(inputValue.toLowerCase().trim())
                      }
                      targetKeys={targetKeys}
                      onChange={(newTargetKeys: string[]): void => {
                        setTargetKeys(newTargetKeys)
                      }}
                      onSearch={(dir: TransferDirection, value: string): void => {
                        console.log('search:', dir, value)
                      }}
                      listStyle={{
                        width: '50%',
                        height: 'calc(100vh - 300px)'
                      }}
                      titles={['Produtos', 'Produtos que usarão este complemento']}
                      render={(item): ReactElement => (
                        <Space>
                          <img src={item?.photo} width={30} height={30} />
                          <span
                            style={{
                              fontWeight: 'bold'
                            }}
                          >
                            {item.category.title}
                          </span>{' '}
                          - <span>{item.title}</span>
                        </Space>
                      )}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '20px'
                    }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      loading={loadingToAdd}
                      disabled={targetKeys.length === 0}
                      onClick={(): void => {
                        setLoadingToAdd(true)
                        api
                          .patch('product-complement/' + complementToEdit?.id + '/', {
                            products: targetKeys
                          })
                          .then(() => {
                            fetchComplements()
                          })
                          .finally(() => {
                            setLoadingToAdd(false)
                          })
                      }}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              ),
              key: '3'
            }
          ]}
        />
      </Drawer>
    </S.Container>
  )
}
