import { PlusOutlined } from '@ant-design/icons'
import { useStock } from '@renderer/hooks'
import api from '@renderer/services/api'
import { Button, Divider, Form, FormInstance, Input, Select, Space, Spin, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { BsPlus } from 'react-icons/bs'
import { CgClose } from 'react-icons/cg'
import { MdCheckCircleOutline, MdDeleteOutline } from 'react-icons/md'

export const EditStock: React.FC = () => {
  const {
    categoriesStock,
    setCategoriesStock,
    stockSelected,
    stockRegisteredId,
    getOneStock,
    stocks,
    updateStock
  } = useStock()
  const [name, setName] = useState('')
  const [form] = Form.useForm()
  const [add, setAdd] = useState(false)
  const formAdd = useRef<FormInstance>(null)

  useEffect(() => {
    if (stockSelected) {
      form.setFieldsValue({ ...stockSelected, category: stockSelected?.category_detail?.title })
    }
  }, [stockSelected])

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

  function deleteIngredient(id: string): void {
    api.delete(`/item-ingredient/${id}/`).then(() => {
      getOneStock(stockRegisteredId as string)
    })
  }

  const onFinish = (values: any): void => {
    // createNewStock(values, true)
    console.log(values)
    updateStock({ ...values, id: stockSelected?.id })
  }

  return (
    <div>
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
            gap: '10px'
            // position: 'absolute',
            // bottom: 0
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
      <Divider>Ingredientes do item</Divider>
      <div>
        {stockSelected?.ingredients?.map((ingredient) => (
          <Form
            layout="vertical"
            key={stockSelected.id}
            initialValues={{
              ingredient: ingredient.ingredient,
              quantity: ingredient.quantity
            }}
            onFinish={(e): void => {
              console.log(e)
              // setLoadingAdds([...loadingAdds, price.id])
              // api
              //   .patch(`product-price/${price.id}/`, {
              //     price:
              //       pricesToEdit
              //         .find((p) => p.id === price.id)
              //         ?.price?.replace('R$', '')
              //         ?.replace('.', '')
              //         ?.replace(',', '.') || 0,
              //     tag: e.tag
              //   })
              //   .then(() => {
              //     fetchPrices()
              //   })
              //   .finally(() => {
              //     setLoadingAdds(loadingAdds.filter((id) => id !== price.id))
              //   })
            }}
          >
            <Space
              style={{
                gap: '1rem',
                alignItems: 'flex-end'
              }}
            >
              <Form.Item label="Ingrediente" name="ingredient" initialValue={ingredient.ingredient}>
                <Select
                  size="large"
                  defaultValue={{ value: ingredient.id, label: ingredient.item }}
                  style={{ width: 200 }}
                  options={stocks.map((x) => ({ label: x.title, value: x.id }))}
                />
              </Form.Item>
              <Form.Item
                label="Quantidade"
                tooltip="Quantidate de ingredientes para a receita"
                name="quantity"
                initialValue={ingredient.quantity}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  onClick={(): void => {
                    deleteIngredient(ingredient.id as string)
                  }}
                  shape="circle"
                  // loading={loadingDelete.includes(price.id)}
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
      </div>
      {add ? (
        <Form
          layout="vertical"
          ref={formAdd}
          onFinish={(e): void => {
            console.log(e)
            api
              .post('/item-ingredient/', {
                ingredient: e.ingredient,
                quantity: e.quantity,
                item: stockSelected?.id
              })
              .then(() => {
                setAdd(false)
                getOneStock(stockSelected?.id as string)
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
              label="Ingrediente"
              name="ingredient"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione o ingrediente'
                }
              ]}
            >
              <Select
                size="large"
                style={{ width: 200 }}
                options={stocks.map((x) => ({ label: x.title, value: x.id }))}
              />
            </Form.Item>
            <Form.Item
              label="Quantidade"
              tooltip="Quantidate de ingredientes para a receita"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione o ingrediente'
                }
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={(): void => {
                  // formAdd?.current?.resetFields()
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
                  // loading={loadingAdd}
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
              // loading={loadingAdd || loading}
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
  )
}
