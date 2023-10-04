import React from 'react'
import * as S from './styles'
import {
  AiOutlineCheck,
  AiOutlineCoffee,
  AiFillClockCircle,
  AiTwotoneSetting
} from 'react-icons/ai'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import { FaConciergeBell, FaMotorcycle } from 'react-icons/fa'
import { Button, Dropdown, Input, MenuProps } from 'antd'
import { SlOptionsVertical } from 'react-icons/sl'
import { CardOrder } from '@renderer/components/CardOrder'
import { ModalOrder } from './components/ModalOrder/ModalOrder'

const items: MenuProps['items'] = [
  {
    label: 'Transferir Pendentes para concluido',
    key: '0'
  }
]

export const OrdersManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <>
      <S.Container>
        <S.HeaderContainer>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <S.TagStatus
              icon={<AiOutlineCoffee />}
              bgColor="rgba(219, 154, 0, 0.1)"
              borderColor="rgb(219, 154, 0)"
            >
              Pendentes
            </S.TagStatus>
            <S.TagStatus
              icon={<AiOutlineCheck />}
              borderColor="rgb(110, 6, 214)"
              bgColor="rgba(110, 6, 214, 0.1)"
            >
              Aceito
            </S.TagStatus>
            <S.TagStatus
              icon={<AiFillClockCircle />}
              borderColor="rgb(255, 130, 102)"
              bgColor="rgba(255, 130, 102, 0.1)"
            >
              Em preparo
            </S.TagStatus>
            <S.TagStatus
              icon={<GiFullMotorcycleHelmet />}
              borderColor="rgb(102, 136, 255)"
              bgColor="rgba(102, 136, 255, 0.1)"
            >
              Esperando o entregador
            </S.TagStatus>
            <S.TagStatus
              icon={<FaMotorcycle />}
              borderColor="rgb(0, 165, 121)"
              bgColor="rgba(0, 165, 121, 0.1)"
            >
              Saiu para entrega
            </S.TagStatus>
            <S.TagStatus
              icon={<FaConciergeBell />}
              borderColor="rgb(28, 175, 28)"
              bgColor="rgba(28, 175, 28, 0.1)"
            >
              Concluido
            </S.TagStatus>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
            }}
          >
            <Input.Search placeholder="Buscar pelo nº do pedido ou comanda" size="large" />
            <Button
              size="large"
              type="default"
              icon={<AiTwotoneSetting />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                padding: '5px'
              }}
            />
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button
                size="large"
                type="default"
                icon={<SlOptionsVertical />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  padding: '5px'
                }}
              />
            </Dropdown>
          </div>
        </S.HeaderContainer>
        <S.OrdersContainer>
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
          <CardOrder onClick={() => setIsModalOpen(true)} />
        </S.OrdersContainer>
      </S.Container>
      <ModalOrder isModalOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} />
    </>
  )
}
