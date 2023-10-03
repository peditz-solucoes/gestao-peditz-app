import * as S from './styles'
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Input,
  Tag,
  Tooltip,
  Typography,
  notification
} from 'antd'
import { UserOutlined, WhatsAppOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons'
import { formatCurrency } from '@renderer/utils'

const { Title, Paragraph } = Typography

export const TakeoutPayment: React.FC = () => {
  const [api, contextHolder] = notification.useNotification()

  function handleRedirectWpp() {
    window.open('https://api.whatsapp.com/send?phone=559981248041&text=', '_blank')
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText('lucassdeveloper@gmail.com')
    api.info({
      message: `Email copiado para a área de transferência`,
      placement: 'top',
      duration: 3
    })
  }

  return (
    <>
      {contextHolder}
      <S.Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem'
          }}
        >
          <S.Spacer>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
                Cliente selecionado
              </Title>
              <Button
                type="default"
                icon={<CloseOutlined />}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none'
                }}
              />
            </div>
            <div
              style={{
                backgroundColor: '#F7F7F8',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <Avatar
                  size={'large'}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#4faa6b' }}
                />
                <Title level={5} style={{ color: 'rgb(54, 63, 77)', margin: 0 }}>
                  Lucas Carvalho
                </Title>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1.25rem',
                  alignItems: 'center'
                }}
              >
                <Tooltip title="Encaminhar para o whatsapp">
                  <Paragraph
                    strong
                    onClick={handleRedirectWpp}
                    style={{ fontSize: '1rem', color: '#4faa6b', margin: 0, cursor: 'pointer' }}
                  >
                    <WhatsAppOutlined /> +55 (11) 99999-9999
                  </Paragraph>
                </Tooltip>
                <Tooltip title="Copiar email">
                  <Paragraph
                    strong
                    onClick={handleCopyToClipboard}
                    style={{ fontSize: '1rem', color: '#4faa6b', margin: 0, cursor: 'copy' }}
                  >
                    <MailOutlined /> +55 (11) 99999-9999
                  </Paragraph>
                </Tooltip>
              </div>
            </div>
          </S.Spacer>
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Resumo do pedido
            </Title>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <Paragraph style={{ color: 'rgb(54, 63, 77)', fontSize: '1rem', margin: 0 }}>
                Subtotal dos produtos:
              </Paragraph>
              <Title level={4} style={{ margin: 0, color: 'rgb(54, 63, 77)' }}>
                {formatCurrency(124.9)}
              </Title>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Paragraph style={{ color: 'rgb(54, 63, 77)', fontSize: '1rem', margin: 0 }}>
                Descontos:
              </Paragraph>
              <Tag
                color="red"
                closable
                style={{
                  fontSize: '1rem',
                  padding: '5px',
                  margin: 0
                }}
              >
                {formatCurrency(15)} - (10%)
              </Tag>
            </div>
            <Divider />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Title level={3} style={{ color: 'rgb(54, 63, 77)', margin: 0 }}>
                Total
              </Title>
              <Title level={4} style={{ margin: 0, color: 'rgb(54, 63, 77)' }}>
                {formatCurrency(124.9)}
              </Title>
            </div>
          </S.Spacer>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem'
          }}
        >
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Observações
            </Title>
            <Input.TextArea placeholder="Alguma observação para o pedido" rows={4} />
            <Checkbox
              style={{
                marginTop: '1rem'
              }}
            >
              Exibir na impressão
            </Checkbox>
          </S.Spacer>
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              Formas de pagamento
            </Title>
          </S.Spacer>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '1rem'
          }}
        >
          <S.Spacer>
            <Title level={4} style={{ color: 'rgb(54, 63, 77)' }}>
              2 Items
            </Title>
          </S.Spacer>
        </div>
      </S.Container>
    </>
  )
}
