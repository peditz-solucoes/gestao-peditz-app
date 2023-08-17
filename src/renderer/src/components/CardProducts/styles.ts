import styled from 'styled-components'

export const Container = styled.div`
  width: 320px;
  min-width: 320px;
  height: 390px;
  min-height: 390px;
  border-radius: 15px;
  background-color: #fff;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }
`

export const ContainerImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`
export const ButtonGroup = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
`
