import React, { useState } from 'react'
import { Button, Card, Image, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons'
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
      {/* <Card
				hoverable
				bodyStyle={{ padding: '10px' }}
				style={{ width: 250, height: 380, marginBottom: 20 }}
				cover={
					productImage ? (
						<Image alt="example" src={productImage} style={{ height: 200 }} />
					) : (
						<div
							style={{
								width: 300,
								height: 230,
								backgroundColor: '#f0f0f0',
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<PictureOutlined
								style={{
									fontSize: 160,
									color: '#d9d9d9',
								}}
							/>
						</div>
					)
				}
				actions={[
					<Button
						type="default"
						key={data.id}
						icon={
							<EditOutlined
								key="edit"
								style={{
									color: 'green',
								}}
							/>
						}
						onClick={() => onEditClick(data)}
					>
						{' '}
						Editar
					</Button>,
					<Button
						key={data.id}
						type="default"
						loading={isLoading}
						icon={<DeleteOutlined key="deleted" style={{ color: 'red' }} />}
						onClick={handleDeleteProduct}
					>
						{' '}
						Deletar{' '}
					</Button>,
				]}
			>
				<Meta title={data.title} description={data.description} />
				<div
					style={{
						width: '100%',
						padding: '10px 0',
						color: 'green',
						fontWeight: 'bold',
						fontSize: '1.25rem',
					}}
				>
					{formatCurrency(Number(data.price))}
				</div>
			</Card> */}

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
