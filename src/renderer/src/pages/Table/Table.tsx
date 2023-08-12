import { useEffect, useState } from 'react'
import * as S from './styles'
import {
  Avatar,
  Breadcrumb,
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Spin,
  Switch,
  Typography
} from 'antd'
// import { MdTableRestaurant } from 'react-icons/md';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { Tables } from '../../types'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'

const { Title } = Typography

export const Table: React.FC = () => {
  const [table, setTable] = useState<Tables>({} as Tables)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm()

  function onFinish() {
    updateTable()
  }

  useEffect(() => {
    setIsLoading(true)
    fetchTable()
  }, [])

  function updateTable() {
    setIsLoading(true)
    api
      .patch(`/tables/${id}/`, form.getFieldsValue())
      .then((response) => {
        setTable(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleDelete() {
    setIsLoading(true)
    api
      .delete(`/tables/${id}/`)
      .then(() => {
        navigate('/mesas/')
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function fetchTable() {
    api
      .get(`/tables/${id}`)
      .then((response) => {
        console.log(response.data)
        setTable(response.data)
        form.setFieldsValue({
          title: response.data.title,
          description: response.data.description,
          order: response.data.order,
          active: response.data.active,
          capacity: response.data.capacity
        })
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleSwitchChange = (value: any) => {
    setTable({ ...table, active: value })
  }

  return (
    <S.Container>
      <Breadcrumb
        items={[
          {
            title: <a onClick={() => navigate('/mesas/')}>Gerenciamento de mesas</a>
          },
          {
            title: 'Mesas'
          }
        ]}
      />
      <Spin tip="Loading..." spinning={isLoading}>
        <div
          style={{
            width: '80%',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'row',
            gap: '25px'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '50%',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              <div>
                <Avatar
                  size={48}
                  // icon={<MdTableRestaurant />}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Title level={4} style={{ margin: '0' }}>
                  Mesa {table.title}
                </Title>
                <span>
                  {table.bills?.length > 0 ? (
                    <>
                      <StopOutlined style={{ color: '#E53E3E' }} />
                      <span style={{ color: '#E53E3E', fontWeight: 'bold' }}>
                        {' '}
                        Mesa Indisponivel
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircleOutlined style={{ color: '#2FAA54' }} />
                      <span style={{ color: '#2FAA54', fontWeight: 'bold' }}> Mesa Disponivel</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            {table.bills?.length > 0 ? (
              table.bills.map((bill) => (
                <S.CommandCard onClick={() => navigate(`/comandas/${bill.id}/`)}>
                  <Title level={5} style={{ margin: '0' }}>
                    Comanda {bill.number}
                  </Title>
                  {bill.client_name && (
                    <p
                      style={{
                        fontSize: '16px'
                      }}
                    >
                      {' '}
                      <span
                        style={{
                          fontWeight: 'semibold',
                          fontSize: '16px'
                        }}
                      >
                        {' '}
                        Cliente:
                      </span>{' '}
                      {bill.client_name}
                    </p>
                  )}
                </S.CommandCard>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Title level={3} style={{ color: '#2FAA54' }}>
                    Mesa sem vinculos com comandas
                  </Title>
                }
              />
            )}
          </div>
          <div
            style={{
              width: '50%'
            }}
          >
            <Form layout="vertical" onFinish={onFinish} name="table_edit" form={form}>
              <Form.Item
                label="Nome da mesa"
                name="title"
                tooltip="O nome da mesa pode ser expresso em palavras ou numeros"
              >
                <Input placeholder="Nome da mesa" />
              </Form.Item>
              <Form.Item label="Descrição" name="description">
                <Input.TextArea
                  placeholder="Descrição"
                  rows={3}
                  style={{
                    resize: 'none'
                  }}
                />
              </Form.Item>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '20px'
                }}
              >
                <Form.Item
                  label="Order"
                  name="order"
                  tooltip="Mostra a capacidade de pessoas que podem ocupar a mesa"
                >
                  <InputNumber placeholder="Ordem" />
                </Form.Item>
                <Form.Item label="Capacidade da mesa" name="capacity">
                  <InputNumber placeholder="capacidade" />
                </Form.Item>
                <Form.Item
                  label="Mesa ativa"
                  name="active"
                  tooltip="Se a mesa não estiver ativa, não será exibida para os colaboradores"
                  initialValue={table.active}
                >
                  <Switch
                    checkedChildren="sim"
                    unCheckedChildren="não"
                    checked={table.active}
                    onChange={handleSwitchChange}
                  />
                </Form.Item>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <Form.Item style={{ flex: 1 }}>
                  <Button
                    type="default"
                    size="large"
                    danger
                    style={{
                      flex: 1,
                      width: '100%'
                    }}
                    onClick={handleDelete}
                  >
                    Excluir
                  </Button>
                </Form.Item>
                <Form.Item style={{ flex: 1 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ flex: 1, width: '100%' }}
                  >
                    Salvar Alterações
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </Spin>
    </S.Container>
  )
}
