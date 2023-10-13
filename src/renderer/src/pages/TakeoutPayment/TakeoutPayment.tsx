import * as S from './styles'
import {
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
  Switch,
  Tooltip,
  Typography,
  notification
} from 'antd'
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  LeftOutlined,
  PrinterOutlined
} from '@ant-design/icons'
import { formatCurrency, formatToBRL } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { errorActions } from '@renderer/utils/errorActions'
import { FormOfPayment } from '@renderer/types'
import api from '@renderer/services/api'
import { AxiosError } from 'axios'
import { useTakeout } from '@renderer/hooks'
import { ItemCard } from './components/ItemCard'
import { Link, useNavigate } from 'react-router-dom'
import { FaCashRegister } from 'react-icons/fa'
import { OrderTakeOut, ResumTakeout } from '@renderer/utils/Printers'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography

export const TakeoutPayment: React.FC = () => {
  const [, contextHolder] = notification.useNotification()
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment[]>([] as FormOfPayment[])
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  // const [error, setError] = useState<string>('')
  const { productsSelected, clearTakeout } = useTakeout()
  const navigate = useNavigate()
  const [printAgain, setPrintAgain] = useState(
    localStorage.getItem('peditz-print-reciept') === 'ativo'
  )
  const [formOfPayments, setFormOfPayments] = useState<
    {
      id: string
      value: string
    }[]
  >([])

  // function handleRedirectWpp() {
  //   window.open('https://api.whatsapp.com/send?phone=559981248041&text=', '_blank')
  // }

  // function handleCopyToClipboard() {
  //   navigator.clipboard.writeText('lucassdeveloper@gmail.com')
  //   notificationApi.info({
  //     message: `Email copiado para a área de transferência`,
  //     placement: 'top',
  //     duration: 3
  //   })
  // }

  const onFinish = (values): void => {
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

  const info = (): void => {
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

  function handleCancelOrder(): void {
    clearTakeout()
    navigate('/pedidos-balcao/')
  }

  function brlToNumber(value: string): number {
    return Number(value.replace('R$', '').replace('.', '').replace(',', '.'))
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

  useEffect(() => {
    fetchFormOfPayments()
    if (productsSelected.length === 0) {
      handleCancelOrder()
    }
  }, [])
  const [notes, setNotes] = useState<string>('')

  return (
    <>
      {contextHolder}
      <S.Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Link to={'/pedidos-balcao/'}>
            <Button size="large" type="link" icon={<LeftOutlined />}>
              Voltar
            </Button>
          </Link>
          <Space>
            <Tooltip title="Imprimir 2 vias do comprovante">
              <Switch
                checkedChildren={'Sim'}
                unCheckedChildren="Não"
                onChange={(e): void => {
                  localStorage.setItem('peditz-print-reciept', e ? 'ativo' : 'FALSO')
                  setPrintAgain(e)
                }}
                checked={printAgain}
              />
            </Tooltip>
            <Button
              size="large"
              type="primary"
              icon={<PrinterOutlined />}
              onClick={(): void => {
                ResumTakeout({
                  number: 'Pédido não finalizado',
                  code: '---',
                  date: dayjs().format('DD/MM/YYYY'),
                  total: productsSelected.reduce((acc, item) => acc + item.total, 0),
                  recebido: formatCurrency(
                    formOfPayments.reduce((acc, item) => acc + brlToNumber(item.value), 0)
                  ),
                  payment: formOfPayments
                    .map((f) => formOfPayment.find((pm) => pm.id === f.id)?.title)
                    .join(', '),
                  items: productsSelected.map((p) => ({
                    items: [],
                    product_price: String(p.price),
                    notes: '',
                    product_title: p.title,
                    printer_name: 'caixa',
                    product_id: p.id,
                    quantity: p.quantity
                  })),
                  atendente: ''
                })
              }}
            >
              Imprimir
            </Button>
          </Space>
        </div>
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
            <Collapse bordered={false} size="large" expandIconPosition="right" items={items} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: '10px 0'
              }}
            >
              <Paragraph style={{ color: 'rgb(54, 63, 77)', fontSize: '1rem', margin: 0 }}>
                Subtotal dos produtos:
              </Paragraph>
              <Title level={4} style={{ margin: 0, color: 'rgb(54, 63, 77)' }}>
                {formatCurrency(productsSelected.reduce((acc, item) => acc + item.total, 0))}
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
                {formatCurrency(productsSelected.reduce((acc, item) => acc + item.total, 0))}
              </Title>
            </div>
          </S.Spacer>
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Formas de pagamento
            </Title>
            <Form form={form} onFinish={onFinish}>
              {formOfPayments.map((form, key) => (
                <Space key={form.id} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item>
                    <Select
                      size="large"
                      showSearch
                      placeholder="Selecione a forma de pagamento"
                      optionFilterProp="children"
                      value={form.id}
                      onChange={(value): void => {
                        setFormOfPayments((prev) => {
                          const newFormOfPayments = [...prev]
                          newFormOfPayments[key].id = value
                          return newFormOfPayments
                        })
                      }}
                      style={{
                        width: '250px'
                      }}
                      filterOption={(input, option): boolean =>
                        (option?.label ?? '').includes(input)
                      }
                      filterSort={(optionA, optionB): number =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={formOfPayment.map((f) => ({
                        label: f.title,
                        value: f.id
                      }))}
                    />
                  </Form.Item>
                  <Form.Item rules={[{ required: true, message: 'Informe o valor pago!' }]}>
                    <Input
                      placeholder="Valor"
                      size="large"
                      style={{
                        width: '100%'
                      }}
                      value={form.value}
                      onChange={(e): void => {
                        setFormOfPayments((prev) => {
                          const newFormOfPayments = [...prev]
                          newFormOfPayments[key].value = formatToBRL(e.target.value)
                          return newFormOfPayments
                        })
                      }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={(): void => {
                      setFormOfPayments((prev) => {
                        const newFormOfPayments = [...prev]
                        newFormOfPayments.splice(key, 1)
                        return newFormOfPayments
                      })
                    }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={(): void => {
                    setFormOfPayments([...formOfPayments, { id: '', value: '' }])
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Adicionar Pagamento
                </Button>
              </Form.Item>
              <Form.Item
                style={{
                  marginTop: '3rem'
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<FaCashRegister />}
                  loading={loading}
                  onClick={(): void => {
                    const order_items = productsSelected.map((product) => ({
                      product_id: product.id,
                      quantity: product.quantity,
                      notes: '',
                      product_title: product.title,
                      complements: []
                    }))
                    const payment_methods = formOfPayments.map((form) => ({
                      id: form.id,
                      value: brlToNumber(form.value)
                    }))
                    setLoading(true)
                    api
                      .post('/take-out/', {
                        order_items,
                        payment_methods,
                        notes
                      })
                      .then((response) => {
                        OrderTakeOut(
                          response.data.restaurant.title,
                          String(response.data?.takeout_order).padStart(4, '0'),
                          response.data.order_items,
                          notes,
                          response.data?.collaborator_name || '',
                          response.data?.created || ''
                        )
                        setTimeout(() => {
                          ResumTakeout({
                            number: String(response.data.order_number),
                            code: String(response.data?.takeout_order).padStart(4, '0'),
                            date: dayjs().format('DD/MM/YYYY'),
                            total: Number(response.data.total),
                            recebido: formatCurrency(
                              formOfPayments.reduce((acc, item) => acc + brlToNumber(item.value), 0)
                            ),
                            payment: formOfPayments
                              .map((f) => formOfPayment.find((pm) => pm.id === f.id)?.title)
                              .join(', '),
                            items: response.data.order_items,
                            atendente: response.data?.collaborator_name || ''
                          })
                          if (printAgain) {
                            ResumTakeout({
                              number: String(response.data.order_number),
                              code: String(response.data?.takeout_order).padStart(4, '0'),
                              date: dayjs().format('DD/MM/YYYY'),
                              total: Number(response.data.total),
                              recebido: formatCurrency(
                                formOfPayments.reduce(
                                  (acc, item) => acc + brlToNumber(item.value),
                                  0
                                )
                              ),
                              payment: formOfPayments
                                .map((f) => formOfPayment.find((pm) => pm.id === f.id)?.title)
                                .join(', '),
                              items: response.data.order_items,
                              atendente: response.data?.collaborator_name || ''
                            })
                          }
                        }, 300)
                        clearTakeout()

                        navigate('/pedidos-balcao/')
                        notification.success({
                          message: 'Pedido realizado com sucesso!',
                          placement: 'topRight',
                          duration: 3
                        })
                      })
                      .catch((error: AxiosError) => {
                        errorActions(error)
                        notification.error({
                          message: 'Erro ao realizar pedido!',
                          placement: 'topRight',
                          duration: 3
                        })
                      })
                      .finally(() => {
                        setLoading(false)
                      })
                  }}
                  disabled={
                    productsSelected.length === 0 ||
                    formOfPayments.length === 0 ||
                    formOfPayments.reduce((acc, item) => acc + brlToNumber(item.value), 0) <
                      brlToNumber(
                        formatCurrency(productsSelected.reduce((acc, item) => acc + item.total, 0))
                      )
                  }
                >
                  Finalizar Venda
                </Button>
              </Form.Item>
            </Form>
          </S.Spacer>
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Observações
            </Title>
            <Input.TextArea
              placeholder="Alguma observação para o pedido"
              rows={4}
              value={notes}
              onChange={(e): void => {
                setNotes(e.target.value)
              }}
            />
            <Checkbox
              style={{
                marginTop: '1rem'
              }}
            >
              Exibir na impressão
            </Checkbox>
          </S.Spacer>
        </div>
      </S.Container>
    </>
  )
}
