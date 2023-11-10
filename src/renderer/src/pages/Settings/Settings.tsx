import React from 'react'
import * as S from './styles'
import { Tabs, TabsProps } from 'antd'
import { Geraltab } from './components/Geral/Geral'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Geral',
    children: <Geraltab />
  },
  {
    key: '2',
    label: 'Impressoras',
    children: 'Content of Tab Pane 2'
  },
  {
    key: '3',
    label: 'Pedidos e vendas',
    children: 'Content of Tab Pane 3'
  },
  {
    key: '4',
    label: 'Integrações',
    children: 'Content of Tab Pane 4'
  },
  {
    key: '5',
    label: 'Pagamentos',
    children: 'Content of Tab Pane 5'
  },
  {
    key: '6',
    label: 'Delivery',
    children: 'Content of Tab Pane 6'
  }
]

export const Settings: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <S.Container>
      <S.ContainerTabs>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </S.ContainerTabs>
    </S.Container>
  )
}
