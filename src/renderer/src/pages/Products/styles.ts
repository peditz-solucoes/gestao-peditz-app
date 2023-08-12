import styled from "styled-components"


export const Container = styled.div`
  width: 100%;
`

export const Header = styled.header`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
`

export const TitleCategory = styled.h1`
  padding: 10px 40px;
  width: 95%;
  gap: 10px;
  font-size: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex-direction: row;
  font-weight: bold;
`

export const Content = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px 40px;
  gap: 10px;
  overflow-x: auto;
`
