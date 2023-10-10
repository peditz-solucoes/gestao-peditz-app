import { useStock } from '@renderer/hooks'
import { theme } from '@renderer/theme'
import { brlToNumber, formatToBRL } from '@renderer/utils'
import { Button, Form, Input, InputNumber, Select, Typography } from 'antd'
import React from 'react'
import { BsArrowDownSquareFill } from 'react-icons/bs'
import { TbNewSection } from 'react-icons/tb'

const { Title, Text } = Typography

export const TransactionStock: React.FC = () => {
  const [typeOfMovement, setTypeOfMovement] = React.useState<'input' | 'output'>('input')
  const { createNewTransaction, stocks } = useStock()
  const [form] = Form.useForm()
  const onFinish = (values: any): void => {
    createNewTransaction({
      ...values,
      unit_price: values.unit_price ? brlToNumber(values.unit_price) : 0,
      total: !values.unit_price ? 0 : brlToNumber(values.unit_price) * values.quantity,
      quantity: typeOfMovement === 'input' ? values.quantity : -values.quantity
    })
  }

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.Item label="Selecione o estoque" name="item">
        <Select
          placeholder="Digite o nome ou escolha as opções."
          options={stocks.map((x) => ({ value: x.id, label: x.title }))}
        />
      </Form.Item>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          justifyContent: 'center',
          padding: '16px 0'
        }}
      >
        <div
          onClick={(): void => setTypeOfMovement('input')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            border:
              (typeOfMovement === 'input' ? '1.5px' : '1px') +
              ' solid ' +
              (typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#ebebeb'),
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <TbNewSection
            color={typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#a2a2a2'}
          />

          <Title
            level={5}
            style={{
              color: typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#a2a2a2',
              userSelect: 'none',
              margin: 0
            }}
          >
            Entrada
          </Title>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: typeOfMovement === 'input' ? theme.tokens.colorPrimary : '#666666',
              margin: 0
            }}
          >
            Registrar entrada de estoque.
          </Text>
        </div>
        <div
          onClick={(): void => setTypeOfMovement('output')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            border:
              (typeOfMovement === 'output' ? '1.5px' : '1px') +
              ' solid ' +
              (typeOfMovement === 'output' ? '#ed4747' : '#ebebeb'),
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <BsArrowDownSquareFill color={typeOfMovement === 'output' ? '#ed4747' : '#a2a2a2'} />

          <Title
            level={5}
            style={{
              color: typeOfMovement === 'output' ? '#ed4747' : '#a2a2a2',
              userSelect: 'none',
              margin: 0
            }}
          >
            Saída
          </Title>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: typeOfMovement === 'output' ? '#ed4747' : '#666666',
              margin: 0
            }}
          >
            Registrar saída de estoque.
          </Text>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '15px'
        }}
      >
        <Form.Item
          label="Movimento do estoque"
          name="quantity"
          tooltip="A quantidade de produtos que você está movimentando nessa transação, seja entrada ou saida."
        >
          {typeOfMovement === 'input' ? (
            <InputNumber placeholder="0" addonBefore="+" />
          ) : (
            <InputNumber placeholder="0" addonBefore="-" />
          )}
        </Form.Item>

        {typeOfMovement === 'input' && (
          <Form.Item
            name="unit_price"
            label="Valor unitario"
            tooltip="O quanto você está pagando por cada unidade."
          >
            <Input
              onChange={(e): void => {
                form.setFieldsValue({
                  unit_price: formatToBRL(e.target.value)
                })
              }}
            />
          </Form.Item>
        )}
      </div>
      <div>
        <Form.Item
          label="Anotação"
          name="notes"
          tooltip="Caso precise informar algo sobre o estoque que está entrando."
        >
          <Input.TextArea rows={3} placeholder="Deixe alguma notificação para essa remessa." />
        </Form.Item>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: '10px',
          position: 'absolute',
          bottom: 0
        }}
      >
        <Form.Item>
          <Button danger type="default" size="large" style={{ width: 200 }}>
            cancelar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" style={{ width: 200 }}>
            Registrar
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}
