import { styled } from 'styled-components'

export const Container = styled.div`
  width: 100%;
  padding: 20px 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 20px;
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`
