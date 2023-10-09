import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography
} from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useProducts } from '../../../hooks'
import { MdCheckCircleOutline, MdDeleteOutline } from 'react-icons/md'
import api from '@renderer/services/api'
import { formatToBRL } from '@renderer/utils'
import { BsPlus } from 'react-icons/bs'
import { CgClose } from 'react-icons/cg'
const { Text } = Typography

export const Prices: React.FC = () => {
  const { selectedProduct } = useProducts()
  const [loading, setLoading] = useState(false)
  const [add, setAdd] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState<string[]>([])
  const [loadingAdds, setLoadingAdds] = useState<string[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [pricesToEdit, setPricesToEdit] = useState<
    {
      id: string
      price: string
      tag: string
    }[]
  >([])
  const [prices, setPrices] = useState<
    {
      id: string
      price: string
      tag: string
    }[]
  >([])
  const formAdd = useRef<FormInstance>(null)

  const fetchPrices = useCallback(() => {
    setLoading(true)
    api
      .get(`product-price/?product=${selectedProduct?.id}`)
      .then((response) => {
        setPrices(response.data)
        setPricesToEdit(
          response.data.map((price) => ({ ...price, price: formatToBRL(price.price) }))
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedProduct])
  useEffect(() => {
    if (selectedProduct) {
      fetchPrices()
    }
  }, [selectedProduct])

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        <Text
          style={{
            marginBottom: '1rem'
          }}
        >
          Crie preços diferentes para esse produto, para diferentes cardápios.
        </Text>
        <Spin spinning={loading}>
          {prices.map((price) => (
            <Form
              layout="vertical"
              key={price.id}
              initialValues={{
                price: formatToBRL(price.price),
                tag: price.tag
              }}
              onFinish={(e): void => {
                setLoadingAdds([...loadingAdds, price.id])
                api
                  .patch(`product-price/${price.id}/`, {
                    price:
                      pricesToEdit
                        .find((p) => p.id === price.id)
                        ?.price?.replace('R$', '')
                        ?.replace('.', '')
                        ?.replace(',', '.') || 0,
                    tag: e.tag
                  })
                  .then(() => {
                    fetchPrices()
                  })
                  .finally(() => {
                    setLoadingAdds(loadingAdds.filter((id) => id !== price.id))
                  })
              }}
            >
              <Space
                style={{
                  gap: '1rem',
                  alignItems: 'flex-end'
                }}
              >
                <Form.Item label="Preço">
                  <Input
                    style={{ width: '100%' }}
                    size="large"
                    value={pricesToEdit.find((p) => p.id === price.id)?.price}
                    onChange={(e): void => {
                      const formattedValue = formatToBRL(e.target.value)
                      setPricesToEdit(
                        pricesToEdit.map((p) => {
                          if (p.id === price.id) {
                            return {
                              ...p,
                              price: formattedValue
                            }
                          }
                          return p
                        })
                      )
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Tag"
                  tooltip="Marcador para localizar o preço do produto no cardápio. NÃO SERÁ VISTO PELO CLIENTE"
                  name="tag"
                  initialValue={price.tag}
                >
                  <Select
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="ex: Cardapio Digital"
                    options={[
                      {
                        label: 'Cardápio Digital',
                        value: 'cardapio_digital'
                      },
                      {
                        label: 'Devlivery',
                        value: 'delivery'
                      }
                    ]}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    onClick={(): void => {
                      setLoadingDelete([...loadingDelete, price.id])
                      api
                        .delete(`product-price/${price.id}/`)
                        .then(() => {
                          fetchPrices()
                        })
                        .finally(() => {
                          setLoadingDelete(loadingDelete.filter((id) => id !== price.id))
                        })
                    }}
                    shape="circle"
                    loading={loadingDelete.includes(price.id)}
                    icon={<MdDeleteOutline />}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    danger
                  ></Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    icon={<MdCheckCircleOutline />}
                    size="large"
                    shape="circle"
                    type="primary"
                  ></Button>
                </Form.Item>
              </Space>
              <Divider />
            </Form>
          ))}
        </Spin>
        {add ? (
          <Form
            layout="vertical"
            ref={formAdd}
            onFinish={(e): void => {
              setLoadingAdd(true)
              api
                .post('product-price/', {
                  price: e.price.replace('R$', '').replace('.', '').replace(',', '.') || 0,
                  tag: e.tag,
                  product: selectedProduct?.id
                })
                .then(() => {
                  setAdd(false)
                  fetchPrices()
                })
                .finally(() => {
                  setLoadingAdd(false)
                })
            }}
          >
            <Space
              style={{
                gap: '1rem',
                alignItems: 'flex-end'
              }}
            >
              <Form.Item
                label="Preço"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o preço'
                  }
                ]}
              >
                <Input
                  onChange={(e): void => {
                    formAdd?.current?.setFieldsValue({
                      price: formatToBRL(e.target.value)
                    })
                  }}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Tag"
                tooltip="Marcador para localizar o preço do produto no cardápio. NÃO SERÁ VISTO PELO CLIENTE"
                name="tag"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira a tag do preço'
                  }
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="ex: Cardapio Digital"
                  options={[
                    {
                      label: 'Cardápio Digital',
                      value: 'cardapio_digital'
                    },
                    {
                      label: 'Devlivery',
                      value: 'delivery'
                    }
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={(): void => {
                    formAdd?.current?.resetFields()
                    setAdd(false)
                  }}
                  size="large"
                  icon={<CgClose size={17} />}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  shape="circle"
                ></Button>
              </Form.Item>
              <Form.Item>
                <Tooltip title="Adicionar preço" placement="right">
                  <Button
                    htmlType="submit"
                    loading={loadingAdd}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    icon={<MdCheckCircleOutline />}
                    size="large"
                    shape="circle"
                    type="primary"
                  ></Button>
                </Tooltip>
              </Form.Item>
            </Space>
          </Form>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Tooltip title="Adicionar novo preço" placement="right">
              <Button
                onClick={(): void => setAdd(true)}
                loading={loadingAdd || loading}
                size="large"
                icon={<BsPlus size={30} />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                shape="circle"
              ></Button>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  )
}
