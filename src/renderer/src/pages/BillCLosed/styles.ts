import { styled } from "styled-components"

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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  place-items: center;
  grid-gap: 15px;
  grid-auto-flow: row;
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 170px);
`
