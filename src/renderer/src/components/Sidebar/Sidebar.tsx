import {
  ApiOutlined,
  // AppstoreAddOutlined,
  BlockOutlined,
  DesktopOutlined,
  PieChartOutlined,
  ReconciliationOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  WalletOutlined
} from '@ant-design/icons'
import { IoFastFood } from 'react-icons//io5'
import { Layout, Menu, MenuProps } from 'antd'
import logo from '../../assets/logo-branca.png'
import miniLogo from '../../assets/peditz.jpeg'

import React from 'react'
import { Link } from 'react-router-dom'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

interface ItemProps {
  label: React.ReactNode
  key: React.Key
  icon?: React.ReactNode
  children?: MenuItem[]
  style?: React.CSSProperties
  type?: 'group'
}

function getItem({ key, label, children, icon, style, type }: ItemProps): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style: style || {}
  } as MenuItem
}

const items: MenuItem[] = [
  getItem({
    key: '1',
    label: <Link to={'/dashboard'}>Dashboard</Link>,
    icon: <PieChartOutlined />
  }),

  getItem({
    key: '2',
    label: <Link to={'/caixa'}>Caixa</Link>,
    icon: <DesktopOutlined />
  }),

  getItem({
    key: 'sub1',
    label: 'Produtos',
    icon: <IoFastFood />,
    children: [
      getItem({
        key: '4',
        label: <Link to={'/produtos'}>Lista de produtos</Link>
      }),
      getItem({
        key: '5',
        label: <Link to={'/produtos/categorias'}>Categorias</Link>
      })
    ]
  }),

  getItem({
    key: '6',
    label: <Link to={'/comandas'}>Comandas</Link>,
    icon: <WalletOutlined />
  }),

  getItem({
    key: '7',
    label: <Link to={'/mesas'}>Mesas</Link>,
    icon: <BlockOutlined />
  }),

  getItem({
    key: '8',
    label: <Link to={'/estoque'}>Estoques</Link>,
    icon: <ShoppingOutlined />
  }),

  getItem({
    key: '9',
    label: <Link to={'/relatorios'}>Relatórios</Link>,
    icon: <SolutionOutlined />
  }),

  // getItem({
  // 	key: '10',
  // 	label: <Link to={'/aplicativos'}>Aplicativos</Link>,
  // 	icon: <AppstoreAddOutlined />,
  // }),

  getItem({
    key: '10',
    label: <Link to={'/integracoes'}>Integrações</Link>,
    icon: <ApiOutlined />
  }),
  getItem({
    key: '11',
    label: <Link to={'/terminal'}>Terminal de pedidos</Link>,
    icon: <ReconciliationOutlined />
  })
]

interface SideBarProps {
  collapsed: boolean
}

export const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {
  return (
    <Sider
      trigger={null}
      collapsible
      width={280}
      collapsed={collapsed}
      style={{
        height: '100vh',
        backgroundColor: '#47aa54',
        padding: '20px',
        transition: 'all 1s'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '30px'
        }}
      >
        {collapsed ? (
          <img
            src={miniLogo}
            alt="Peditz"
            style={{
              width: '80px',
              transition: 'all 1s'
            }}
          />
        ) : (
          <img
            src={logo}
            alt="Peditz"
            style={{
              width: '230px',
              transition: 'all 1.5s'
            }}
          />
        )}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        style={{
          width: '100%',
          backgroundColor: '#47aa54',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '10px'
        }}
        mode="inline"
        theme="dark"
        items={items}
      />
    </Sider>
  )
}
