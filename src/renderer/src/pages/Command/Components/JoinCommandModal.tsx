import { Modal, Select } from 'antd'
import React, { useEffect } from 'react'
import { useBill } from '../../../hooks/useBill'

interface JoinCommandModalProps {
  onCancel: () => void
  visible: boolean
  billId: string
}

export const JoinCommandModal: React.FC<JoinCommandModalProps> = ({
  onCancel,
  visible,
  billId
}) => {
  const { bills, fetchBills, addBill } = useBill()
  const [selectedBill, setSelectedBill] = React.useState<string>('')

  useEffect(() => {
    fetchBills()
  }, [])

  return (
    <Modal
      onCancel={onCancel}
      open={visible}
      onOk={(): void => {
        addBill(selectedBill, false)
        onCancel()
      }}
      title="Unir comandas"
      destroyOnClose
    >
      <label>Selecione a comanda que deseja unir:</label>
      <Select
        showSearch
        onChange={(value): void => {
          setSelectedBill(value)
        }}
        style={{ width: '100%' }}
        placeholder="Busque a comanda desejada."
        optionFilterProp="children"
        filterOption={(input, option): boolean => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB): number =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        options={bills.map((bill) => {
          return {
            value: bill.id,
            label: `Comanda:${bill.number} | Cliente: ${
              bill.client_name.split(' ').length > 2
                ? `${bill.client_name.split(' ')[0]} ${bill.client_name.split(' ')[1]}...`
                : `${bill.client_name}`
            }`
          }
        })}
      />
    </Modal>
  )
}
