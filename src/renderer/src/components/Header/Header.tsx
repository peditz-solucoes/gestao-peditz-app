import { Avatar, Dropdown, MenuProps, Switch, Tag } from 'antd'
import { Header as HeaderAnt } from 'antd/es/layout/layout'
import React, { useEffect, useState } from 'react'
import { ColorList } from '../../utils/ColorList'
import { Link } from 'react-router-dom'
import { MdRestaurantMenu } from 'react-icons/md'
import { CgMenuOreos } from 'react-icons/cg'
import { LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { setLogout } from '../../services/auth'
import { StatusWebSocket } from '@renderer/types'
import { useBill, useCashier } from '@renderer/hooks'

const items: MenuProps['items'] = [
  {
    label: <Link to="/">Conta</Link>,
    icon: <UserOutlined />,
    key: '0'
  },
  {
    label: <Link to="/colaboradores/">Usuários</Link>,
    icon: <TeamOutlined />,
    key: '1'
  },
  {
    label: (
      <Link to="/login" onClick={() => setLogout()}>
        Sair
      </Link>
    ),
    icon: <LogoutOutlined />,
    onClick: () => setLogout(),
    key: '3'
  },
  {
    label: <div>{window.location.hash.substring(1)}</div>,
    icon: <LogoutOutlined />,
    key: '4'
  }
]

interface HeaderProps {
  titleHeader?: string
  setCollapsed: () => void
  collapsedValue: boolean
}

export const Header: React.FC<HeaderProps> = ({ titleHeader, setCollapsed, collapsedValue }) => {
  const [color, setColor] = useState(ColorList[0])
  const [status, setStatus] = useState<boolean>(false)
 
  const { connectSocket, cashier, getCashier, wsConnected } = useCashier()

  useEffect(() => {
    getCashier(true)
    handleConnectionWs()

    // a cada 5 segundos verifica se o usuário está online
    setInterval(() => {
      setStatus(window.navigator.onLine)
    }, 5000)

    setColor(getRandomColor())
  }, [])

  function handleConnectionWs(value?: boolean) {
    const wsStatus = localStorage.getItem('connectedWs')
    if (wsStatus === 'CONNECTED') {
      connectSocket()
    }
    
  }

  function getRandomColor() {
    const ColorList = [
      '#FF0000',
      '#FFA500',
      '#FFFF00',
      '#008000',
      '#0000FF',
      '#4B0082',
      '#EE82EE',
      '#FFC0CB',
      '#800000',
      '#808080',
      '#000000',
      '#FF7F50',
      '#DC143C',
      '#FFD700',
      '#ADFF2F',
      '#7B68EE',
      '#DDA0DD',
      '#FF69B4',
      '#8B4513',
      '#2E8B57',
      '#000080',
      '#9370DB',
      '#FF8C00',
      '#228B22',
      '#1E90FF',
      '#FF00FF',
      '#556B2F',
      '#D2B48C',
      '#A52A2A',
      '#808000',
      '#006400',
      '#8B008B',
      '#D2691E',
      '#2F4F4F',
      '#7FFF00',
      '#4169E1',
      '#FF00FF',
      '#B8860B',
      '#32CD32',
      '#00008B',
      '#FF1493'
      // Adicione mais cores aqui
    ]

    const randomIndex = Math.floor(Math.random() * ColorList.length)
    return ColorList[randomIndex]
  }

  return (
    <HeaderAnt
      style={{
        width: '100%',
        backgroundColor: '#F7F7F8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {collapsedValue ? (
          <CgMenuOreos
            style={{ fontSize: '24px', marginRight: '10px', cursor: 'pointer' }}
            onClick={setCollapsed}
          />
        ) : (
          <MdRestaurantMenu
            style={{ fontSize: '24px', marginRight: '10px', cursor: 'pointer' }}
            onClick={setCollapsed}
          />
        )}
        <h1>{titleHeader}</h1>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Switch
          checked={wsConnected}
          checkedChildren="Imprimir pedidos online"
          unCheckedChildren="Não imprimir pedidos online"
          onChange={(e) => console.log(e)}
        />

        {status ? (
          <Tag
            color="green"
            style={{
              fontWeight: '400',
              fontSize: '16px'
            }}
          >
            Online
          </Tag>
        ) : (
          <Tag
            color="red"
            style={{
              fontWeight: '400',
              fontSize: '16px'
            }}
          >
            Offline
          </Tag>
        )}
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
          <Avatar
            style={{
              backgroundColor: color,
              verticalAlign: 'middle',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            size="large"
          >
            {cashier?.opened_by?.first_name}
          </Avatar>
        </Dropdown>
      </div>
    </HeaderAnt>
  )
}
