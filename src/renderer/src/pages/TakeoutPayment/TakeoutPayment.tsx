import * as S from './styles'

export const TakeoutPayment: React.FC = () => {
  return (
    <S.Container>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridGap: '1rem'
        }}
      >
        <S.Spacer>Cliente</S.Spacer>
        <S.Spacer>Resumo de pedidos</S.Spacer>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridGap: '1rem'
        }}
      >
        <S.Spacer>Observação</S.Spacer>
        <S.Spacer>Meios de pagamentos</S.Spacer>
      </div>
    </S.Container>
  )
}
