import React, { useCallback, useEffect } from 'react'
import * as S from './styles'
import { Button, Table } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import api from '@renderer/services/api'
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table/interface'

interface noteType {
  cnpj_emitente: string | null
  ref: string | null
  status: string | null
  status_sefaz: string | null
  mensagem_sefaz: string | null
  chave_nfe: string | null
  numero: string | null
  serie: string | null
  data_emissao: string | null
  caminho_xml_nota_fiscal: string | null
  caminho_danfe: string | null
  qrcode_url: string | null
  url_consulta_nf: string | null
  created: string | null
  note: {
    status: string | null
    url: string | null
  }
}

const Colunm: ColumnsType<noteType> = [
  {
    title: 'numero',
    dataIndex: 'numero',
    align: 'center',
    key: 'mumero'
  },
  {
    title: 'Data',
    dataIndex: 'data_emissao',
    align: 'center',
    render: (nota) => dayjs(nota).format('DD/MM/YYYY HH:mm:ss')
  },
  {
    title: 'Status',
    dataIndex: 'note',
    align: 'center',
    render: (nota) => nota?.status
  },
  {
    title: 'Ações',
    dataIndex: 'note',
    align: 'center',
    render: (nota) => (
      <Button icon={<FilePdfOutlined />} href={nota.url} target="_blank">
        Abrir
      </Button>
    )
  }
]

export const Notas: React.FC = () => {
  const [loadingP, setLoadingP] = React.useState(false)
  const hasUpdate = React.useRef(false)
  const [notes, setNotes] = React.useState<noteType[]>([])
  useEffect(() => {
    if (!hasUpdate.current) {
      fecthPayments()
      hasUpdate.current = true
    }
  }, [])
  const fecthPayments = useCallback(() => {
    setLoadingP(true)
    api
      .get(`/notes/`)
      .then((response) => {
        setNotes(response.data)
      })
      .finally(() => {
        setLoadingP(false)
      })
  }, [])
  return (
    <S.Container>
      <Table
        columns={Colunm}
        dataSource={notes}
        loading={loadingP}
        pagination={false}
        scroll={{ y: 'calc(100vh - 220px)' }}
      />
    </S.Container>
  )
}
