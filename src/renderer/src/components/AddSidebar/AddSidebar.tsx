import React, { useState } from 'react'
import { SideBar } from '../Sidebar'
import { Layout } from 'antd'
import { Header } from '../Header'

interface AddSidebarProps {
  children: React.ReactNode
  titleHeader?: string
}

const { Content } = Layout

export const AddSidebar: React.FC<AddSidebarProps> = ({ children, titleHeader }) => {
  const [collapsed, setCollapsed] = useState(true)

  function toggleCollapsed(): void {
    setCollapsed(!collapsed)
  }

  return (
    <>
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
          <Content>{children}</Content>
        </div>
      </Layout>
    </>
  )
}
