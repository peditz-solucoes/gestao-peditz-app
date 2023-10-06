import React, { useCallback, useEffect, useState } from 'react'
import * as S from './styles'
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Space,
  Spin,
  Switch,
  Typography,
  message,
  Tooltip,
  Popconfirm,
  Drawer
} from 'antd'
import {
  EditOutlined,
  LinkOutlined,
  BookOutlined,
  DeleteOutlined,
  ExportOutlined,
  SaveOutlined
} from '@ant-design/icons'
import api from '@renderer/services/api'
import { theme } from '@renderer/theme'
import { Link, useNavigate } from 'react-router-dom'
import { CatalogType } from '@renderer/types'

const { Title } = Typography

export const Catalogs: React.FC = () => {
  const [loadingP, setLoadingP] = React.useState(false)
  const hasUpdate = React.useRef(false)
  const [catalogs, setCatalogs] = useState<CatalogType[]>([])
  const [loading, setLoading] = useState(false)
  const [restaurant, setRestaurant] = useState<{
    id: string
    name: string
    slug: string
  } | null>(null)
  const [loadingDelete, setLoadingDelete] = useState<string[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)

  const navigate = useNavigate()

  const fetchcatalogs = useCallback(() => {
    setLoading(true)
    api
      .get(`/catalog-crud/`)
      .then((response) => {
        setCatalogs(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const fetchRestaurant = useCallback(() => {
    api.get(`/restaurant/`).then((response) => {
      setRestaurant(response?.data[0])
    })
  }, [])

  useEffect(() => {
    if (!hasUpdate.current) {
      fetchcatalogs()
      fetchRestaurant()
      hasUpdate.current = true
    }
  }, [])

  const sendCatalog = useCallback((values): void => {
    setLoadingAdd(true)
    api
      .post(`/catalog-crud/`, values)
      .then((response) => {
        message.success('Cardápio adicionado com sucesso')
        navigate('/cardapios/' + response.data.id + '/')
        setVisible(false)
      })
      .catch((err) => {
        if (err.response?.data?.detail) {
          message.error(err.response.data.detail)
        } else {
          message.error('Erro ao adicionar cardápio')
        }
      })
      .finally(() => {
        setLoadingAdd(false)
      })
  }, [])

  const [visible, setVisible] = useState(false)
  return (
    <S.Container>
      <Space
        style={{
          width: '100%',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          size="large"
          type="primary"
          icon={<BookOutlined />}
          onClick={(): void => setVisible(true)}
        >
          Adicionar cardápio
        </Button>
      </Space>
      <Spin spinning={loading} size="large">
        <Space
          style={{
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          {catalogs.map((catalog) => (
            <Card
              key={catalog.id}
              style={{
                padding: 0,
                marginTop: '3rem'
              }}
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center',
                padding: '0rem 1rem',
                minWidth: '200px',
                margin: '0'
              }}
            >
              <Avatar
                size={64}
                style={{
                  marginTop: '-38px',
                  backgroundColor: theme.tokens.colorPrimary
                }}
                icon={<BookOutlined />}
                src={catalog?.photo ?? undefined}
              />
              <Title
                style={{
                  padding: '0',
                  margin: '0',
                  maxWidth: '230px'
                }}
                level={4}
                ellipsis={{
                  rows: 1,
                  tooltip: catalog.title
                }}
              >
                {catalog.title}
              </Title>
              <Switch
                checkedChildren="Ativo"
                unCheckedChildren="Inativo"
                defaultChecked={catalog.active}
                loading={loadingP}
                onChange={(checked): void => {
                  setLoadingP(true)
                  api
                    .patch(`/catalog-crud/${catalog.id}/`, {
                      active: checked
                    })
                    .catch(() => {
                      message.error('Erro ao atualizar cardápio')
                      fetchcatalogs()
                    })
                    .finally(() => {
                      setLoadingP(false)
                    })
                }}
              />
              <Space
                style={{
                  margin: '0.5rem 0'
                }}
              >
                <Popconfirm
                  title="Tem certeza que dejesa excluir este cardápio?"
                  description="Após exluir este cardápio não será possível recuperá-lo"
                  placement="bottom"
                  okButtonProps={{
                    loading: loadingDelete.includes(catalog.id),
                    danger: true
                  }}
                  onConfirm={(): void => {
                    setLoadingDelete((previous) => [...previous, catalog.id])
                    api
                      .delete(`/catalog-crud/${catalog.id}/`)
                      .then(() => {
                        message.success('Cardápio excluído com sucesso')
                        fetchcatalogs()
                      })
                      .finally(() => {
                        setLoadingDelete((previous) => previous.filter((id) => id !== catalog.id))
                      })
                  }}
                  okText="Excluir"
                  cancelText="Cancelar"
                >
                  <Button
                    loading={loadingDelete.includes(catalog.id)}
                    type="default"
                    icon={<DeleteOutlined />}
                    danger
                    shape="circle"
                  />
                </Popconfirm>
                <Tooltip title="Editar cardápio" placement="bottom">
                  <Link to={`/cardapios/${catalog.id}/`}>
                    <Button type="primary" icon={<EditOutlined />} shape="circle" />
                  </Link>
                </Tooltip>
                <Tooltip title="Abrir cardápio" placement="bottom">
                  <Button
                    href={`https://peditz.me/${catalog.restaurant.slug}/${catalog.slug}`}
                    type="default"
                    target="_blank"
                    icon={<ExportOutlined />}
                    shape="circle"
                  />
                </Tooltip>

                <Tooltip title="copiar link do cardápio" placement="bottom">
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    shape="circle"
                    onClick={(): void => {
                      navigator.clipboard.writeText(
                        `https://peditz.me/${catalog.restaurant.slug}/${catalog.slug}`
                      )
                      message.success('Link copiado para área de transferência')
                    }}
                  />
                </Tooltip>
              </Space>
            </Card>
          ))}
        </Space>
      </Spin>
      <Drawer
        title="Adicionar Cardápio"
        width={500}
        onClose={(): void => setVisible(false)}
        open={loadingAdd || visible}
      >
        <Form layout="vertical" onFinish={sendCatalog}>
          <Form.Item
            label="Título do cardápio"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o título do cardápio'
              }
            ]}
            name="title"
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Descrição" name="description">
            <Input.TextArea size="large" />
          </Form.Item>
          <Form.Item
            label="Link"
            name="slug"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o link do cardápio'
              },
              {
                pattern: new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
                message: 'O link deve conter apenas letras minúsculas e números'
              }
            ]}
          >
            <Input
              size="large"
              addonBefore={`www.peditz.me/${restaurant?.slug}`}
              placeholder="cardapio"
            />
          </Form.Item>
          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '3rem'
            }}
          >
            <Button
              htmlType="submit"
              loading={loadingAdd}
              type="primary"
              size="large"
              icon={<SaveOutlined />}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </S.Container>
  )
}
