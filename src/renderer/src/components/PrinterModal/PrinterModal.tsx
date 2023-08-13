import { usePrinter } from '@renderer/hooks'
import { Modal } from 'antd'
import React from 'react'
import { FormPrinter } from './components/FormPrinter/FormPrinter'
import { ListPrinter } from './components/ListPrinter/ListPrinter'

export const PrinterModal: React.FC = () => {
  const { showModal, OnCancelShowModal, currentTab } = usePrinter()
  return (
    <Modal
      title={currentTab === '1' ? <h3>Impressoras registradas</h3> : <h3>Registrar impressoras</h3>}
      footer={null}
      open={showModal}
      onCancel={OnCancelShowModal}
      width={'30%'}
      style={{
        minWidth: '500px',
      }}
    >
      {currentTab === '1' && <ListPrinter />}
      {currentTab === '2' && <FormPrinter />}
    </Modal>
  )
}
