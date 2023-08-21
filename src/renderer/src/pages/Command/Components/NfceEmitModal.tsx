import { FormOfPayment, TaxData } from '@renderer/types'
import {
  Alert,
  Button,
  Divider,
  Form,
  InputNumber,
  Modal,
  Select,
  Space,
  Typography
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { errorActions } from '@renderer/utils/errorActions'
import api from '@renderer/services/api'
import { formatCurrency } from '@renderer/utils'

const { Title } = Typography

interface NfceEmitModalProps {
  onClose: () => void
  visible: boolean
  data: TaxData
}

export const NfceEmitModal: React.FC<NfceEmitModalProps> = ({ data, onClose, visible }) => {
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [linkNfce, setLinkNfce] = useState<string>('')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchFormOfPayments()
  }, [])

  const products = data.tax_items?.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity
  }))

  const onFinish = (values: {
    payments_methods: { forma_pagamento: string; valor_pagamento: number }[]
  }) => {
    console.log(values.payments_methods)
    if (!values.payments_methods) {
      setError('Informe os dados de pagamento!')
      return
    }

    const totalPriceProduct = data.tax_items.map((item) => item.price).reduce((a, b) => a + b, 0)
    const totalPricePayment = values.payments_methods
      .map((item) => item.valor_pagamento)
      .reduce((a, b) => a + b, 0)

    if (totalPricePayment !== totalPriceProduct) {
      console.log(totalPricePayment, totalPriceProduct)
      setError('O valor total dos pagamentos não é igual ao valor total dos produtos!')
      return
    }

    handleEmitNfce(values)
  }

  function handleEmitNfce(values: any) {
    setIsLoading(true)
    api
      .post('/tax/', {
        tax_items: products,
        ...values
      })
      .then((response) => {
        setError('')
        setLinkNfce(response.data.link)
        window.open(response.data.link, '_blank')
      })
      .catch((error: AxiosError) => {
        if (error.response?.data as { detail: string }) {
          setError((error.response?.data as { detail: string }).detail)
        }
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
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
    <Modal
      open={visible}
      onCancel={() => {
        setError('')
        setLinkNfce('')
        form.resetFields()
        onClose()
      }}
      footer={null}
      title="Emitir NFC-e"
    >
      <div
        style={{
          paddingBottom: '10px'
        }}
      >
        <Title level={5} italic>
          Produtos selecionados:
        </Title>
        {data.tax_items?.map((item) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>
              {item.quantity} - {item.title}
            </span>{' '}
            <span>{formatCurrency(item.price)}</span>
          </div>
        ))}
      </div>
      <Divider orientation="right">
        Valor Total:{' '}
        {formatCurrency(data?.tax_items?.map((item) => item.price).reduce((a, b) => a + b, 0))}
      </Divider>
      <div>
        <Form
          form={form}
          name="form_of_payment"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.List name="payments_methods">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'forma_pagamento']}
                      rules={[{ required: true, message: 'Selecione a forma de pagamento!' }]}
                    >
                      <Select
                        size="large"
                        showSearch
                        placeholder="Selecione a forma de pagamento"
                        optionFilterProp="children"
                        style={{
                          width: '250px'
                        }}
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={formOfPayment.map((f) => ({ label: f.title, value: f.method }))}
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
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{
                      margin: '15px 0'
                    }}
                  />
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={isLoading}
                      disabled={linkNfce ? true : false}
                    >
                      {!isLoading ? 'Emitir Nfc-e' : 'Estamos emitindo a nota fiscal...'}
                    </Button>
                  </Form.Item>
                  {linkNfce && (
                    <Button
                      type="default"
                      size="large"
                      onClick={() => window.open(linkNfce, '_blank')}
                    >
                      Abrir Nfc-e
                    </Button>
                  )}
                </div>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </Modal>
  )
}
