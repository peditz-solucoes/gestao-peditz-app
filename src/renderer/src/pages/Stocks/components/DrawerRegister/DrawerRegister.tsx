import { theme } from '@renderer/theme'
import { Alert, Card, Typography, Drawer } from 'antd'
import { TbNewSection } from 'react-icons/tb'
import { FaBoxesPacking } from 'react-icons/fa6'
import React, { useEffect } from 'react'
import { NewStock } from '../NewStock/NewStock'
import { TransactionStock } from '../TransactionStock/TransactionStock'
import { useStock } from '@renderer/hooks'
import { EditStock } from '../EditStock/EditStock'

const { Title, Text } = Typography

interface RegisterStocksProps {
  visible: boolean
  onClose: () => void
  onUpdate: () => void
}

const tabComponents = {
  '1': <NewStock />,
  '2': <TransactionStock />,
  '3': <EditStock />
}

export const DrawerRegister: React.FC<RegisterStocksProps> = ({ onClose, visible }) => {
  const { currentTab, setCurrentTab, getCategoriesStock, getStock } = useStock()

  useEffect(() => {
    getCategoriesStock()
    getStock()
  }, [])

  return (
    <Drawer
      title={
        currentTab === '1'
          ? 'Novo Estoque'
          : currentTab === '2'
          ? 'Movimentar Estoque'
          : 'Editar Estoque'
      }
      placement={'right'}
      width={600}
      closable={true}
      onClose={onClose}
      open={visible}
      key={'right'}
    >
      {currentTab !== '3' && (
        <>
          <Alert
            type="info"
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
            description="Por favor, informe se se trata de um estoque novo ou de um estoque já existente."
            showIcon
            closable
          />
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
            <Card
              onClick={(): void => setCurrentTab('1')}
              key={'1'}
              style={{
                width: '100%',
                height: '100%',
                flex: 1,
                border:
                  (currentTab === '1' ? '1.5px' : '1px') +
                  ' solid ' +
                  (currentTab === '1' ? theme.tokens.colorPrimary : '#ebebeb'),
                cursor: 'pointer'
              }}
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                flex: 1,
                height: '100%'
              }}
            >
              <TbNewSection color={currentTab === '1' ? theme.tokens.colorPrimary : '#ebebeb'} />

              <Title
                level={5}
                style={{
                  color: currentTab === '1' ? theme.tokens.colorPrimary : '#a2a2a2',
                  userSelect: 'none'
                }}
              >
                Novo Estoque
              </Title>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#666666'
                }}
              >
                Estoque que não foi registrado no sistema.
              </Text>
            </Card>
            <Card
              onClick={(): void => setCurrentTab('2')}
              key={'1'}
              style={{
                width: '100%',
                height: '100%',
                flex: 1,
                border:
                  (currentTab === '2' ? '1.5px' : '1px') +
                  ' solid ' +
                  (currentTab === '2' ? theme.tokens.colorPrimary : '#ebebeb'),
                cursor: 'pointer'
              }}
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                flex: 1,
                height: '100%'
              }}
            >
              <FaBoxesPacking color={currentTab === '2' ? theme.tokens.colorPrimary : '#ebebeb'} />

              <Title
                level={5}
                style={{
                  color: currentTab === '2' ? theme.tokens.colorPrimary : '#a2a2a2',
                  userSelect: 'none'
                }}
              >
                Atualizar Estoque
              </Title>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#666666'
                }}
              >
                Estoque que já foi registrado no sistema.
              </Text>
            </Card>
          </div>
        </>
      )}
      {tabComponents[currentTab]}
    </Drawer>
  )
}
