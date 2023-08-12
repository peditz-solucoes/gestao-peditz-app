import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px ;
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
`