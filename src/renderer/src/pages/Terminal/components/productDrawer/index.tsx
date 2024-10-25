import React, { useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, InputNumber, Skeleton, Typography, InputRef } from 'antd'
import api from '../../../../services/api'
import { Product } from '../../../../types'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { CheckBoxComplement } from '../CheckBoxComplement'
import { useTerminal } from '../../../../hooks/useTerminal'
import { NumberComplement } from '../NumberComplement'

interface ProductDrawerProps {
  visible: string
  onClose: () => void
}

interface ComplementItem {
  id: string
  title: string
  price: string
  order: number
  min_value: number
  max_value: number
}

interface ProductComplement {
  id: string
  title: string
  order: number
  active: boolean
  input_type: string
  business_rules: string
  max_value: number
  min_value: number
  product: string
  complement_items: ComplementItem[]
}

interface DataToAdd {
  product_id: string
  quantity: number | string
  product_title: string
  notes: string
  complements: {
    complement_id: string
    complement_title: string
    items: {
      item_id: string
      item_title: string
      quantity: number
    }[]
  }[]
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({ onClose, visible }) => {
  const [product, setProduct] = useState<Product>({} as Product)
  const [productLoading, setProductLoading] = useState(false)
  const [productComplements, setProductComplements] = useState<ProductComplement[]>([])
  const { setCart, cart } = useTerminal()
  const [dataToadd, setDataToAdd] = useState<DataToAdd>({} as DataToAdd)
  const quantityInput = React.useRef<InputRef>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const fetchComplements = (id: string): void => {
    api
      .get(`/product-complement/?products=${id}&active=true`)
      .then((response) => {
        setProductComplements(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const fetchProduct = (id: string): void => {
    setProductLoading(true)
    api
      .get(`/product/${id}/`)
      .then((response) => {
        setProduct(response.data)
        fetchComplements(response.data.id)
        setDataToAdd({
          product_id: response.data.id,
          quantity: response.data.type_of_sale === 'UN' ? 1 : 0,
          notes: '',
          product_title: response.data.title,
          complements: []
        })
        if (quantityInput.current) {
          quantityInput.current.focus()
        }
        if (response.data.type_of_sale === 'UN' && buttonRef.current) {
          buttonRef.current.focus()
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setProductLoading(false)
      })
  }

  useEffect(() => {
    setProduct({} as Product)
    setProductComplements([])
    if (visible) {
      fetchProduct(visible)
    }
  }, [visible])
  return (
    <Drawer
      title={
        productLoading ? (
          <Skeleton.Input active={productLoading} />
        ) : (
          <Typography.Title level={4}>{product.title}</Typography.Title>
        )
      }
      placement="right"
      size={'large'}
      onClose={onClose}
      open={Boolean(visible)}
      closable={false}
    >
      <Form
        layout="vertical"
        size="large"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Form.Item label="Observação">
          <Input.TextArea
            size="large"
            value={dataToadd.notes}
            onChange={(e): void => {
              setDataToAdd({ ...dataToadd, notes: e.target.value })
            }}
          />
        </Form.Item>
        {productComplements.map((complement) => {
          return complement.input_type !== 'number' ? (
            <CheckBoxComplement
              key={complement.id}
              selcteds={
                dataToadd?.complements
                  ?.find((x) => x.complement_id === complement.id)
                  ?.items.map((i) => i.item_id) || []
              }
              onChange={(items): void => {
                const complementIndex = dataToadd.complements.findIndex(
                  (x) => x.complement_id === complement.id
                )
                if (complementIndex === -1) {
                  setDataToAdd({
                    ...dataToadd,
                    complements: [
                      ...dataToadd.complements,
                      {
                        complement_id: complement.id,
                        complement_title: complement.title,
                        items: items.map((i) => ({
                          item_id: i,
                          item_title:
                            complement.complement_items.find((x) => x.id === i)?.title || '',
                          quantity: 1
                        }))
                      }
                    ]
                  })
                } else {
                  const newComplements = dataToadd.complements
                  newComplements[complementIndex].items = items.map((i) => ({
                    item_id: i,
                    item_title: complement.complement_items.find((x) => x.id === i)?.title || '',
                    quantity: 1
                  }))
                  setDataToAdd({
                    ...dataToadd,
                    complements: newComplements
                  })
                }
              }}
              title={complement.title}
              max={complement.max_value}
              items={complement.complement_items.map((item) => ({
                id: item.id,
                title: item.title,
                price: Number(item.price)
              }))}
            />
          ) : (
            <NumberComplement
              max={complement.max_value}
              title={complement.title}
              items={complement.complement_items.map((item) => ({
                item_id: item.id,
                item_title: item.title,
                quantity:
                  dataToadd.complements
                    .find((x) => x.complement_id === complement.id)
                    ?.items.find((x) => x.item_id === item.id)?.quantity || 0,
                item_price: item.price
              }))}
              onChange={(value): void => {
                const complementIndex = dataToadd.complements.findIndex(
                  (x) => x.complement_id === complement.id
                )
                if (complementIndex === -1) {
                  setDataToAdd({
                    ...dataToadd,
                    complements: [
                      ...dataToadd.complements,
                      {
                        complement_id: complement.id,
                        complement_title: complement.title,
                        items: value
                          .map((i) => ({
                            item_id: i.item_id,
                            item_title: i.item_title,
                            quantity: i.quantity
                          }))
                          .filter((x) => x.quantity > 0)
                      }
                    ]
                  })
                } else {
                  const newComplements = dataToadd.complements
                  newComplements[complementIndex].items = value
                    .map((i) => ({
                      item_id: i.item_id,
                      item_title: i.item_title,
                      quantity: i.quantity
                    }))
                    .filter((x) => x.quantity > 0)
                  setDataToAdd({
                    ...dataToadd,
                    complements: newComplements
                  })
                }
              }}
            />
          )
        })}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: 'auto'
          }}
        >
          {product.type_of_sale === 'UN' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem'
              }}
            >
              <Button
                onClick={(): void => {
                  if (Number(dataToadd.quantity) > 1) {
                    setDataToAdd({
                      ...dataToadd,
                      quantity: Number(dataToadd.quantity) - 1
                    })
                  }
                }}
              >
                <MinusOutlined />
              </Button>
              <InputNumber value={dataToadd.quantity} readOnly controls={false} size="large" />

              <Button
                onClick={(): void => {
                  setDataToAdd({
                    ...dataToadd,
                    quantity: Number(dataToadd.quantity) + 1
                  })
                }}
              >
                <PlusOutlined />
              </Button>
            </div>
          ) : (
            <Input
              ref={quantityInput}
              type="number"
              value={dataToadd.quantity}
              onChange={(value): void => {
                setDataToAdd({
                  ...dataToadd,
                  quantity: value.target.value || 0
                })
              }}
              onKeyUp={(e): void => {
                if (e.key === 'Enter') {
                  if (buttonRef.current) {
                    buttonRef.current.focus()
                  }
                }
              }}
              style={{
                width: '40%',
                height: '50px'
              }}
              size="large"
            />
          )}
          <Button
            onClick={(): void => {
              setCart([...cart, dataToadd])
              onClose()
            }}
            disabled={productLoading}
            ref={buttonRef}
            type="primary"
            size="large"
            block
          >
            Adicionar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}
