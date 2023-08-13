import { Avatar, Badge, Button } from 'antd'
import React from 'react'

interface CardHabilitatedProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  status?: boolean
  badge?: {
    text: string
    active: boolean
  }
  button: {
    text: string
    onClick?: () => void
    type: 'primary' | 'dashed' | 'link' | 'text' | undefined
    disabled?: boolean
  }
  style: {
    backgroundColor: string
  }
}

export const CardHabilitated: React.FC<CardHabilitatedProps> = ({
  icon,
  title,
  status,
  style,
  button,
  description = 'Aprimore a integração para otimizar sua experiência na loja.',
  badge
}) => {
  return (
    <>
      {badge?.active ? (
        <Badge.Ribbon text={badge.text}>
          <div
            style={{
              width: '250px',
              maxWidth: '250px',
              maxHeight: '280px',
              height: '280px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.09)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <Avatar
                size={72}
                icon={icon}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: style?.backgroundColor
                }}
              />
            </div>
            <h3>{title}</h3>
            {status ? <p>Integração</p> : null}
            {description ? (
              <p
                style={{
                  textAlign: 'center'
                }}
              >
                {description}
              </p>
            ) : null}
            <Button
              type={button.type}
              disabled={button.disabled}
              size="large"
              onClick={button.onClick}
            >
              {button?.text ? button.text : 'Configurar'}
            </Button>
          </div>
        </Badge.Ribbon>
      ) : (
        <div
          style={{
            width: '250px',
            height: '280px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.09)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <Avatar
              size={72}
              icon={icon}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: style?.backgroundColor
              }}
            />
          </div>
          <h3>{title}</h3>
          {status ? <p>Integração</p> : null}
          {description ? (
            <p
              style={{
                textAlign: 'center'
              }}
            >
              {description}
            </p>
          ) : null}
          <Button type={button.type} size="large" onClick={button.onClick}>
            {button?.text ? button.text : 'Configurar'}
          </Button>
        </div>
      )}
    </>
  )
}
