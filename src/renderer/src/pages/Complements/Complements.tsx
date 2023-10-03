import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import * as S from './styles'
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Radio,
  Space,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Transfer,
  Typography
} from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { Product, ProductComplement } from '../../types'
import { ColumnsType } from 'antd/es/table'
import { useProducts } from '../../hooks'
import api from '@renderer/services/api'
import { TableComplemts } from './table'
import { IoAdd, IoCheckboxOutline, IoRadioButtonOn } from 'react-icons/io5'
import { FaDivide } from 'react-icons/fa'
import { CgArrowTopRight } from 'react-icons/cg'
import { TransferDirection } from 'antd/es/transfer'
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
  const fetchComplements = useCallback(async () => {
    setLoading(true)
    api
      .get('product-complement/')
      .then((response) => {
        setComplements(response.data)
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

  const columns: ColumnsType<ProductComplement> = [
    {
      title: 'Título',
      dataIndex: 'title',
      align: 'center',
      key: 'title'
    },
    {
      title: 'Ordem',
      dataIndex: 'order',
      align: 'center',
      sorter: (a, b): number => {
        return (a.order ?? 0) - (b.order ?? 0)
      },
      sortDirections: ['ascend', 'descend'],
      key: 'order'
    },
    {
      title: 'Tipo',
      dataIndex: 'input_type',
      align: 'center',
      key: 'input_type'
    },
    {
      title: 'Regra',
      dataIndex: 'business_rules',
      align: 'center',
      key: 'business_rules'
    },
    {
      title: 'Ações',
      key: 'action',
      align: 'center',
      render: (record: Product) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            justifyContent: 'center'
          }}
        >
          <Button type="primary" size="small">
            Editar
          </Button>
          <Button type="primary" danger size="small">
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
          <Table
            columns={columns}
            dataSource={complements}
            loading={loading}
            pagination={false}
            scroll={{ y: 'calc(100vh - 220px)' }}
          />
        </div>
        <Drawer
          title={'Cadastrar Complemento'}
          onClose={(): void => setDrawer(!drawer)}
          open={drawer}
          width={'60%'}
        >
          <Tabs
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
                    >
                      <Form.Item label="Título">
                        <Input size="large" placeholder="Título" />
                      </Form.Item>
                      <Space>
                        <Form.Item label="Tipo de entrada">
                          <Radio.Group
                            size="large"
                            value={input_type}
                            onChange={(e): void => {
                              setInputType(e.target.value)
                              if (e.target.value == 'radio') {
                                setMaxValue(1)
                                setBusinessRules('maior')
                              } else {
                                setMaxValue(2)
                              }
                            }}
                          >
                            <Tooltip title="Multipla escolha: O usuário pode escolher mais de um item nesse complemento">
                              <Radio.Button value="checkbox">
                                <IoCheckboxOutline style={{ marginRight: 5 }} /> CheckBox
                              </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Única escolha: O usuário pode escolher apenas um item nesse complemento">
                              <Radio.Button value="radio">
                                <IoRadioButtonOn style={{ marginRight: 5 }} />
                                Radio
                              </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Campo Livre: O usuário pode escrever uma quantidade nesse complemento">
                              <Radio.Button value="number">
                                <IoAdd style={{ marginRight: 5 }} />
                                Número
                              </Radio.Button>
                            </Tooltip>
                          </Radio.Group>
                        </Form.Item>
                        {input_type && input_type !== 'radio' ? (
                          <Form.Item label="Regra">
                            <Radio.Group
                              size="large"
                              value={business_rules}
                              onChange={(e): void => {
                                setBusinessRules(e.target.value)
                              }}
                            >
                              <Tooltip title="O valor final do complemento será o maior valor dos items escolhidos pelo usuário">
                                <Radio.Button value="maio">
                                  <CgArrowTopRight style={{ marginRight: 5 }} /> Maior Valor
                                </Radio.Button>
                              </Tooltip>
                              <Tooltip title="O valor final do complemento será a soma dos valores dos items escolhidos pelo usuário">
                                <Radio.Button value="soma">
                                  <IoAdd style={{ marginRight: 5 }} />
                                  Soma dos Valores
                                </Radio.Button>
                              </Tooltip>
                              <Tooltip title="O valor final do complemento será a média dos valores dos items escolhidos pelo usuário">
                                <Radio.Button value="media">
                                  <FaDivide style={{ marginRight: 5 }} />
                                  Média dos Valores
                                </Radio.Button>
                              </Tooltip>
                            </Radio.Group>
                          </Form.Item>
                        ) : null}
                      </Space>
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
                    </Form>
                  </div>
                ),
                key: '1'
              },
              {
                label: 'Items',
                children: (
                  <div>
                    <TableComplemts />
                  </div>
                ),
                key: '2'
              },
              {
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
                          option.title
                            .toLowerCase()
                            .trim()
                            .includes(inputValue.toLowerCase().trim())
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
                      <Button type="primary" size="large">
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
    </>
  )
}
