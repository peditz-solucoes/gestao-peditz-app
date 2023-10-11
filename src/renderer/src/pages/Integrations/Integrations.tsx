import React, { useState } from 'react'
import * as S from './styles'
import { PrinterOutlined, ScanOutlined } from '@ant-design/icons'
import { CardHabilitated } from './Components/CardHabilitated'
import { MdBalance } from 'react-icons/md'
import { SiIfood } from 'react-icons/si'
import { FaWhatsapp } from 'react-icons/fa'
import { usePrinter } from '@renderer/hooks'
import { PrinterModal } from '@renderer/components/PrinterModal/PrinterModal'
import { DrawerIfood } from './Components/DrawerIfood'

export const Integrations: React.FC = () => {
  const { setShowModal } = usePrinter()
  const [visibleDrawerIfood, setVisibleDrawerIfood] = useState(false)

  return (
    <>
      <S.Container>
        <div>
          <p
            style={{
              color: 'rgba(0, 0, 0, 0.54)'
            }}
          >
            Configure as integrações da sua loja
          </p>
        </div>
        <S.Title>
          <h3>Integrações internas</h3>
          <S.Content>
            <CardHabilitated
              title="Impressoras"
              button={{
                text: 'Configurar',
                type: 'primary',
                onClick: () => {
                  console.log('click'), setShowModal(true)
                }
              }}
              style={{
                backgroundColor: '#F5F5F5'
              }}
              icon={
                <PrinterOutlined
                  style={{
                    color: '#25D366'
                  }}
                />
              }
              badge={{
                active: false,
                text: 'Em breve'
              }}
            />
            <CardHabilitated
              title="Balança digital"
              button={{
                text: 'Configurar',
                type: 'primary',
                disabled: true,
                onClick: () => console.log('click')
              }}
              style={{
                backgroundColor: '#F5F5F5'
              }}
              icon={
                <MdBalance
                  style={{
                    color: '#25D366'
                  }}
                />
              }
              badge={{
                active: true,
                text: 'Em breve'
              }}
            />
            <CardHabilitated
              title="Leitor de código de barras"
              button={{
                text: 'Configurar',
                type: 'primary',
                disabled: true,
                onClick: () => console.log('click')
              }}
              style={{
                backgroundColor: '#F5F5F5'
              }}
              icon={
                <ScanOutlined
                  style={{
                    color: '#25D366'
                  }}
                />
              }
              badge={{
                active: true,
                text: 'Em breve'
              }}
            />
          </S.Content>
        </S.Title>
        <S.Title>
          <h3>Integrações Externas</h3>
          <S.Content>
            <CardHabilitated
              title="Ifood"
              description="Integre os pedidos do iFood diretamente à plataforma Peditz."
              button={{
                text: 'Habilitar',
                type: 'primary',
                onClick: () => setVisibleDrawerIfood(true),
                // disabled: true
              }}
              style={{
                backgroundColor: '#F5F5F5'
              }}
              icon={
                <SiIfood
                  style={{
                    color: '#EA1D2C'
                  }}
                />
              }
              badge={{
                active: true,
                text: 'Em breve'
              }}
            />
            <CardHabilitated
              title="Whatsapp"
              description="Integre os pedidos do Whatsapp diretamente à plataforma Peditz."
              button={{
                text: 'Habilitar',
                type: 'primary',
                disabled: true,
                onClick: () => console.log('click')
              }}
              style={{
                backgroundColor: '#F5F5F5'
              }}
              icon={
                <FaWhatsapp
                  style={{
                    color: '#25D366'
                  }}
                />
              }
              badge={{
                active: true,
                text: 'Em breve'
              }}
            />
          </S.Content>
        </S.Title>
      </S.Container>
      <PrinterModal />
      <DrawerIfood open={visibleDrawerIfood} onClose={() => setVisibleDrawerIfood(false)} />
    </>
  )
}
