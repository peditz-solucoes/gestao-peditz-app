import { Button } from 'antd'
import styled from 'styled-components'

export const Container = styled.div`
  /* width: 100%; */
  /* height: 100%; */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const CardInfo = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px 20px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ButtonBox = styled(Button)`
  font-weight: bold;
  height: 2.25rem;
`

export const CardsInfoFinance = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`

export const CardInfoFinance = styled.div`
  display: flex;
  flex: 1;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  flex-direction: column;
  gap: 10px;
`

export const TableContainer = styled.div`
  max-width: 100%;
  max-height: 100%;
`
