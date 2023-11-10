import React, { useEffect, useState } from 'react'
import * as S from './styles'
import { Button, DatePicker, Form, Typography, Table, Select } from 'antd'
import { useProducts } from '@renderer/hooks'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import api from '@renderer/services/api'
import { formatCurrency } from '@renderer/utils'
const { RangePicker } = DatePicker

const { Title, Text } = Typography
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

interface DataTypeProductsSales {
  product_id: string
  quantity_total: string
  value_total: string
  unite_price: string
  product_title: string
}

const columns: ColumnsType<DataTypeProductsSales> = [
  {
    title: 'NOME',
    dataIndex: 'product_title',
    key: 'product_title'
  },
  {
    title: 'QUANTIDADE',
    dataIndex: 'quantity_total',
    key: 'quantity_total'
  },
  {
    title: 'VALOR UNITÁRIO',
    key: 'unite_price',
    dataIndex: 'unite_price',
    render: (text: string) => <span>{formatCurrency(Number(text))}</span>
  },
  {
    title: 'FATURADO',
    key: 'value_total',
    dataIndex: 'value_total',
    render: (text: string) => <span>{formatCurrency(Number(text))}</span>
  }
]

export const ReportSalesProduct: React.FC = () => {
  const { fetchProducts, categories, fetchCategories } = useProducts()
  const [dataProductsSale, setDataProductsSale] = useState<DataTypeProductsSales[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  function fetchReportSalesProduct(
    initialDate: string,
    finalDate: string,
    categoryId: string
  ): void {
    setLoading(true)
    api
      .get('/product-stats/', {
        params: {
          initialDate: initialDate,
          finalDate: finalDate,
          categoryId: categoryId
        }
      })
      .then((response) => {
        setDataProductsSale(response.data)
      })
      .catch(() => {
        console.log('error => ao buscar o relatorio de vendas por produto')
      })
      .finally(() => {
        setLoading(false)
      })
  }

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
          Vendas por Produto do periodo:
        </Title>
        <Form
          // ref={formSearch}
          onFinish={(e: { date: [string, string]; categoryId: string }): void => {
            console.log(e)
            fetchReportSalesProduct(
              dayjs(e.date[0]).startOf('day').format(DATE_FORMAT),
              dayjs(e.date[1]).endOf('day').format(DATE_FORMAT),
              e.categoryId
            )
          }}
          initialValues={{
            date: [
              dayjs(dayjs().subtract(6, 'day').startOf('day'), DATE_FORMAT),
              dayjs(dayjs().endOf('day'), DATE_FORMAT)
            ]
          }}
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
            <Form.Item name="categoryId">
              <Select
                style={{
                  width: '300px'
                }}
                showSearch
                placeholder="Busque e selecione uma categoria"
                optionFilterProp="children"
                filterOption={(input, option): boolean =>
                  (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase())
                }
                filterSort={(optionA, optionB): number =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                size="middle"
                options={[
                  { label: 'Todas', value: '' },
                  ...categories.map((category) => ({ label: category.title, value: category.id }))
                ]}
              />
            </Form.Item>
            <Form.Item>
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
            loading={loading}
            columns={columns}
            dataSource={dataProductsSale}
            pagination={false}
            scroll={{ y: 'calc(100vh - 30em)' }}
          />
        </S.TableContainer>
        <S.ResumeContainer>
          <S.ResumeItem>
            <Title level={5}>Total faturado: </Title>{' '}
            <Text>
              {formatCurrency(
                dataProductsSale
                  .map((x) => Number(x.value_total))
                  .reduce((acc, add) => acc + add, 0)
              )}
            </Text>
          </S.ResumeItem>
        </S.ResumeContainer>
      </S.InfoContainer>
    </S.Container>
  )
}
