import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  padding: 20px 20px;
`

export const HeaderFilter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 16px;
`

export const ContentCommands = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  overflow: auto;
  height: calc(100vh - 50px);
`
export const ListContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  place-items: center;
  grid-gap: 15px;
  max-height: calc(100vh - 170px);
  overflow-y: scroll;
`
