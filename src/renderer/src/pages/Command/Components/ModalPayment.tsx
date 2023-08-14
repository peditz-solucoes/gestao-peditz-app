import { useBill } from '@renderer/hooks'
import api from '@renderer/services/api'
import { FormOfPayment } from '@renderer/types'
import { errorActions } from '@renderer/utils/errorActions'
import { Button, Form, InputNumber, Modal, Typography } from 'antd'
import { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'

const { Paragraph } = Typography

export const ModalPayment: React.FC = () => {
  const [formOfPayment, setFormOfPayment] = useState<FormOfPayment>({} as FormOfPayment)
  const { showModalPayment, selectedPayment, OnCloseModalPayment, setPayments } = useBill()
  const [form] = Form.useForm()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFormOfPayments()

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }, [showModalPayment])

  function fetchFormOfPayments(): void {
    api
      .get(`/payment-method/${selectedPayment}/`)
      .then((response) => {
        setFormOfPayment(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  function addPayment(value: number): void {
    setPayments((oldPayments) => [
      ...oldPayments,
      {
        id: formOfPayment.id as string,
        value: value,
        title: formOfPayment.title
      }
    ])
  }

  const onFinish = (values: any) => {
    addPayment(values.value)
    OnCloseModalPayment()
    form.resetFields()
  }

  return (
    <Modal
      title="Add detalhes do pagamento"
      open={showModalPayment}
      onCancel={OnCloseModalPayment}
      footer={null}
    >
      <Paragraph style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
        Por favor, insira os valores que você está recebendo na modalidade{' '}
        <b>{formOfPayment.title}</b>
      </Paragraph>
      <Form layout="vertical" name="add_payment" onFinish={onFinish} form={form}>
        <Form.Item
          label="Valor recebido"
          name="value"
          tooltip="Insira o valor que você está recebendo"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o valor recebido'
            }
          ]}
        >
          <InputNumber ref={inputRef} size="large" style={{ width: 300 }} />
        </Form.Item>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '20px' }}>
          <Form.Item style={{ width: '100%' }}>
            <Button type="default" danger onClick={OnCloseModalPayment} style={{ width: '100%' }}>
              Cancelar
            </Button>
          </Form.Item>
          <Form.Item style={{ width: '100%' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Adicionar
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
