import React, { useState } from 'react'
import * as S from './styles'
import { Alert, Button, Checkbox, Form, Image, Input, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { AxiosError, AxiosResponse } from 'axios'
import { setLogin } from '../../services/auth'


const { Paragraph } = Typography

interface FormValues {
  email: string
  password: string
  remenber: boolean
}

interface errorType {
  type: 'invalid' | 'error'
  message: string
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<errorType | null>(null)
  const navigate = useNavigate()

  function getErrorMessage() {
    if (error?.type === 'invalid') {
      return <Alert message={error.message} type="error" />
    } else if (error?.type === 'error') {
      return <Alert message={error.message} type="error" />
    }

    return null
  }

  const onFinish = ({ email, password }: FormValues) => {
    setIsLoading(true)
    api
      .post('/auth/login/', { email, password })
      .then((response: AxiosResponse) => {
        setLogin(response.data.access)
        navigate('/dashboard')
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          setError({
            type: 'invalid',
            message: 'Email ou senha inválidos'
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <S.Container>
      <S.Box>
        <Image
          src="src/renderer/src/assets/logo-branca.png"
          preview={false}
          style={{
            width: '300px'
          }}
        />
        <Paragraph>Seu negócio ainda não faz parte da Peditz?</Paragraph>
        <Paragraph
          strong
          style={{
            color: '#47aa54'
          }}
        >
          Teste grátis agora mesmo!
        </Paragraph>

        <div
          style={{
            width: '100%',
            marginTop: '30px'
          }}
        >
          <Form name="normal_login" layout="vertical" autoComplete="on" onFinish={onFinish}>
            <div
              style={{
                display: 'flex',
                gap: '5px',
                flexDirection: 'column'
              }}
            >
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    required: true,
                    message: 'O Email é necessário para efetuar o login!'
                  }
                ]}
              >
                <Input placeholder="E-mail" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Senha"
                rules={[
                  {
                    required: true,
                    message: 'A senha é necessário para efetuar o login!'
                  }
                ]}
              >
                <Input.Password placeholder="Senha" visibilityToggle />
              </Form.Item>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: '10px'
                }}
              >
                {getErrorMessage()}
              </div>
            )}

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar-me</Checkbox>
              </Form.Item>

              <Link
                to={'/'}
                style={{
                  color: '#47aa54',
                  fontWeight: 'bold',
                  marginLeft: '155px'
                }}
              >
                Esqueceu a senha ?
              </Link>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{
                  backgroundColor: '#47aa54',
                  width: '100%'
                }}
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </S.Box>
    </S.Container>
  )
}
