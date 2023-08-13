import { usePrinter } from '@renderer/hooks'
import { Button, Divider, Form, Input, InputNumber, Spin, Switch } from 'antd'
import React, { useEffect } from 'react'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export const FormPrinter: React.FC = () => {
  const {
    OnCancelShowModal,
    isLoading,
    fetchPrinter,
    form,
    switchValue,
    setSwitchValue,
    printerId,
    createPrinter,
    updatePrinter
  } = usePrinter()

  useEffect(() => {
    if (printerId) {
      fetchPrinter()
    }
  }, [])

  const handleSwitchChange = (value: any) => {
    setSwitchValue(value)
    form.setFieldValue('active', value)
  }

  const onFinish = (values: any) => {
    form.setFieldsValue(values)

    if (printerId) {
      updatePrinter()
    } else {
      createPrinter()
    }
  }

  return (
    <div>
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[
              {
                required: true,
                message: 'O nome dá impressora é obrigatorio'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '30px'
            }}
          >
            <Form.Item label="Ip" name="ip">
              <Input />
            </Form.Item>

            <Form.Item label="Porta" name="port">
              <Input />
            </Form.Item>
            <Form.Item label="Ativada" name="active" initialValue={false}>
              <Switch
                size="default"
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={switchValue}
                onChange={handleSwitchChange}
              />
            </Form.Item>
          </div>
          <Divider>
            <h3>Fontes</h3>
          </Divider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '30px'
            }}
          >
            <Form.Item label="Largura" name="paper_width">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Título" name="titleFontSize">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Corpo" name="bodyFontSize">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Rodapé" name="footerFontSize">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
            }}
          >
            <Form.Item style={{ flex: 1 }}>
              <Button style={{ width: '100%' }} danger onClick={OnCancelShowModal}>
                Cancelar
              </Button>
            </Form.Item>
            <Form.Item style={{ flex: 1 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Registrar
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </div>
  )
}
