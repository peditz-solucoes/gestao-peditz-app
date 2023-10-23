import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { Button, DatePicker, Form, Select, Typography, Table } from 'antd'
import { useProducts } from '@renderer/hooks'
import { ColumnsType } from 'antd/es/table'
const { RangePicker } = DatePicker

const { Title } = Typography

interface DataTypeProductsSales {
  code: string
  name: string
  quantity: number
  cost: string
  bill: string
}

const columns: ColumnsType<DataTypeProductsSales> = [
  {
    title: 'CÓDIGO',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'NOME',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'QUANTIDADE',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'CUSTO',
    key: 'cost',
    dataIndex: 'cost'
  },
  {
    title: 'FATURADO',
    key: 'bill',
    dataIndex: 'bill'
  }
]

const dataProductsSale: DataTypeProductsSales[] = [
  {
    name: 'Sanduíche natural',
    code: '0001',
    quantity: 32,
    cost: 'R$ 5,00',
    bill: 'R$ 1.000,00'
  },
  {
    name: 'Hamburguer',
    code: '0002',
    quantity: 25,
    cost: 'R$ 6,50',
    bill: 'R$ 162,50'
  },
  {
    name: 'Batata frita',
    code: '0003',
    quantity: 40,
    cost: 'R$ 3,00',
    bill: 'R$ 120,00'
  },
  {
    name: 'Refrigerante',
    code: '0004',
    quantity: 50,
    cost: 'R$ 2,50',
    bill: 'R$ 125,00'
  },
  {
    name: 'Salada Caesar',
    code: '0005',
    quantity: 20,
    cost: 'R$ 7,00',
    bill: 'R$ 140,00'
  },
  {
    name: 'Pizza Margherita',
    code: '0006',
    quantity: 15,
    cost: 'R$ 8,00',
    bill: 'R$ 120,00'
  },
  {
    name: 'Sushi de salmão',
    code: '0007',
    quantity: 30,
    cost: 'R$ 10,00',
    bill: 'R$ 300,00'
  },
  {
    name: 'Frango frito',
    code: '0008',
    quantity: 35,
    cost: 'R$ 4,00',
    bill: 'R$ 140,00'
  },
  {
    name: 'Cachorro-quente',
    code: '0009',
    quantity: 28,
    cost: 'R$ 3,50',
    bill: 'R$ 98,00'
  },
  {
    name: 'Taco de carne',
    code: '0010',
    quantity: 22,
    cost: 'R$ 6,00',
    bill: 'R$ 132,00'
  },
  {
    name: 'Sorvete de chocolate',
    code: '0011',
    quantity: 40,
    cost: 'R$ 2,00',
    bill: 'R$ 80,00'
  },
  {
    name: 'Pão com queijo',
    code: '0012',
    quantity: 30,
    cost: 'R$ 4,50',
    bill: 'R$ 135,00'
  },
  {
    name: 'Café expresso',
    code: '0013',
    quantity: 45,
    cost: 'R$ 2,00',
    bill: 'R$ 90,00'
  },
  {
    name: 'Milk-shake de morango',
    code: '0014',
    quantity: 18,
    cost: 'R$ 7,00',
    bill: 'R$ 126,00'
  },
  {
    name: 'Lasanha à bolonhesa',
    code: '0015',
    quantity: 12,
    cost: 'R$ 9,00',
    bill: 'R$ 108,00'
  },
  {
    name: 'Torta de maçã',
    code: '0016',
    quantity: 20,
    cost: 'R$ 5,00',
    bill: 'R$ 100,00'
  },
  {
    name: 'Salada de frutas',
    code: '0017',
    quantity: 30,
    cost: 'R$ 6,50',
    bill: 'R$ 195,00'
  },
  {
    name: 'Coxinha de frango',
    code: '0018',
    quantity: 25,
    cost: 'R$ 3,50',
    bill: 'R$ 87,50'
  },
  {
    name: 'Espaguete à carbonara',
    code: '0019',
    quantity: 15,
    cost: 'R$ 8,50',
    bill: 'R$ 127,50'
  },
  {
    name: 'Sorvete de baunilha',
    code: '0020',
    quantity: 40,
    cost: 'R$ 2,50',
    bill: 'R$ 100,00'
  },
  {
    name: 'Sanduíche de frango',
    code: '0021',
    quantity: 35,
    cost: 'R$ 4,00',
    bill: 'R$ 140,00'
  },
  {
    name: 'Taco de peixe',
    code: '0022',
    quantity: 20,
    cost: 'R$ 6,00',
    bill: 'R$ 120,00'
  },
  {
    name: 'Sorvete de morango',
    code: '0023',
    quantity: 30,
    cost: 'R$ 2,00',
    bill: 'R$ 60,00'
  },
  {
    name: 'Pão com presunto',
    code: '0024',
    quantity: 28,
    cost: 'R$ 4,50',
    bill: 'R$ 126,00'
  },
  {
    name: 'Café com leite',
    code: '0025',
    quantity: 45,
    cost: 'R$ 2,50',
    bill: 'R$ 112,50'
  },
  {
    name: 'Milk-shake de baunilha',
    code: '0026',
    quantity: 18,
    cost: 'R$ 7,00',
    bill: 'R$ 126,00'
  },
  {
    name: 'Lasanha vegetariana',
    code: '0027',
    quantity: 12,
    cost: 'R$ 9,50',
    bill: 'R$ 114,00'
  },
  {
    name: 'Torta de morango',
    code: '0028',
    quantity: 20,
    cost: 'R$ 5,50',
    bill: 'R$ 110,00'
  },
  {
    name: 'Salada de frango',
    code: '0029',
    quantity: 30,
    cost: 'R$ 6,00',
    bill: 'R$ 180,00'
  },
  {
    name: 'Coxinha de frango',
    code: '0030',
    quantity: 25,
    cost: 'R$ 3,00',
    bill: 'R$ 75,00'
  }
]

export const ReportSalesProduct: React.FC = () => {
  const { fetchProducts } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <S.Container>
      <S.BarColor />
      <S.InfoContainer>
        <Title
          level={4}
          style={{
            color: 'rgb(62, 62, 62)'
          }}
        >
          Vendas por Produto do periodo 26/09/2023 à 20/10/2023
        </Title>
        <Form
        // ref={formSearch}
        // onFinish={(e: { date: [string, string]; cashier: string }): void => {
        //   if (e.cashier) {
        //     fecthPayments('', '', e.cashier)
        //   } else {
        //     fecthPayments(
        //       dayjs(e.date[0]).startOf('day').format(),
        //       dayjs(e.date[1]).endOf('day').format(),
        //       ''
        //     )
        //   }
        // }}
        // initialValues={{
        //   date: [
        //     dayjs(dayjs().subtract(6, 'day').startOf('day'), DATE_FORMAT),
        //     dayjs(dayjs().endOf('day'), DATE_FORMAT)
        //   ],
        //   cashier: undefined
        // }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <Form.Item name="date">
              <RangePicker
                format={'DD/MM/YYYY HH:mm'}
                placeholder={['Data inicial', 'Data final']}
                showTime
                size="middle"
                allowClear={false}
              />
            </Form.Item>
            <Form.Item name="cashier">
              <Button
                htmlType="submit"
                type="primary"
                size="middle"
                style={{
                  borderRadius: '25px'
                }}
              >
                Buscar
              </Button>
            </Form.Item>
          </div>
        </Form>
        <S.TableContainer>
          <Table
            columns={columns}
            dataSource={dataProductsSale}
            scroll={{ y: 'calc(100vh - 30em)' }}
          />
        </S.TableContainer>
      </S.InfoContainer>
      {/* <S.InfoContainer>
        <Title
          level={4}
          style={{
            color: 'rgb(62, 62, 62)'
          }}
        >
          Vendas por Produto do periodo 26/09/2023 à 20/10/2023
        </Title>
        <Form
        // ref={formSearch}
        // onFinish={(e: { date: [string, string]; cashier: string }): void => {
        //   if (e.cashier) {
        //     fecthPayments('', '', e.cashier)
        //   } else {
        //     fecthPayments(
        //       dayjs(e.date[0]).startOf('day').format(),
        //       dayjs(e.date[1]).endOf('day').format(),
        //       ''
        //     )
        //   }
        // }}
        // initialValues={{
        //   date: [
        //     dayjs(dayjs().subtract(6, 'day').startOf('day'), DATE_FORMAT),
        //     dayjs(dayjs().endOf('day'), DATE_FORMAT)
        //   ],
        //   cashier: undefined
        // }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <Form.Item name="date">
              <RangePicker
                format={'DD/MM/YYYY HH:mm'}
                placeholder={['Data inicial', 'Data final']}
                showTime
                size="middle"
                allowClear={false}
              />
            </Form.Item>
            <Form.Item name="product">
              <Select
                showSearch
                size="middle"
                placeholder="Buscar pelo produto"
                style={{ width: '300px' }}
                allowClear
                filterOption={(input, option): boolean =>
                  (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase())
                }
                options={products.map((product) => ({
                  label: product.title,
                  value: product.id
                }))}
              />
            </Form.Item>
            <Form.Item name="cashier">
              <Button
                htmlType="submit"
                type="primary"
                size="middle"
                style={{
                  borderRadius: '25px'
                }}
              >
                Buscar
              </Button>
            </Form.Item>
          </div>
        </Form>
      </S.InfoContainer> */}
    </S.Container>
  )
}
