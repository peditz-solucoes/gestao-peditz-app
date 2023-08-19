import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  padding: 20px;
  overflow-y: scroll;
`

export const RowMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-gap: 20px;
`

export const Card = styled.div`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`
