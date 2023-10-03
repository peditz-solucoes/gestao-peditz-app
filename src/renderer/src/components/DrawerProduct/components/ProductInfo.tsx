import { Button, Form, FormInstance, Input, InputNumber, Select, Space, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { usePrinter, useProducts } from '../../../hooks'
import { ProductFormData } from '../../../hooks/useProducts'
import Upload, { RcFile, UploadFile, UploadProps } from 'antd/es/upload'
import ImgCrop from 'antd-img-crop'
import { formatToBRL } from '@renderer/utils'

interface ProductInfoProps {
  formRef: React.RefObject<FormInstance>
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ formRef }) => {
  const { categories, createProduct, selectedProduct, patchProduct } = useProducts()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [active, setActive] = useState(false)
  const [listed, setListed] = useState(false)
  const { printers, fetchPrinters } = usePrinter()
  useEffect(() => {
    if (selectedProduct) {
      setActive(selectedProduct?.active ?? true)
      setListed(selectedProduct?.listed ?? true)
      fetchPrinters()
    }
  }, [selectedProduct])

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const onPreview = async (file: UploadFile): Promise<undefined> => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = (): void => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const onFinish = (values: ProductFormData): void => {
    setLoading(true)
    selectedProduct
      ? patchProduct({
          ...selectedProduct,
          ...values,
          price: values.price.replace('R$', '').replace('.', '').replace(',', '.')
        } as ProductFormData).finally(() => setLoading(false))
      : createProduct({
          ...values,
          price: values.price.replace('R$', '').replace('.', '').replace(',', '.')
        }).finally(() => setLoading(false))
  }

  return (
    <>
      <Form layout="vertical" name="product_info" onFinish={onFinish} ref={formRef}>
        <Space>
          <Form.Item name="photo" label="Imagens do produto">
            <ImgCrop rotationSlider>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 5 && '+ Adicionar'}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Space>
        <Space
          direction="vertical"
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Form.Item
            label="Nome"
            name="title"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o nome do produto'
              }
            ]}
          >
            <Input placeholder="Nome do produto" size="large" />
          </Form.Item>
          <Space>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira uma categoria'
                }
              ]}
              required
              label="Categoria"
              name="product_category"
            >
              <Select
                showSearch
                placeholder="Busque e selecione uma categoria"
                optionFilterProp="children"
                filterOption={(input, option): boolean =>
                  (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase())
                }
                filterSort={(optionA, optionB): number =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                size="large"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.title
                }))}
              />
            </Form.Item>
            <Form.Item label="Código Produto" name="codigo_produto">
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Preço"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o preço do produto'
                }
              ]}
              tooltip="Preço padrão que será usado nos terminais e aplicativo do garçom. para definir preços diferente no delivery e outros cardápios, use a aba de preços"
              initialValue={'0'}
              style={{
                width: '100%'
              }}
            >
              <Input
                size="large"
                min={'0' as string}
                style={{
                  width: '100%'
                }}
                onChange={(e): void => {
                  formRef.current?.setFieldsValue({
                    price: formatToBRL(e.target.value)
                  })
                }}
              />
            </Form.Item>
            <Form.Item label="Ordem" name="order" initialValue={0}>
              <InputNumber min={'0' as string} size="large" />
            </Form.Item>
          </Space>
          {/* <Form.Item label="serve quantas pessoas?" name="size" initialValue={1}>
            <Slider defaultValue={0} min={0} max={6} marks={marks} />
          </Form.Item> */}
          <Form.Item label="Codigo de barras" name="ean" tooltip="Codigo de barras do produto">
            <Input size="large" />
          </Form.Item>
          <Space
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '60px'
            }}
          >
            <Form.Item
              label="ativo"
              name="active"
              tooltip="Se o produto está ativo ele está disponivel para lançamento de pedidos"
              initialValue={active}
            >
              <Switch
                onChange={(checked): void => setActive(checked)}
                checked={active}
                checkedChildren="Sim"
                unCheckedChildren="Não"
                defaultChecked
              />
            </Form.Item>
            <Form.Item
              label="Será visualizado no site?"
              name="listed"
              tooltip="Se aparecerá no catalogo online!"
              initialValue={listed}
            >
              <Switch
                checked={listed}
                onChange={(checked): void => setListed(checked)}
                checkedChildren="Sim"
                unCheckedChildren="Não"
                defaultChecked
              />
            </Form.Item>
            <Form.Item
              label="tipo de venda"
              name="type_of_sale"
              required
              tooltip="Se o produto é vendido por peso, medida ou unidade"
            >
              <Select
                // onChange={handleChange}
                defaultValue={'UN'}
                options={[
                  { value: 'KG', label: 'Quilograma' },
                  { value: 'L', label: 'Litro' },
                  { value: 'UN', label: 'Unidade' }
                ]}
              />
            </Form.Item>
            <Form.Item label="Impressora" name="printer" required>
              <Select
                options={printers.map((printer) => ({
                  value: printer.id,
                  label: printer.name
                }))}
              />
            </Form.Item>
          </Space>
          <Form.Item label="Descrição" name="description">
            <Input.TextArea rows={4} placeholder="Descrição do produto" />
          </Form.Item>
        </Space>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Form.Item>
            <Button type="default" size="large" danger style={{ width: '100%' }}>
              Cancelar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%' }}
              loading={loading}
            >
              {selectedProduct ? 'Salvar' : 'Próximo'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  )
}
