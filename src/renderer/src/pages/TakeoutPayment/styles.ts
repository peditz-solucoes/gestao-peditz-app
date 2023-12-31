import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  padding: 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 60px);
  overflow-y: scroll;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Spacer = styled.div`
  background-color: #fff;
  height: auto;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #0000000d;
  padding: 15px;
`
