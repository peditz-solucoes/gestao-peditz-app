import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { Badge, Button, Divider, Image, Input, Modal, Select, Spin, Typography } from 'antd'
import { useProducts, useTakeout } from '@renderer/hooks'
import NotImage from '../../assets/sem-imagem.png'
import { formatCurrency } from '@renderer/utils'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { IoMdArrowDropright } from 'react-icons/io'
import CartEmpty from '../../assets/carrinho.png'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

export const Takeout: React.FC = () => {
  const { categories, products, fetchProducts, fetchCategories } = useProducts()
  const [categorySelected, setCategorySelected] = useState<string>('')
  const navigate = useNavigate()
  const { addProductToTakeout, clearTakeout, productsSelected, removeProductToTakeout } =
    useTakeout()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const handleChange = (newValue: string): void => {
    setCategorySelected(newValue)
  }

  const info = (): void => {
    Modal.info({
      title: 'Você tem certeza que deseja limpar o carrinho ?',
      content: (
        <div>
          <p>Ao deletar o carrinho, você não conseguirar recuperá-lo!</p>
        </div>
      ),
      onOk() {
        clearTakeout()
      }
    })
  }

  return (
    <S.Container>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '20px',
            height: 'calc(100vh - 230px)'
          }}
        >
          <S.ContentProducts>
            <S.CategoryProducts>
              <Select
                showSearch
                onChange={handleChange}
                size="large"
                style={{ width: '100%' }}
                placeholder="Filtre os produtos por categoria"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={[
                  { value: '', label: 'Todas' },
                  ...categories.map((c) => ({ label: c.title, value: c.title }))
                ]}
              />
            </S.CategoryProducts>
            <Spin spinning={products.length === 0 ? true : false} size="large">
              <div
                style={{
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  rowGap: '20px',
                  height: 'calc(100vh - 310px)',
                  overflowY: 'scroll'
                }}
              >
                {categorySelected === ''
                  ? products.map((product) => (
                      <Badge
                        key={product.id}
                        color="#2faa54"
                        count={productsSelected.find((x) => x.id === product.id)?.quantity}
                      >
                        <S.CardProduct
                          key={product.id}
                          onClick={() => {
                            console.log(product)
                            addProductToTakeout(product)
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
                            <Paragraph strong ellipsis>
                              {product.title}
                            </Paragraph>
                            <p>{formatCurrency(Number(product.price))}</p>
                          </div>
                        </S.CardProduct>
                      </Badge>
                    ))
                  : products
                      .filter((x) => x.category.title === categorySelected)
                      .map((product) => (
                        <Badge
                          key={product.id}
                          color="#2faa54"
                          count={productsSelected.find((x) => x.id === product.id)?.quantity}
                        >
                          <S.CardProduct
                            key={product.id}
                            onClick={() => {
                              console.log(product)
                              addProductToTakeout(product)
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
            </Spin>
          </S.ContentProducts>
          <S.ContentInfo>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <Button type="link" size="large">
                + Selecionar cliente
              </Button>
            </header>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '70%',
                overflowY: 'scroll',
                paddingBottom: '20px'
              }}
            >
              {productsSelected.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={CartEmpty}
                    style={{
                      width: '200px'
                    }}
                  />
                  <Title level={3}>Seu carrinho está vazio.</Title>
                  <Paragraph>Clique nos produtos para adicioná-los à venda.</Paragraph>
                </div>
              ) : (
                productsSelected.map((product) => (
                  <div
                    key={product.id}
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
                      <S.CountProduct onClick={() => removeProductToTakeout(product.id)}>
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
            <Divider
              style={{
                margin: 0
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <div
                style={{
                  margin: 0,
                  padding: '10px'
                }}
              >
                {productsSelected.length > 0 && (
                  <>
                    {' '}
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Paragraph
                        style={{
                          margin: 0,
                          fontSize: '1rem',
                          color: 'rgb(54, 63, 77)'
                        }}
                      >
                        {productsSelected.length > 1
                          ? `${productsSelected.length} itens`
                          : `${productsSelected.length} item`}
                      </Paragraph>
                      <Paragraph
                        style={{
                          margin: 0,
                          fontSize: '1rem',
                          color: 'rgb(54, 63, 77)'
                        }}
                      >
                        SubTotal:{' '}
                        <b>
                          {formatCurrency(
                            productsSelected.map((x) => x.total).reduce((a, b) => a + b, 0)
                          )}
                        </b>
                      </Paragraph>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <Button
                        type="default"
                        size="large"
                        style={{
                          padding: '0',
                          fontWeight: 'bold',
                          color: '#2faa54',
                          backgroundColor: 'transparent',
                          border: 'none',
                          boxShadow: 'none'
                        }}
                      >
                        Aplicar desconto
                      </Button>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <Title
                        level={4}
                        style={{
                          color: 'rgb(54, 63, 77)'
                        }}
                      >
                        Total:{' '}
                        {formatCurrency(
                          productsSelected.map((x) => x.total).reduce((a, b) => a + b, 0)
                        )}
                      </Title>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '15px',
                padding: '0 10px 10px 10px',
                alignItems: 'flex-end',
                height: `${productsSelected.length === 0 ? '170px' : '70px'}`
              }}
            >
              <Button
                style={{}}
                danger
                type="default"
                disabled={productsSelected.length === 0}
                onClick={info}
                size="large"
                icon={<RiDeleteBin5Fill />}
              />

              <Button
                type="primary"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row-reverse'
                }}
                size="large"
                onClick={(): void => navigate('/pedidos-balcao/pagamentos/')}
                disabled={productsSelected.length === 0}
                icon={<IoMdArrowDropright size={22} />}
              >
                Ir para pagamentos
              </Button>
            </div>
          </S.ContentInfo>
        </div>
      </div>
    </S.Container>
  )
}
