import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
export const ResumeCommand = styled.div<{ billOpen: boolean }>`
  width: ${(props) => (props.billOpen ? '65%' : '100%')};
  height: calc(100vh - 18rem);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 30px;
`

export const ResumeFinance = styled.div`
  width: 35%;
  max-height: calc(100vh - 18rem);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 30px;
`

export const ActionsPayments = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  flex: 1;
`
export const RowCards = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`

export const CardInfo = styled.div`
  display: flex;
  flex: 1;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`
