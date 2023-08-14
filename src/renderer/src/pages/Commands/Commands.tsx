import React, { useEffect } from 'react'
import * as S from './styles'
import { Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { CreateCommandModal } from '../../components/CreateCommandModal'
import { Bill } from '../../types'
import api from '../../services/api'
import { AxiosError } from 'axios'
import { errorActions } from '../../utils/errorActions'
import { CardBill } from '../../components/CardBill'

const { Search } = Input

export const Commands: React.FC = () => {
  const [commands, setCommands] = React.useState<Bill[]>([] as Bill[])
  const [search, setSearch] = React.useState('')
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  useEffect(() => {
    fetchCommands()
  }, [])

  function fetchCommands(): void {
    api
      .get('/bill/')
      .then((response) => {
        setCommands(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  return (
    <>
      <S.Container>
        <S.HeaderFilter>
          <div
            style={{
              display: 'flex',
              gap: 10
            }}
          >
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={(): void => setIsModalVisible(true)}
            >
              Criar Comanda
            </Button>
            <Search
              placeholder="Digite o numero da comanda, nome do cliente ou mesa."
              allowClear
              size="large"
              onChange={(e): void => setSearch(e.target.value)}
              style={{
                width: 400
              }}
            />
          </div>
        </S.HeaderFilter>

        <S.ListContainer>
          {commands
            .filter((command) => {
              return (
                command.number.toString().startsWith(search) ||
                command?.table_datail?.title.toString().startsWith(search) ||
                command?.client_name.toLowerCase().startsWith(search.toLowerCase())
              )
            })
            .map((command) => {
              return <CardBill key={command.id} data={command} />
            })}
        </S.ListContainer>
      </S.Container>
      <CreateCommandModal visible={isModalVisible} onClose={(): void => setIsModalVisible(false)} />
    </>
  )
}
