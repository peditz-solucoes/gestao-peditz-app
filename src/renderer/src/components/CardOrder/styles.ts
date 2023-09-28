import styled from 'styled-components'

export const Container = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  gap: 15px;
  cursor: pointer;
  min-height: 230px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
  background-color: #fff;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    border-bottom: 8px solid #2faa54;
    background-color: rgba(47, 170, 84, 0.1);
  }
`

export const OrderInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
