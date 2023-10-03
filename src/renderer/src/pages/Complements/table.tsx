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
import React, { ReactElement, useState } from 'react'
import { Button, Input, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: string
  title: string
  price: number
}

const columns: ColumnsType<DataType> = [
  {
    key: 'sort',
    width: '5%'
  },
  {
    title: 'Nome',
    dataIndex: 'title',
    render: (text) => <Input value={text} />,
    width: '25%'
  },
  {
    title: 'Preço',
    dataIndex: 'price',
    width: '20%'
  },
  {
    title: 'Valor mínimo',
    dataIndex: 'min_value',
    width: '20%'
  },
  {
    title: 'Valor máximo',
    dataIndex: 'max_value',
    width: '20%'
  },
  {
    title: 'Ações',
    dataIndex: 'actions',
    width: '10%',
    render: () => <Button type="primary">Salvar</Button>
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

export const TableComplemts: React.FC = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      title: 'John Brown',
      price: 32,
      min_value: 32,
      max_value: 32,
      actions: 'actions'
    },
    {
      key: '2',
      title: 'Jim Green',
      price: 42,
      min_value: 32,
      max_value: 32,
      actions: 'actions'
    },
    {
      key: '3',
      title: 'Joe Black',
      price: 32,
      min_value: 32,
      max_value: 32,
      actions: 'actions'
    }
  ])

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    if (active.id !== over?.id) {
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
          rowKey="key"
          columns={columns}
          pagination={false}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  )
}
