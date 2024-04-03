import React, { useCallback, useEffect, useState } from 'react'
import * as S from './styles'
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Spin,
  Typography,
  Upload,
  FormInstance,
  Drawer,
  Table
} from 'antd'
import {
  MobileOutlined,
  ReloadOutlined,
  CameraOutlined,
  ExportOutlined,
  LinkOutlined,
  SaveOutlined
} from '@ant-design/icons'
import api from '@renderer/services/api'
import ImgCrop from 'antd-img-crop'
import type { UploadProps } from 'antd/es/upload/interface'
import { theme } from '@renderer/theme'
import { useParams } from 'react-router-dom'
import { CatalogType } from '@renderer/types'
import { ColumnsType, Key } from 'antd/es/table/interface'

const { Title, Text } = Typography
interface ProductInPrice {
  id: string
  title: string
  description: string
  price: string
  listed: true
  type_of_sale: string
  codigo_produto: string
  photo: null
  product_category: {
    id: string
    title: string
  }
  complement_categories: []
}
interface ProductPrice {
  id: string
  product_detail: ProductInPrice
  created: string
  modified: string
  price: string
  tag: string
  product: string
  key: string
}

const columns: ColumnsType<ProductPrice> = [
  {
    title: 'Produto',
    dataIndex: 'product_detail',
    render: (product: ProductInPrice) => <a>{product.title}</a>
  },
  {
    title: 'Categoria',
    dataIndex: 'product_detail',
    key: 'category',
    render: (product: ProductInPrice) => <a>{product?.product_category?.title}</a>
  },
  {
    title: 'Preço',
    dataIndex: 'price'
  },
  {
    title: 'Identificador',
    dataIndex: 'tag',
    filters: [
      {
        text: 'Cardapio Digital',
        value: 'cardapio_digital'
      },
      {
        text: 'Delivery',
        value: 'Category 1'
      }
    ],
    onFilter: (value: string | number | boolean | bigint, record: ProductPrice): boolean => {
      if (typeof value === 'string') {
        return record.tag.includes(value)
      }
      return false
    }
  }
]

export const Catalog: React.FC = () => {
  const [loadingP, setLoadingP] = React.useState(false)
  const hasUpdate = React.useRef(false)
  const [addProductsDrawer, setAddProductsDrawer] = useState(false)
  const [productPrices, setProductPrices] = useState<ProductPrice[]>([])
  const [catalog, setCatalog] = useState<CatalogType | null>(null)
  const props: UploadProps = {
    multiple: false,
    customRequest(options) {
      const data = new FormData()
      const { file } = options
      data.append('photo', file)
      setLoadingP(true)
      api
        .patch(`/catalog-crud/${catalog?.id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          updateIframe(`https://peditz.me/${response.data.restaurant.slug}/${response.data.slug}`)
          options.onSuccess && options?.onSuccess({})
        })
        .finally(() => {
          setLoadingP(false)
        })
    }
  }

  const form = React.useRef<FormInstance>(null)
  const [loading, setLoading] = useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const { Dragger } = Upload
  const updateIframe = useCallback((url: string) => {
    if (iframeRef.current) {
      setLoadingP(true)
      iframeRef.current.src = url
      setTimeout(() => {
        setLoadingP(false)
      }, 500)
    }
  }, [])
  const fecthProductsPrices = useCallback(() => {
    api.get('/product-price/').then((response) => {
      setProductPrices(response.data)
    })
  }, [])
  const [selectedProducts, setSelectedProducts] = useState<ProductPrice[]>()
  const [selectedProductsKey, setSelectedProductsKey] = useState<string[]>()

  const fecthCatalog = useCallback((id: string) => {
    setLoading(true)
    api
      .get(`/catalog-crud/${id}/`)
      .then((response) => {
        setCatalog(response.data)
        updateIframe(`https://peditz.me/${response.data.restaurant.slug}/${response.data.slug}`)
        setSelectedProductsKey(response.data.products_prices)
        form.current?.setFieldsValue(response.data)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      })
  }, [])
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (!hasUpdate.current && id) {
      fecthCatalog(id)
      fecthProductsPrices()
      hasUpdate.current = true
    }
  }, [])
  const saveCatalog = useCallback((values): void => {
    setLoading(true)
    api
      .patch(`/catalog-crud/${id}/`, values)
      .then((response) => {
        updateIframe(`https://peditz.me/${response.data.restaurant.slug}/${response.data.slug}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const rowSelection = {
    onChange: (keys: Key[], selectedRows: ProductPrice[]): void => {
      setSelectedProducts(selectedRows)
      setSelectedProductsKey(keys as string[])
    },
    getCheckboxProps: (record: ProductPrice) => ({
      disabled:
        selectedProducts?.find((p) => p.product_detail.id === record.product_detail.id) &&
        selectedProducts?.find((p) => p.product_detail.id === record.product_detail.id)?.id !==
          record.id,
      name: record.product_detail.id
    })
  }
  const [windowHeight] = React.useState(window.innerHeight)
  return (
    <S.Container>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 0.5fr',
          gap: '1rem'
        }}
      >
        <Spin spinning={loading} size="large">
          <Card>
            <Title level={4}>Organize seu cardápio</Title>
            <Form ref={form} layout="vertical" onFinish={saveCatalog}>
              <ImgCrop rotationSlider aspect={371 / 118}>
                <Dragger
                  disabled={loading || !catalog || loadingP}
                  {...props}
                  style={{
                    width: '100%',
                    height: '50px',
                    marginBottom: '1rem',
                    padding: '0'
                  }}
                  showUploadList={false}
                >
                  <CameraOutlined
                    style={{
                      fontSize: '1.6rem',
                      color: theme.tokens.colorPrimary
                    }}
                  />
                  <p className="ant-upload-text">Clique ou arraste uma foto para seu cardápio</p>
                </Dragger>
              </ImgCrop>
              <Form.Item
                label="Título do cardápio"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Digite o título do cardápio'
                  }
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Descrição" name="description">
                <Input.TextArea size="large" />
              </Form.Item>
              <Form.Item
                label="Link"
                name="slug"
                rules={[
                  {
                    required: true,
                    message: 'Digite o link do cardápio'
                  },
                  {
                    pattern: new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
                    message: 'O link deve conter apenas letras minúsculas e números'
                  }
                ]}
              >
                <Input
                  size="large"
                  addonBefore={`www.peditz.me/${catalog?.restaurant?.slug ?? ''}/`}
                  placeholder="cardapio"
                />
              </Form.Item>
              <Space
                style={{
                  justifyContent: 'center',
                  width: '100%',
                  padding: '4rem 0',
                  gap: '1rem'
                }}
              >
                <Button size="large" onClick={(): void => setAddProductsDrawer(true)}>
                  Editar produtos
                </Button>
                <Button size="large">Editar Complementos</Button>
              </Space>
              <Space
                style={{
                  justifyContent: 'flex-end',
                  width: '100%',
                  padding: '1rem 0 0 0'
                }}
              >
                <Form.Item>
                  <Button
                    loading={loading}
                    size="large"
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                  >
                    Salvar
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </Card>
        </Spin>
        <Spin spinning={loadingP} size="large">
          <Card
            style={{
              backgroundColor: '#fff'
            }}
            bodyStyle={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Space
              style={{
                marginBottom: '1rem',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <Text>
                <MobileOutlined /> Pre-vizualização
              </Text>
              <Button
                onClick={(): void => {
                  updateIframe(`https://peditz.me/${catalog?.restaurant.slug}/${catalog?.slug}`)
                }}
                icon={<ReloadOutlined />}
                shape="circle"
              ></Button>
              <Button
                onClick={(): void => {
                  if (iframeRef.current) {
                    iframeRef.current.src = `https://peditz.me/${catalog?.restaurant.slug}/${catalog?.slug}`
                  }
                }}
                icon={<ExportOutlined />}
                shape="circle"
                type="primary"
              ></Button>
              <Button
                onClick={(): void => {
                  if (iframeRef.current) {
                    iframeRef.current.src = `https://peditz.me/${catalog?.restaurant.slug}/${catalog?.slug}`
                  }
                }}
                icon={<LinkOutlined />}
                shape="circle"
                type="link"
              ></Button>
            </Space>
            <iframe
              style={{
                border: '2px solid #ccc',
                borderRadius: '1rem',
                boxShadow: '0 0 5px #ccc'
              }}
              ref={iframeRef}
              width="375px"
              height="667px"
            />
          </Card>
        </Spin>
        <Drawer
          open={addProductsDrawer}
          width={700}
          onClose={(): void => setAddProductsDrawer(false)}
          title="Adicione Produtos ao seu cardápio"
        >
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedProductsKey,
              ...rowSelection
            }}
            columns={columns}
            pagination={false}
            dataSource={productPrices.map((p) => ({
              ...p,
              key: p.id
            }))}
            scroll={{ y: windowHeight - 250 }}
          />
          <Button
            size="large"
            type="primary"
            onClick={(): void => {
              setLoading(true)
              api
                .patch(`catalog-crud/${id}/`, {
                  products_prices: selectedProductsKey
                })
                .then((response) => {
                  updateIframe(
                    `https://peditz.me/${response.data.restaurant.slug}/${response.data.slug}`
                  )
                  setAddProductsDrawer(false)
                })
                .finally(() => {
                  setLoading(false)
                })
            }}
          >
            Salvar
          </Button>
        </Drawer>
      </div>
    </S.Container>
  )
}
