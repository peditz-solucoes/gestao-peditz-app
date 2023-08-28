import React, { useState } from 'react'
import { Button, Image, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Product } from '../../types'
import api from '../../services/api'
import { AxiosError } from 'axios'
import { formatCurrency } from '../../utils'
import * as S from './styles'
import { truncateText } from '@renderer/utils/truncate'

const { Paragraph, Title } = Typography

interface CardProductsProps {
  data: Product
  onUpdate: () => void
  onEditClick: (product: Product) => void
}

export const CardProducts: React.FC<CardProductsProps> = ({ data, onUpdate, onEditClick }) => {
  const [productImage] = useState(
    'https://peditz.sfo3.digitaloceanspaces.com/products/1682781368244-blob'
  )
  const [isLoading, setIsLoading] = useState(false)

  function handleDeleteProduct() {
    setIsLoading(true)
    api
      .delete(`/product/${data.id}`)
      .then(() => {
        onUpdate()
      })
      .catch((error: AxiosError) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <S.Container>
        <S.ContainerImage>
          <Image
            src={productImage}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%'
            }}
          />
          <Title level={5} italic>
            {truncateText(data.title, 30, '...')}
          </Title>
        </S.ContainerImage>
        {data.description ? (
          <Paragraph>{truncateText(data.description, 100, '...')}</Paragraph>
        ) : (
          <Paragraph>
            Sem descrição disponível. Detalhes do prato são essenciais para guiar a sua escolha e
            proporcionar uma experiência deliciosa.
          </Paragraph>
        )}
        <div
          style={{
            width: '100%',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Tag
            color="green"
            style={{
              fontSize: '1.25rem',
              padding: '10px'
            }}
          >
            {formatCurrency(Number(data.price))}
          </Tag>
        </div>
        <S.ButtonGroup>
          <Button type="primary" danger onClick={handleDeleteProduct} loading={isLoading}>
            <DeleteOutlined /> Deletar
          </Button>
          <Button type="primary" onClick={() => onEditClick(data)}>
            <EditOutlined /> Editar
          </Button>
        </S.ButtonGroup>
      </S.Container>
    </>
  )
}
