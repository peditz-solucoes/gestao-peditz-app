import { Tag } from 'antd'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 20px;

  ::-webkit-scrollbar {
    width: 5 !important;
  }

  ::-webkit-scrollbar-track {
    background-color: #f4f4f4 !important;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #e3e3e3 !important;
    border-radius: 0;
  }
`

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

export const TagStatus = styled(Tag)<{ bgColor?: string; borderColor?: string }>`
  font-size: 1rem;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  color: rgb(72, 84, 96);
  display: flex;
  gap: 6px;
  align-items: center;

  &:hover {
    color: ${({ borderColor }) => borderColor};
    background-color: ${({ bgColor }) => bgColor};
    border-color: ${({ borderColor }) => borderColor};
  }
`

export const OrdersContainer = styled.div`
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  padding: 20px 0;
  margin-top: 15px;
  display: grid;
`
