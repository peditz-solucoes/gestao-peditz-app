import { StatusDelivery, DeliveryOrder } from '@renderer/types'

interface DeliveryStatus {
  status: StatusDelivery
  color: string
  text: string
  title: string
}

export const deliveryStatus: DeliveryStatus[] = [
  {
    status: 'WAITING',
    color: 'orange',
    text: 'black',
    title: 'Aguardando confirmação'
  },
  {
    status: 'IN_PROGRESS',
    color: 'purple',
    text: 'white',
    title: 'Em produção'
  },
  {
    status: 'IN_ROUTE',
    color: 'blue',
    text: 'white',
    title: 'Saiu para entrega'
  },
  {
    status: 'DELIVERED',
    color: 'green',
    text: 'white',
    title: 'Entregue'
  },
  {
    status: 'CANCELED',
    color: 'red',
    text: 'white',
    title: 'Cancelado'
  }
]

export const getLastStatus = (status: DeliveryOrder | null): StatusDelivery => {
  return status?.status[status?.status.length - 1].title ?? 'WAITING'
}
