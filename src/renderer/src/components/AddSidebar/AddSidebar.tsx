import React, { useCallback, useEffect, useState } from 'react'
import { SideBar } from '../Sidebar'
import { Button, Card, Layout, Spin, Typography } from 'antd'
import { Header } from '../Header'
import api from '@renderer/services/api'
import { WarningOutlined, WhatsAppOutlined } from '@ant-design/icons'

interface AddSidebarProps {
  children: React.ReactNode
  titleHeader?: string
}

const { Title, Text } = Typography

const { Content } = Layout

export const AddSidebar: React.FC<AddSidebarProps> = ({ children, titleHeader }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [restaurant, setRestaurant] = useState<any | null>(null)

  const getRestaurantData = useCallback(() => {
    api.get('/restaurant/').then((response) => {
      if (response?.data[0]?.id) {
        setRestaurant(response.data[0])
        localStorage.setItem('restaurant-info', JSON.stringify(response.data[0]))
      }
    })
  }, [])

  useEffect(() => {
    const restaurantInStorage = JSON.parse(localStorage.getItem('restaurant-info') ?? '{}')
    setRestaurant(restaurantInStorage)
    getRestaurantData()
  }, [getRestaurantData])

  function toggleCollapsed(): void {
    setCollapsed(!collapsed)
  }

  return (
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <SideBar collapsed={collapsed} />
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header
          titleHeader={titleHeader}
          setCollapsed={toggleCollapsed}
          collapsedValue={collapsed}
        />
        <Content>
          {restaurant?.active ? (
            children
          ) : restaurant !== null ? (
            <div style={{ padding: '1rem' }}>
              <Card style={{ textAlign: 'center' }}>
                <WarningOutlined
                  size={42}
                  style={{
                    fontSize: '56px',
                    color: 'red'
                  }}
                />
                <Title level={2}>Acesso Suspenso</Title>
                <Text style={{ fontSize: '1rem' }}>
                  Lamentamos informar que seu acesso foi temporariamente suspenso devido à falta de
                  pagamento.
                </Text>
                <br></br>
                <Text style={{ fontSize: '1rem' }}>
                  Por favor, entre em contato com nosso suporte pelo WhatsApp para regularizar sua
                  situação.
                </Text>
                <br></br>
                <Button
                  style={{ marginTop: '1rem' }}
                  icon={<WhatsAppOutlined />}
                  type="primary"
                  size="large"
                  href="https://contate.me/regularize-peditz"
                  target="_blank"
                >
                  Suporte WhatsApp
                </Button>
              </Card>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Spin size="large"></Spin>
            </div>
          )}
        </Content>
      </div>
    </Layout>
  )
}
