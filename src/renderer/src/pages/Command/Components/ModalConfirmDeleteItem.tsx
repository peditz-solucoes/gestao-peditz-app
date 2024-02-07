import { useBill } from '@renderer/hooks'
import api from '@renderer/services/api'
import { formatCurrency } from '@renderer/utils'
import { Alert, Input, Modal, Typography } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'

const { Text } = Typography

interface ModalConfirmDeleteItemProps {
  visible: boolean
  onClose: () => void
  data: {
    id: string
    name: string
    price: string
    amount: number
    billId: string
  }
}

export const ModalConfirmDeleteItem: React.FC<ModalConfirmDeleteItemProps> = ({
  visible,
  onClose,
  data
}) => {
  const [operatorCode, setOperatorCode] = React.useState('')
  const [reason, setReason] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { setOrders } = useBill()

  function handleDeleteItem() {
    setIsLoading(true)
    api
      .post(`/order-delete/`, {
        operator_code: operatorCode,
        order_id: data.id,
        reason: reason
      })
      .then(() => {
        setOrders((old) =>
          old.map((o) => {
            return {
              ...o,
              orders: o.orders.filter((order) => order.id !== data.id)
            }
          })
        )

        setOperatorCode('')
        setErrorMessage('')
        onClose()
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          setErrorMessage((err.response.data as { detail: string }).detail)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onCancel = () => {
    setOperatorCode('')
    setErrorMessage('')
    onClose()
  }

  return (
    <Modal
      onCancel={onCancel}
      open={visible}
      onOk={handleDeleteItem}
      okText="Cancelar pedido"
      okButtonProps={{
        loading: isLoading,
        danger: true,
        disabled: operatorCode.length > 0 && reason ? false : true
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Text>
          Nome do item: <strong>{data.name}</strong>
        </Text>
        <Text>
          Preço do item: <strong>{formatCurrency(Number(data.price))}</strong>
        </Text>
        <Text>
          Quantidade: <strong>{Number(data.amount)}</strong>
        </Text>

        <div>
          <label
            style={{
              fontWeight: 'bold'
            }}
          >
            {' '}
            Codigo operacional
          </label>
          <Input.Password
            placeholder="Insira o codigo operacional"
            value={operatorCode}
            onChange={(e) => {
              setOperatorCode(e.target.value)
            }}
          />
          <Input.TextArea
            style={{
              marginTop: '10px'
            }}
            placeholder="Insira o motivo"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: '10px'
        }}
      >
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      </div>
    </Modal>
  )
}
