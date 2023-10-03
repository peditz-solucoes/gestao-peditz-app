import React from 'react'
import * as S from './styles'
import { FormEmployer } from '../../components/FormEmployer'

export const EmployerRegisterPage: React.FC = () => {
  return (
    <S.Container>
      <FormEmployer type="create" />
    </S.Container>
  )
}
