import { styled } from 'styled-components'

export const Container = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
`

export const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const Card = styled.div``

export const CardInfo = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px 20px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`
export const CardsInfoFinance = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 1rem;
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
