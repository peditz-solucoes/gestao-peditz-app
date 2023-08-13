import { usePrinter } from '@renderer/hooks'
import { Modal } from 'antd'
import React from 'react'
import { RegistePrinter } from './components/RegisterPrinter/RegisterPrinter'
import { ListPrinter } from './components/ListPrinter/ListPrinter'

export const PrinterModal: React.FC = () => {
  const { showModal, setShowModal, currentTab } = usePrinter()
  return (
    <Modal
      title={currentTab === '1' ? <h3>Impressoras registradas</h3> : <h3>Registrar impressoras</h3>}
      footer={null}
      open={showModal}
      onCancel={() => setShowModal(false)}
      width={'30%'}
    >
      {currentTab === '1' && <ListPrinter />}
      {currentTab === '2' && <RegistePrinter />}
    </Modal>
  )
}
