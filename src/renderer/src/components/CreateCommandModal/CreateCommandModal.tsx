import { Button, Form, Input, InputNumber, Modal, Select, message } from 'antd'
import React, { useEffect } from 'react'
import { formatPhoneNumber } from '../../utils/formatPhone'
import api from '../../services/api'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'
import { Tables } from '../../types'
import { useNavigate } from 'react-router-dom'
import { useTerminal } from '../../hooks/useTerminal'

interface CreateCommandModalProps {
  visible: boolean
  onClose: () => void
  flux?: 'bills' | 'terminal'
}
interface CreateCommandProps {
  table: string
  open: boolean
  client_name: string
  client_phone: string
  number: number
}

export const CreateCommandModal: React.FC<CreateCommandModalProps> = ({
  visible,
  onClose,
  flux = 'bills'
}) => {
  const [table, setTable] = React.useState<Tables[]>([] as Tables[])
  const [isLoad, setIsLoad] = React.useState(false)
  const { fetchBill, setCurrentTab } = useTerminal()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTable()
  }, [])

  function fetchTable() {
    api
      .get('/tables/')
      .then((response) => {
        setTable(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  const onFinish = (values: any) => {
    handleCreateCommand(values)
  }

  function handleCreateCommand(values: CreateCommandProps) {
    setIsLoad(true)
    api
      .post('/bill/', {
        ...values,
        client_phone: values.client_phone ? '+55' + values.client_phone.replace(/\D/g, '') : '',
        open: true
      })
      .then((response) => {
        if (flux === 'terminal') {
          fetchBill(response.data.id as string).then(() => {
            setCurrentTab('2')
          })
          onClose()
        } else {
          navigate(`/comandas/${response.data.id}`)
        }
        form.resetFields()
      })
      .catch((error: AxiosError) => {
        messageApi.error((error.response?.data as { detail: string }).detail)
        errorActions(error)
      })
      .finally(() => {
        setIsLoad(false)
      })
  }

  return (
    <>
      {contextHolder}
      <Modal title={<h3>Abrir comanda</h3>} open={visible} onCancel={onClose} footer={null}>
        <Form layout="vertical" name="create_command" onFinish={onFinish} form={form}>
          <Form.Item
            name="number"
            label="Numero da comanda"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                message: 'Por favor, insira o número da comanda!'
              }
            ]}
          >
            <InputNumber
              size="large"
              type="number"
              placeholder="Digite o número da comanda"
              controls={false}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="Mesa" name="table">
            <Select
              showSearch
              placeholder="Selecione uma mesa"
              size="large"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={table.map((table) => ({ value: table.id, label: table.title }))}
            />
          </Form.Item>
          <Form.Item label="Nome do cliente" name="client_name">
            <Input placeholder="Informe o nome do cliente" size="large" />
          </Form.Item>
          <Form.Item
            name="client_phone"
            label="Número de telefone"
            getValueFromEvent={(e) => formatPhoneNumber(e.target.value)}
          >
            <Input
              prefix="+55"
              placeholder="Digite seu número de telefone"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <Form.Item
              style={{
                width: '100%'
              }}
            >
              <Button
                size="large"
                danger
                onClick={onClose}
                style={{
                  width: '100%'
                }}
              >
                Cancelar
              </Button>
            </Form.Item>
            <Form.Item
              style={{
                width: '100%'
              }}
            >
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={isLoad}
                style={{
                  width: '100%'
                }}
              >
                Abrir comanda
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}
