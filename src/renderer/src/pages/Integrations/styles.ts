import { styled } from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100vh; /* Define a altura total da janela de visualização */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  overflow-y: auto; /* Use 'auto' para mostrar a barra de rolagem apenas quando necessário */
  gap: 80px;
  padding: 0 30px;
`

export const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 250px));
  justify-content: center;
  gap: 30px;
  width: 100%;
`
