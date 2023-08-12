import { Image } from "antd"
import styled from "styled-components"


export const Container = styled.div`
  width: 320px;
  height: 390px;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow:  5px 5px 8px rgba(0, 0, 0, 0.2);
`

export const ContainerImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Img = styled(Image)`
  width: 70%;
  height: 70%;
  border-radius: 20px;
`

export const ContainerInfo = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  flex-direction: column;
`