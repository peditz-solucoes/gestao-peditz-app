import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
  width: 100%;

  ::-webkit-scrollbar {
    width: 0 !important;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent !important;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent !important;
    border-radius: 0;
  }
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-bottom: 30px;
`

export const ContentProducts = styled.div`
  width: 70%;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  overflow-y: scroll;
`

export const Title = styled.h3`
  &:hover {
    cursor: pointer;
    color: #2faa54;
    transition: ease 0.5s;
  }
`

export const CardProduct = styled.div`
  cursor: pointer;
  /* width: 170px; */
  /* height: 240px; */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`

export const CountProduct = styled.div`
  width: 30px;
  cursor: pointer;
  height: 30px;
  border-radius: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;

  &:hover {
    background-color: #ea2c2c;
    color: #fff;
  }
`

export const CategoryProducts = styled.div`
  max-width: 100%;
  overflow-x: scroll;
  border-bottom: 1px solid #fff;
  background-color: #f2f2f2;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
`

export const ContentInfo = styled.div`
  width: 30%;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
`
