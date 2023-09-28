import { Avatar, Button, Dropdown, MenuProps, Switch, Tag } from 'antd'
import { Header as HeaderAnt } from 'antd/es/layout/layout'
import React, { useEffect, useState } from 'react'
import { ColorList } from '../../utils/ColorList'
import { Link } from 'react-router-dom'
import { MdRestaurantMenu } from 'react-icons/md'
import { CgMenuOreos } from 'react-icons/cg'
import {
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
  ReloadOutlined,
  PoweroffOutlined
} from '@ant-design/icons'
import { setLogout } from '../../services/auth'
import { useCashier } from '@renderer/hooks'
import { useSocket } from '@renderer/hooks/useSocket'

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
      <Link to="/login" onClick={(): void => setLogout()}>
        Sair
      </Link>
    ),
    icon: <LogoutOutlined />,
    onClick: () => setLogout(),
    key: '3'
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

  const { cashier } = useCashier()
  const { loadingConnectSocket, handleConnectionWs, isConnected } = useSocket()

  useEffect(() => {
    // a cada 5 segundos verifica se o usuário está online
    setInterval(() => {
      setStatus(window.navigator.onLine)
    }, 5000)

    setColor(getRandomColor())
  }, [])

  function getRandomColor(): string {
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
        padding: '0 20px',
        borderBottom: '1px solid #E9E9E9'
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
        <Button
          icon={<ReloadOutlined />}
          size="large"
          type="text"
          onClick={(): void => window.location.reload()}
        />
        {/* <Switch
          loading={loadingConnectSocket}
          defaultChecked={localStorage.getItem('connectedWs') === 'CONNECTED'}
          checked={isConnected}
          checkedChildren="Imprimir pedidos online"
          unCheckedChildren="Não imprimir pedidos online"
          onChange={(e): void => handleConnectionWs(e)}
        /> */}
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          loading={loadingConnectSocket}
          onClick={() => handleConnectionWs(!isConnected)}
          danger={isConnected}
        >
          {isConnected ? 'Desativar pedidos online' : 'Ativar pedidos online'}
        </Button>

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
            icon={<UserOutlined />}
          >
            {cashier?.opened_by?.first_name}
          </Avatar>
        </Dropdown>
      </div>
    </HeaderAnt>
  )
}
