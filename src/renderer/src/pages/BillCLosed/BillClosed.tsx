import api from '@renderer/services/api'
import { Bill } from '@renderer/types'
import { errorActions } from '@renderer/utils/errorActions'
import { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { Input } from 'antd'
import { CardBill } from '@renderer/components/CardBill'
import * as S from './styles'
import { useCashier } from '@renderer/hooks'

const { Search } = Input

export const BillClosedPage: React.FC = () => {
  const [commands, setCommands] = React.useState<Bill[]>([] as Bill[])
  const [search, setSearch] = React.useState('')
  const { getCashier } = useCashier()

  useEffect(() => {
    console.log(getCashier)
    fetchCommands()
  }, [])

  function fetchCommands(): void {
    api
      .get(`/bill/?open=false&cashier=${getCashier.id}`)
      .then((response) => {
        setCommands(response.data)
      })
      .catch((error: AxiosError) => {
        errorActions(error)
      })
  }

  return (
    <S.Container>
      <S.HeaderFilter>
        <div
          style={{
            display: 'flex',
            gap: 10
          }}
        >
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
              command?.client_name?.toLowerCase().startsWith(search.toLowerCase())
            )
          })
          .map((command) => {
            return <CardBill key={command.id} data={command} />
          })}
      </S.ListContainer>
    </S.Container>
  )
}
