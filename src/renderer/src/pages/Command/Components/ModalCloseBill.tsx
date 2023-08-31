import api from '@renderer/services/api'
import { errorActions } from '@renderer/utils/errorActions'
import { Alert, Input, Modal } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'

interface ModalCloseBillProps {
  visible: boolean
  onClose: () => void
  onFetch: () => void
  billId: string
}

export const ModalCloseBill: React.FC<ModalCloseBillProps> = ({
  visible,
  onClose,
  onFetch,
  billId
}) => {
  const [operatorCode, setOperatorCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  function handleCloseBill() {
    setLoading(true)
    api
      .post('/close-bill/', {
        bill_id: billId,
        operator_code: operatorCode
      })
      .then(() => {
        onFetch()
        window.location.reload()
        onReset()
      })
      .catch((err: AxiosError) => {
        if ((err.response?.data as { detail: string }).detail)
          setError((err.response?.data as { detail: string }).detail)
        errorActions(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function onReset() {
    setOperatorCode('')
    setError('')
    onClose()
  }

  return (
    <Modal
      title="Fechar comanda"
      open={visible}
      onCancel={onReset}
      cancelText="Cancelar"
      okText="Fechar a comanda"
      okButtonProps={{ disabled: !operatorCode, loading: loading }}
      cancelButtonProps={{ danger: true }}
      onOk={handleCloseBill}
    >
      <Alert
        showIcon
        type="warning"
        message="O Pagamento completo é necessário antes de fechar a comanda, devido a regras de segurança. Consulte o gerente para concluir. Obrigado."
      />

      <div
        style={{
          margin: '20px 0'
        }}
      >
        <Input
          placeholder="Codigo do operador"
          value={operatorCode}
          onChange={(e) => setOperatorCode(e.target.value)}
        />
      </div>

      {error && <Alert showIcon type="error" message={error} />}
    </Modal>
  )
}
