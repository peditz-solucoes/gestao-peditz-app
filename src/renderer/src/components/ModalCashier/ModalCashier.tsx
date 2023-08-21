import { Alert, Button, Form, Input, InputNumber, Modal } from 'antd'
import React, { useState } from 'react'
import api from '../../services/api'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'
import { OpenCashier } from '@renderer/utils/Printers'
import { useCashier } from '@renderer/hooks'

export const ModalCashier: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const { setOpenCashierModal, cashier, openCashierModal, fetchCashier } = useCashier()
  const [errorMessage, setErrorMessage] = useState('')
  const onFinish = (values: any) => {
    if (!cashier?.open) {
      handleOpenCashier(values)
    } else {
      handleCloseCashier(values.password)
    }
  }

  const onResetForm = () => {
    setErrorMessage('')
    form.resetFields()
  }

  function handleCloseCashier(password: string) {
    setIsLoading(true)
    api
      .patch(`/cashier/${cashier.id}/`, { open: false, password })
      .then(() => {
        setOpenCashierModal(false)
        onResetForm()
        fetchCashier(true)
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          setErrorMessage((error.response.data as { detail: string }).detail)
        }
        errorActions(error)
      })
      .finally(() => setIsLoading(false))
  }

  function handleOpenCashier(data: {
    initial_value: number
    identifier: string
    password: string
  }) {
    setIsLoading(true)
    api
      .post('/cashier/', { ...data, open: true })
      .then((response) => {
        setOpenCashierModal(false)
        onResetForm()
        fetchCashier(true)
        OpenCashier(response.data)
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          setErrorMessage((error.response.data as { detail: string }).detail)
        }
        errorActions(error)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal
      title={!cashier?.open ? <h3>Abrir Caixa</h3> : <h3>Fechar Caixa</h3>}
      open={openCashierModal}
      footer={null}
      onCancel={() => setOpenCashierModal(false)}
    >
      {!cashier?.open ? (
        <div
          style={{
            width: '100%',
            marginTop: '30px'
          }}
        >
          <Form
            name="trading_box"
            layout="vertical"
            form={form}
            onFinish={onFinish}
            style={{
              fontWeight: 'bold'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '5px',
                flexDirection: 'column'
              }}
            >
              <Form.Item
                name="initial_value"
                label="Valor de entrada"
                tooltip="Informa o valor que o caixa possui no momento de abertura"
                rules={[
                  {
                    required: true,
                    message: 'É necessário informar o valor de entrada, mesmo que o mesmo seja 0!'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Valor inicial do Caixa"
                  addonBefore="R$"
                />
              </Form.Item>
              <Form.Item
                name="identifier"
                label="Identificador do caixa"
                tooltip="Este campo serve para identificar o caixa aberto, por exemplo: 'Almoço' ou 'jantar'"
              >
                <Input size="large" placeholder="Informe algo que indentifique o seu caixa" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Senha do operador"
                rules={[
                  {
                    required: true,
                    message: 'É necessário informar a senha do operador!'
                  }
                ]}
              >
                <Input.Password size="large" placeholder="Senha" visibilityToggle />
              </Form.Item>
              {errorMessage && (
                <div
                  style={{
                    marginBottom: '10px'
                  }}
                >
                  <Alert type="error" showIcon message={errorMessage} />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Form.Item>
                  <Button
                    type="default"
                    danger
                    onClick={() => setOpenCashierModal(false)}
                    size="large"
                  >
                    Cancelar
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
                    Abrir caixa
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            marginTop: '30px'
          }}
        >
          <Form name="trading_box" layout="vertical" onFinish={onFinish}>
            <div
              style={{
                display: 'flex',
                gap: '5px',
                flexDirection: 'column'
              }}
            >
              <Form.Item
                name="password"
                label="Senha do operador"
                rules={[
                  {
                    required: true,
                    message: 'É necessário informar a senha do operador!'
                  }
                ]}
              >
                <Input.Password size="large" placeholder="Senha" visibilityToggle />
              </Form.Item>
              
              {errorMessage && (
                <div
                  style={{
                    marginBottom: '10px'
                  }}
                >
                  <Alert type="error" showIcon message={errorMessage} />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Form.Item>
                  <Button type="default" onClick={() => setOpenCashierModal(false)} size="large">
                    Cancelar
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" danger loading={isLoading}>
                    Fechar Caixa
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  )
}
