import styled from "styled-components";

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
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  overflow: auto;
  height: calc(100vh - 200px);
`
