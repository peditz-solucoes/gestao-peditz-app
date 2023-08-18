import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`

export const Header = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
`

export const ContentTable = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 250px));
  gap: 30px;
  justify-content: center;
`

export const CardTable = styled.div`
  width: 250px;
  max-height: 250px;
  padding: 20px 10px;
  border-radius: 10px;
  background-color: #fff;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
  }
`
