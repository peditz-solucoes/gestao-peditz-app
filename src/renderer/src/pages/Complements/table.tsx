import { MenuOutlined } from '@ant-design/icons'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { ReactElement, useEffect } from 'react'
import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ProductComplement } from '@renderer/types'
import api from '@renderer/services/api'

export interface DataType {
  key: string
  title: string
  input_type: 'checkbox' | 'radio' | 'number'
  business_rule: 'media' | 'maior' | 'soma'
  order: number
  complement: {
    complement: ProductComplement
    onClick: (complement: ProductComplement) => void
  }
}

const columns: ColumnsType<DataType> = [
  {
    key: 'sort',
    width: '5%'
  },
  {
    title: 'Título',
    dataIndex: 'title',
    render: (text) => text,
    width: '25%'
  },
  {
    title: 'tipo',
    dataIndex: 'input_type',
    width: '20%'
  },
  {
    title: 'Regra',
    dataIndex: 'business_rule',
    width: '20%'
  },
  {
    title: 'Ordem',
    dataIndex: 'order',
    width: '20%',
    render: (text) => text + 1
  },
  {
    title: 'Ações',
    dataIndex: 'complement',
    width: '10%',
    render: (complement) => (
      <Button type="primary" onClick={(): void => complement.onClick(complement.complement)}>
        Editar
      </Button>
    )
  }
]

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const Row = ({ children, ...props }: RowProps): ReactElement => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  }

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            )
          })
        }
        return child
      })}
    </tr>
  )
}

interface TableComplemtsProps {
  dataSource: DataType[]
  updateDataSource: () => void
  isLoading?: boolean
  setDataSource: React.Dispatch<React.SetStateAction<DataType[]>>
}

export const TableComplemts: React.FC<TableComplemtsProps> = ({
  dataSource,
  updateDataSource,
  isLoading,
  setDataSource
}) => {
  const hasChanged = React.useRef(false)
  const [loading, setLoading] = React.useState(false)
  useEffect(() => {
    if (!hasChanged.current) return
    const updateItemsInBackend = async (): Promise<void> => {
      setLoading(true)
      try {
        for (const item in dataSource) {
          await api.patch(`product-complement/${dataSource[item].complement.complement.id}/`, {
            order: item
          })
        }
        updateDataSource()
      } catch (error) {
        console.error('Erro ao atualizar os itens:', error)
      } finally {
        hasChanged.current = false
        setLoading(false)
      }
    }

    updateItemsInBackend()
  }, [dataSource])

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    if (active.id !== over?.id) {
      hasChanged.current = true
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id)
        const overIndex = previous.findIndex((i) => i.key === over?.id)
        return arrayMove(previous, activeIndex, overIndex)
      })
    }
  }

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row
            }
          }}
          loading={loading || isLoading}
          rowKey="key"
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          scroll={{ y: 'calc(100vh - 220px)' }}
        />
      </SortableContext>
    </DndContext>
  )
}
