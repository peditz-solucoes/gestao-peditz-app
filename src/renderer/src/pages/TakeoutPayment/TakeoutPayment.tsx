import * as S from './styles'
import {
  Avatar,
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  notification
} from 'antd'
import {
  UserOutlined,
  WhatsAppOutlined,
  MailOutlined,
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { formatCurrency, formatToBRL } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { errorActions } from '@renderer/utils/errorActions'
import { FormOfPayment } from '@renderer/types'
import api from '@renderer/services/api'
import { AxiosError } from 'axios'
import { useTakeout } from '@renderer/hooks'
import { ItemCard } from './components/ItemCard'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

export const TakeoutPayment: React.FC = () => {
  const [notificationApi, contextHolder] = notification.useNotification()
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])
  const [form] = Form.useForm()
  const [error, setError] = useState<string>('')
  const { productsSelected, clearTakeout } = useTakeout()
  const navigate = useNavigate()

  useEffect(() => {
    fetchFormOfPayments()
  }, [])

  function handleRedirectWpp() {
    window.open('https://api.whatsapp.com/send?phone=559981248041&text=', '_blank')
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText('lucassdeveloper@gmail.com')
    notificationApi.info({
      message: `Email copiado para a área de transferência`,
      placement: 'top',
      duration: 3
    })
  }

  const onFinish = (values: any) => {
    console.log(values.payments_methods)
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

  const info = () => {
    Modal.info({
      title: 'Você tem certeza que deseja limpar o carrinho ?',
      content: (
        <div>
          <p>Ao deletar o carrinho, você não conseguirar recuperá-lo!</p>
        </div>
      ),
      onOk() {
        handleCancelOrder()
      }
    })
  }

  function handleCancelOrder() {
    clearTakeout()
    navigate('/pedidos-balcao/')
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label:
        productsSelected?.length > 1
          ? `${productsSelected?.length} Items`
          : `${productsSelected?.length} Item`,
      children: productsSelected.map((product) => (
        <ItemCard
          key={product.id}
          data={{
            id: product.id,
            title: product.title,
            quantity: product.quantity,
            price: product.price,
            total: product.total
          }}
        />
      ))
    }
  ]

  return (
    <>
      {contextHolder}
      <S.Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem'
          }}
        >
          <S.Spacer>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
                Cliente selecionado
              </Title>
              <Button
                type="default"
                icon={<CloseOutlined />}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none'
                }}
              />
            </div>
            <div
              style={{
                backgroundColor: '#F7F7F8',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <Avatar
                  size={'large'}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#4faa6b' }}
                />
                <Title level={5} style={{ color: 'rgb(54, 63, 77)', margin: 0 }}>
                  Lucas Carvalho
                </Title>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1.25rem',
                  alignItems: 'center'
                }}
              >
                <Tooltip title="Encaminhar para o whatsapp">
                  <Paragraph
                    strong
                    onClick={handleRedirectWpp}
                    style={{ fontSize: '1rem', color: '#4faa6b', margin: 0, cursor: 'pointer' }}
                  >
                    <WhatsAppOutlined /> +55 (11) 99999-9999
                  </Paragraph>
                </Tooltip>
                <Tooltip title="Copiar email">
                  <Paragraph
                    strong
                    onClick={handleCopyToClipboard}
                    style={{ fontSize: '1rem', color: '#4faa6b', margin: 0, cursor: 'copy' }}
                  >
                    <MailOutlined /> +55 (11) 99999-9999
                  </Paragraph>
                </Tooltip>
              </div>
            </div>
          </S.Spacer>
          <S.Spacer>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
                Resumo do pedido
              </Title>
              <Button
                type="default"
                icon={<CloseOutlined />}
                danger
                onClick={info}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                Cancelar pedido
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <Paragraph style={{ color: 'rgb(54, 63, 77)', fontSize: '1rem', margin: 0 }}>
                Subtotal dos produtos:
              </Paragraph>
              <Title level={4} style={{ margin: 0, color: 'rgb(54, 63, 77)' }}>
                {formatCurrency(124.9)}
              </Title>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Paragraph style={{ color: 'rgb(54, 63, 77)', fontSize: '1rem', margin: 0 }}>
                Descontos:
              </Paragraph>
              <Tag
                color="red"
                closable
                style={{
                  fontSize: '1rem',
                  padding: '5px',
                  margin: 0
                }}
              >
                {formatCurrency(15)} - (10%)
              </Tag>
            </div>
            <Divider />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Title level={3} style={{ color: 'rgb(54, 63, 77)', margin: 0 }}>
                Total
              </Title>
              <Title level={4} style={{ margin: 0, color: 'rgb(54, 63, 77)' }}>
                {formatCurrency(124.9)}
              </Title>
            </div>
          </S.Spacer>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem'
          }}
        >
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Observações
            </Title>
            <Input.TextArea placeholder="Alguma observação para o pedido" rows={4} />
            <Checkbox
              style={{
                marginTop: '1rem'
              }}
            >
              Exibir na impressão
            </Checkbox>
          </S.Spacer>
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Formas de pagamento
            </Title>
            <Form form={form} onFinish={onFinish}>
              <Form.List name="payments_methods">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
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
                          <Input
                            placeholder="Valor"
                            onChange={(e): void => {
                              form.setFieldsValue({
                                valor_pagamento: formatToBRL(e.target.value)
                              })
                            }}
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
                        Adicionar Pagamento
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </S.Spacer>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem'
          }}
        >
          <S.Spacer>
            {/* <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              2 Items
            </Title> */}
            <Collapse size="large" expandIconPosition="right" items={items} />
          </S.Spacer>
        </div>
      </S.Container>
    </>
  )
}
