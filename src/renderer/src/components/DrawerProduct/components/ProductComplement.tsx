import { Button } from 'antd'
import React, { useState } from 'react'
import { ComplementForm } from './ComplementForm'
import {
  ProductComplement as productComplement,
  ProductComplementItem as productComplementItem
} from '../../../types'

export const ProductComplement: React.FC = () => {
  const [complements, setComplements] = useState<productComplement[]>([])

  function addComplements(): void {
    setComplements([
      ...complements,
      {
        id: crypto.randomUUID(),
        product: '',
        order: 0,
        title: '',
        active: false,
        input_type: 'checkbox',
        business_rules: 'maior',
        max_value: 0,
        min_value: 0,
        products: []
      }
    ])
  }

  function addComplementItem(complementId: string): void {
    // Crie uma cópia dos complementos existentes
    const updatedComplements = [...complements]

    // Encontre o complemento pelo ID fornecido
    const complementIndex = updatedComplements.findIndex(
      (complement) => complement.id === complementId
    )

    if (complementIndex !== -1) {
      // Adicione o novo complement_item ao complemento encontrado
      const newComplementItem: productComplementItem = {
        title: 'Novo Complemento', // Defina os valores do novo complement_item conforme necessário
        order: 1,
        active: true,
        price: '0.00',
        max_value: 0,
        min_value: 0
      }

      if (!updatedComplements[complementIndex].complement_items) {
        // Se o complemento ainda não tiver nenhum complement_item, crie um novo array com o novo complement_item
        updatedComplements[complementIndex].complement_items = [newComplementItem]
      } else {
        // Caso contrário, adicione o novo complement_item ao array existente
        updatedComplements[complementIndex].complement_items?.push(newComplementItem)
      }

      // Atualize o estado com os complementos atualizados (incluindo o novo complement_item)
      setComplements(updatedComplements)
    }
  }

  function handleDelete(id: string): void {
    setComplements(complements.filter((complement) => complement.id !== id))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          height: 'calc(100vh - 190px)',
          gap: '10px'
        }}
      >
        {complements.length > 0 ? (
          complements.map((complement) => (
            <ComplementForm
              complement={complement}
              key={complement.id}
              onDelete={(id): void => handleDelete(id)}
              OnChangeAddItem={(complementId): void => addComplementItem(complementId)}
            />
          ))
        ) : (
          <h3>Nenhum complemento criado</h3>
        )}
      </div>

      <Button
        type="primary"
        style={{
          width: '50%',
          margin: '10px 0'
        }}
        onClick={addComplements}
      >
        Criar complemento
      </Button>
    </div>
  )
}
