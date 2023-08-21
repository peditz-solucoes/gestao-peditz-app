import { StackSimple } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import * as S from './styles'
import { Avatar, Badge, Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Tables } from '../../types'
import { errorActions } from '../../utils/errorActions'
import { AxiosError } from 'axios'
import { CreateTable } from '../../components/CreateTable'

const { Title, Text } = Typography

export const TablesPage: React.FC = () => {
  const navigate = useNavigate()
  const [tables, setTables] = useState<Tables[]>([])
  const [isVisibleCreateTable, setIsVisibleCreateTable] = useState<boolean>(false)

  useEffect(() => {
    fetchTables()
  }, [])

  function fetchTables() {
    api
      .get('/tables')
      .then((response) => {
        setTables(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  return (
    <>
      <S.Container>
        <S.Header>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsVisibleCreateTable(true)}
          >
            Nova mesa
          </Button>
        </S.Header>

        <S.ContentTable>
          {tables.map((table) => (
            <Badge.Ribbon
              key={table.id}
              text={table.bills.length > 0 ? 'Mesa Ocupada' : 'Mesa livre'}
              color={table.bills.length > 0 ? 'red' : 'green'}
            >
              <S.CardTable onClick={() => navigate(`/mesas/${table.id}/`)}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    size={'large'}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#E2E8F0'
                    }}
                    icon={
                      <StackSimple
                        size={32}
                        style={{
                          color: '#718096'
                        }}
                      />
                    }
                  />
                  <Title level={4}>Mesa {table.title}</Title>
                  <Text type="secondary">{table.capacity} lugares</Text>
                </div>
                {/* <Divider
                  type="horizontal"
                  plain
                  style={{
                    color: '#718096',
                    margin: '8px 0'
                  }}
                >
                  {' '}
                  Dados da mesa
                </Divider>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Text type="secondary" strong>
                    permanência: 1h 30min
                  </Text>
                  <Text type="secondary" strong>
                    Valor total: R$ 50,00
                  </Text>
                </div> */}
              </S.CardTable>
            </Badge.Ribbon>
          ))}
        </S.ContentTable>
      </S.Container>
      <CreateTable
        visible={isVisibleCreateTable}
        onCancel={() => setIsVisibleCreateTable(false)}
        onFetch={() => fetchTables()}
      />
    </>
  )
}
