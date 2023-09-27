import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { Avatar, Badge, Button, Form, Image, Input, InputNumber, Select, Space } from 'antd'
import { useProducts } from '@renderer/hooks'
import NotImage from '../../assets/sem-imagem.png'
import { formatCurrency } from '@renderer/utils'
import { FormOfPayment } from '@renderer/types'
import { AxiosError } from 'axios'
import { errorActions } from '@renderer/utils/errorActions'
import api from '@renderer/services/api'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface IProductsSelectds {
  id: string
  title: string
  quantity: number
  price: number
  total: number
}

export const Takeout: React.FC = () => {
  const { categories, products, fetchProducts, fetchCategories } = useProducts()
  const [categorySelected, setCategorySelected] = useState<string>('')
  const [productsSelected, setProductsSelected] = useState<IProductsSelectds[]>([])
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    fetchFormOfPayments()
  }, [])

  function handleAddProduct(id: string, price: string) {
    // já esta selecionado ?
    const productExists = productsSelected.find((x) => x.id === id)
    // se sim, aumenta a quantidade
    if (productExists) {
      productExists.quantity += 1
      productExists.total = productExists.quantity * Number(price)
      setProductsSelected([...productsSelected])
    } else {
      // se não procurar o produto na lista de produtos
      const product = products.find((x) => x.id === id)

      // adicionar na lista de produtos selecionados
      setProductsSelected([
        ...productsSelected,
        {
          id: product?.id as string,
          title: product?.title as string,
          quantity: 1,
          price: Number(price),
          total: Number(price)
        }
      ])
    }
  }

  function handleRemoveProduct(id: string) {
    const productExists = productsSelected.find((x) => x.id === id)
    if (productExists && productExists.quantity > 1) {
      productExists.quantity -= 1
      productExists.total = productExists.quantity * productExists.price
      setProductsSelected([...productsSelected])
    } else {
      setProductsSelected(productsSelected.filter((x) => x.id !== id))
    }
  }

  function fetchFormOfPayments(): void {
    api
      .get(`/payment-method/`)
      .then((response) => {
        setFormOfPayment(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  return (
    <S.Container>
      <S.Header>
        <Input.Search size="large" placeholder="Buscar" />
      </S.Header>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gridGap: '10px'
          }}
        >
          <S.ContentProducts>
            <S.CategoryProducts>
              <S.Title onClick={() => setCategorySelected('')}>Todas</S.Title>
              {categories.map((category) => (
                <S.Title onClick={() => setCategorySelected(category.title)}>
                  {category.title}
                </S.Title>
              ))}
            </S.CategoryProducts>
            <div
              style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                rowGap: '20px'
              }}
            >
              {categorySelected === ''
                ? products.map((product) => (
                    <Badge
                      color="#2faa54"
                      count={productsSelected.find((x) => x.id === product.id)?.quantity}
                    >
                      <S.CardProduct
                        onClick={() => {
                          handleAddProduct(product.id, product.price)
                          console.log(productsSelected)
                        }}
                      >
                        <Image
                          src={product.photo || NotImage}
                          preview={false}
                          style={{
                            width: '100%',
                            height: '50%',
                            borderRadius: '10px 10px 0 0'
                          }}
                        />
                        <div
                          style={{
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}
                        >
                          <h4>{product.title}</h4>
                          <p>{formatCurrency(Number(product.price))}</p>
                        </div>
                      </S.CardProduct>
                    </Badge>
                  ))
                : products
                    .filter((x) => x.category.title === categorySelected)
                    .map((product) => (
                      <Badge
                        color="#2faa54"
                        count={productsSelected.find((x) => x.id === product.id)?.quantity}
                      >
                        <S.CardProduct
                          onClick={() => {
                            handleAddProduct(product.id, product.price)
                          }}
                        >
                          <Image
                            src={product.photo || NotImage}
                            preview={false}
                            style={{
                              width: '100%',
                              height: '40%',
                              borderRadius: '10px 10px 0 0'
                            }}
                          />
                          <div
                            style={{
                              padding: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}
                          >
                            <h4>{product.title}</h4>
                            <p>{formatCurrency(Number(product.price))}</p>
                          </div>
                        </S.CardProduct>
                      </Badge>
                    ))}
            </div>
          </S.ContentProducts>
          <S.ContentInfo>
            <div>
              <div
                style={{
                  width: '100%',
                  borderRadius: '10px 10px 0 0',
                  backgroundColor: '#f2f2f2',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px'
                }}
              >
                <Avatar size={'small'}>1</Avatar>
                <h3>Identifique o cliente</h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100px'
                }}
              >
                <a>
                  <h3>+ Adicionar cliente</h3>
                </a>
              </div>
            </div>
            <div>
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#f2f2f2',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px'
                }}
              >
                <Avatar size={'small'}>2</Avatar>
                <h3>Produtos selecionados</h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  width: '100%'
                }}
              >
                {productsSelected.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100px'
                    }}
                  >
                    <p>Nenhum produto selecionado</p>
                  </div>
                ) : (
                  productsSelected.map((product) => (
                    <div
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #f2f2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        gap: '10px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <S.CountProduct onClick={() => handleRemoveProduct(product.id)}>
                          {product.quantity}
                        </S.CountProduct>
                        <p
                          style={{
                            fontSize: '1rem'
                          }}
                        >
                          {product.title}
                        </p>
                      </div>
                      <p>{formatCurrency(product.total)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#f2f2f2',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px'
                }}
              >
                <Avatar size={'small'}>2</Avatar>
                <h3>Selecionar formas de pagamento</h3>
              </div>
              <div
                style={{
                  padding: '15px'
                }}
              >
                <Form>
                  <Form.List name="payments_methods">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex' }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'forma_pagamento']}
                              rules={[
                                { required: true, message: 'Selecione a forma de pagamento!' }
                              ]}
                            >
                              <Select
                                size="large"
                                showSearch
                                placeholder="Selecione a forma de pagamento"
                                optionFilterProp="children"
                                style={{
                                  width: '250px'
                                }}
                                filterOption={(input, option) =>
                                  (option?.label ?? '').includes(input)
                                }
                                filterSort={(optionA, optionB) =>
                                  (optionA?.label ?? '')
                                    .toLowerCase()
                                    .localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={formOfPayment.map((f) => ({
                                  label: f.title,
                                  value: f.method
                                }))}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'valor_pagamento']}
                              rules={[{ required: true, message: 'Informe o valor pago!' }]}
                            >
                              <InputNumber
                                type="number"
                                placeholder="Valor"
                                controls={false}
                                size="large"
                                style={{
                                  width: '100%'
                                }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Adicionar Forma de pagamentos
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form>
              </div>
            </div>
          </S.ContentInfo>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '15px'
          }}
        >
          <Button style={{ flex: 1 }} danger type='default' size="large">
            Cancelar pedido
          </Button>
          <Button type="primary" style={{ flex: 1 }} size="large">
            Finalizar pedido
          </Button>
        </div>
      </div>
    </S.Container>
  )
}
