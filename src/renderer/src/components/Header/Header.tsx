import { Avatar, Button, Dropdown, MenuProps, Switch, Tag, Typography, Tooltip } from 'antd'
import { Header as HeaderAnt } from 'antd/es/layout/layout'
import React, { useEffect, useState } from 'react'
import { ColorList } from '../../utils/ColorList'
import { Link } from 'react-router-dom'
import { MdRestaurantMenu } from 'react-icons/md'
import { CgMenuOreos } from 'react-icons/cg'
import { LogoutOutlined, TeamOutlined, UserOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import { getUser, setLogout } from '../../services/auth'
import { useCashier } from '@renderer/hooks'
import { useSocket } from '@renderer/hooks/useSocket'

const { Title } = Typography

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
    label: <Link to="/configuracoes/">Configurações</Link>,
    icon: <SettingOutlined />,
    key: '2'
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

  const { getCashier, cashier } = useCashier()
  const { loadingConnectSocket, handleConnectionWs, isConnected } = useSocket()

  useEffect(() => {
    getCashier(true)
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

  const user = getUser()

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
        <Tooltip title="Recarregar pagina">
          <Button
            icon={<ReloadOutlined />}
            size="large"
            type="text"
            onClick={(): void => window.location.reload()}
          />
        </Tooltip>
        <Tooltip title="Imprimir Pedidos online">
          <Switch
            loading={loadingConnectSocket}
            defaultChecked={localStorage.getItem('connectedWs') === 'CONNECTED'}
            checked={isConnected}
            checkedChildren="Sim"
            unCheckedChildren="Não"
            onChange={(e): void => handleConnectionWs(e)}
          />
        </Tooltip>

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexDirection: 'row'
          }}
        >
          <Title level={5} style={{ margin: 0, color: 'rgb(91, 101, 117)' }}>
            {cashier?.restaurant?.title}
          </Title>
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Tooltip title={user?.first_name + ' ' + user?.last_name} placement="left">
              <Avatar
                style={{
                  backgroundColor: color,
                  verticalAlign: 'middle',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                size="large"
              >
                {user?.first_name[0] + user?.last_name[0] || <UserOutlined />}
              </Avatar>
            </Tooltip>
          </Dropdown>
        </div>
      </div>
    </HeaderAnt>
  )
}
