import { Alert, Button, Drawer, Input, Space, Switch } from 'antd'
import React from 'react'
import { SiIfood } from 'react-icons/si'

interface DrawerIfoodProps {
  open: boolean
  onClose: () => void
}

export const DrawerIfood: React.FC<DrawerIfoodProps> = ({ open, onClose }) => {
  const [link, setLink] = React.useState<boolean>(true)

  return (
    <Drawer
      onClose={onClose}
      open={open}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex' }}>
            <h4>Integração ifood </h4>
            <SiIfood
              style={{
                color: '#F7001A',
                fontSize: 20,
                marginLeft: 10
              }}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <Switch
              style={{
                marginLeft: 20
              }}
              defaultChecked
              checkedChildren="Ativado"
              unCheckedChildren="Desativado"
            />
          </div>
        </div>
      }
      width={500}
    >
      <Alert
        type="info"
        showIcon
        description="Use está integração para sincronizar pedidos realizados no ifood e gerenciá-los aqui mesmo na sua plataforma de pedidos. "
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 20,
          marginTop: 20
        }}
      >
        {!link ? (
          <>
            <Button
              type="primary"
              size="large"
              icon={<SiIfood />}
              onClick={() => setLink(true)}
              style={{
                backgroundColor: '#F7001A',
                height: 50
              }}
            >
              Gerar codigo de ativação
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              size="large"
              icon={<SiIfood />}
              onClick={() => setLink(false)}
              style={{
                backgroundColor: '#F7001A',
                height: 50
              }}
            >
              Gerar novo link de autorização
            </Button>
            <Alert
              type="success"
              description={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15
                  }}
                >
                  <h3
                    style={{
                      color: '#25D366'
                    }}
                  >
                    Link de autorização gerado com sucesso.
                  </h3>
                  <p
                    style={{
                      color: '#25D366'
                    }}
                  >
                    Certifique-se de clicar no botão fornecido abaixo para acessar a plataforma do
                    iFood e conceder a autorização necessária para integrar os sistemas. Após a
                    conclusão desse processo, você poderá copiar o código de autorização gerado e
                    colá-lo no campo designado logo abaixo.
                  </p>
                  <Button type="primary" style={{}}>
                    Autorizar no iFood
                  </Button>
                </div>
              }
            />

            <div>
              <Space.Compact style={{ width: '100%' }}>
                <Input size="large" placeholder="Codigo de autorização" />
                <Button size="large" type="primary">
                  Salvar
                </Button>
              </Space.Compact>
            </div>
          </>
        )}
      </div>
    </Drawer>
  )
}
