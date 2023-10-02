import {
  ApiOutlined,
  // AppstoreAddOutlined,
  BlockOutlined,
  DesktopOutlined,
  PieChartOutlined,
  ReconciliationOutlined,
  // ShoppingOutlined,
  SolutionOutlined,
  WalletOutlined,
  // ShopOutlined
} from '@ant-design/icons'
import { IoFastFood } from 'react-icons//io5'
import { Layout, Menu, MenuProps } from 'antd'
import logo from '../../assets/logo-branca.png'
import miniLogo from '../../assets/peditz.jpeg'

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserPermissions } from '@renderer/types'
import api from '@renderer/services/api'
import { AxiosError } from 'axios'
import { errorActions } from '@renderer/utils/errorActions'
// import { PiNotepadBold } from 'react-icons/pi'

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

interface SideBarProps {
  collapsed: boolean
}

export const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {
  const [userPermissions, setUserPermissions] = React.useState<string[]>([])

  useEffect(() => {
    fetchUserPermission()
  }, [])

  function fetchUserPermission(): void {
    api
      .get('/user-permissions/')
      .then((response) => {
        const permissions = (response.data as UserPermissions[])
          .map((permission) => permission.sidebar_permissions.map((sidebar) => sidebar.title))
          .flat()
        localStorage.setItem('userPermissions', JSON.stringify(permissions))
        setUserPermissions(permissions)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  const items: MenuItem[] = [
    getItem({
      key: '1',
      label: <Link to={'/dashboard'}>Dashboard</Link>,
      icon: <PieChartOutlined />,
      style: {
        display: userPermissions.includes('Dashboard') ? 'flex' : 'none'
      }
    }),

    getItem({
      key: '2',
      label: <Link to={'/caixa'}>Caixa</Link>,
      icon: <DesktopOutlined />,
      style: {
        display: userPermissions.includes('Caixa') ? 'flex' : 'none'
      }
    }),

    // getItem({
    //   key: '3',
    //   label: <Link to={'/pedidos-balcao/'}>Pedidos de balcão</Link>,
    //   icon: <ShopOutlined />
    //   // style: {
    //   //   display: userPermissions.includes('Balcão') ? 'flex' : 'none',
    //   //   flexDirection: 'column'
    //   // },
    // }),

    // getItem({
    //   key: '4',
    //   label: <Link to={'/pedidos/'}>Gerenciador de pedidos</Link>,
    //   icon: <PiNotepadBold />
    //   // style: {
    //   //   display: userPermissions.includes('Balcão') ? 'flex' : 'none',
    //   //   flexDirection: 'column'
    //   // },
    // }),

    getItem({
      key: '5',
      label: 'Produtos',
      icon: <IoFastFood />,
      style: {
        display: userPermissions.includes('Produtos') ? 'flex' : 'none',
        flexDirection: 'column'
      },
      children: [
        getItem({
          key: '5.1',
          label: <Link to={'/produtos'}>Lista de produtos</Link>
        }),
        getItem({
          key: '5.2',
          label: <Link to={'/produtos/categorias'}>Categorias</Link>
        })
      ]
    }),

    getItem({
      key: '6',
      label: 'Comandas',
      icon: <WalletOutlined />,
      style: {
        display: userPermissions.includes('Comandas') ? 'flex' : 'none',
        flexDirection: 'column'
      },
      children: [
        getItem({
          key: '6.1',
          label: <Link to={'/comandas'}>Abertas</Link>
        }),
        getItem({
          key: '6.2',
          label: <Link to={'/comandas-fechadas'}>Fechadas</Link>
        })
      ]
    }),

    getItem({
      key: '7',
      label: <Link to={'/mesas'}>Mesas</Link>,
      icon: <BlockOutlined />,
      style: {
        display: userPermissions.includes('Mesas') ? 'flex' : 'none'
      }
    }),

    // getItem({
    //   key: '8',
    //   label: <Link to={'/estoque'}>Estoques</Link>,
    //   icon: <ShoppingOutlined />,
    //   style: {
    //     display: userPermissions.includes('Estoques') ? 'flex' : 'none'
    //   }
    // }),

    getItem({
      key: '9',
      label: 'Relatórios',
      icon: <SolutionOutlined />,
      style: {
        display: userPermissions.includes('Produtos') ? 'flex' : 'none',
        flexDirection: 'column'
      },
      children: [
        getItem({
          key: '9.1',
          label: <Link to={'/relatorios/financeiro'}>Vendas por período</Link>
        }),
        // getItem({
        //   key: '9.2',
        //   label: 'Vendas por produto'
        // }),
        // getItem({
        //   key: '9.3',
        //   label: 'Relatório geral'
        // }),
        getItem({
          key: '9.4',
          label: <Link to={'/relatorios/caixas-passados'}>Caixas Passados</Link>
        })
        // getItem({
        //   key: '9.5',
        //   label: 'Taxas de serviço'
        // })
      ]
    }),

    // getItem({
    //   key: '10',
    //   label: <Link to={'/aplicativos'}>Aplicativos</Link>,
    //   icon: <AppstoreAddOutlined />,
    //   style: {
    //     display: userPermissions.includes('Aplicativos') ? 'flex' : 'none'
    //   }
    // }),

    getItem({
      key: '11',
      label: <Link to={'/integracoes'}>Integrações</Link>,
      icon: <ApiOutlined />,
      style: {
        display: userPermissions.includes('Integracoes') ? 'flex' : 'none'
      }
    }),
    getItem({
      key: '12',
      label: <Link to={'/terminal'}>Terminal de pedidos</Link>,
      icon: <ReconciliationOutlined />,
      style: {
        display: userPermissions.includes('Terminal') ? 'flex' : 'none'
      }
    })
  ]

  return (
    <Sider
      trigger={null}
      collapsible
      width={280}
      collapsed={collapsed}
      style={{
        height: '100vh',
        overflowY: 'auto',
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
          gap: '10px'
        }}
        mode="inline"
        theme="dark"
        items={items}
      />
    </Sider>
  )
}
