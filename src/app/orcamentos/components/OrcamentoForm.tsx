'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Form from '@/components/Form'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { z } from 'zod'

const orcamentoSchema = z.object({
  clienteId: z.number().min(1, 'Selecione um cliente'),
  status: z.enum(['Pendente', 'Aprovado', 'Rejeitado']).default('Pendente'),
  observacoes: z.string().optional(),
  items: z.array(z.object({
    produtoId: z.number().min(1, 'Selecione um produto'),
    quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
    precoUnit: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  })).min(1, 'Adicione pelo menos um item'),
})

type OrcamentoFormData = z.infer<typeof orcamentoSchema>

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

interface Cliente {
  id: number
  nome: string
}

interface OrcamentoItem {
  produtoId: number
  quantidade: number
  precoUnit: number
}

interface OrcamentoFormProps {
  onSubmit: (data: OrcamentoFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<OrcamentoFormData>
  clientes: Cliente[]
  produtos: Produto[]
  isLoading?: boolean
}

export default function OrcamentoForm({
  onSubmit,
  onCancel,
  initialData,
  clientes,
  produtos,
  isLoading = false,
}: OrcamentoFormProps) {
  const [items, setItems] = useState<OrcamentoItem[]>(
    initialData?.items?.map((item: Partial<OrcamentoItem>) => ({
      produtoId: Number(item.produtoId),
      quantidade: Number(item.quantidade),
      precoUnit: Number(item.precoUnit),
    })) || []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleAddItem = () => {
    setItems([...items, { produtoId: 0, quantidade: 1, precoUnit: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof OrcamentoItem, value: string | number) => {
    const newItems = [...items]
    
    if (field === 'produtoId') {
      const produtoId = Number(value)
      const produto = produtos.find(p => p.id === produtoId)
      
      if (produto) {
        const quantidade = newItems[index].quantidade || 1
        if (quantidade > produto.estoque) {
          toast.error(`Quantidade maior que o estoque disponível (${produto.estoque} unidades)`)
          return
        }
        
        newItems[index] = {
          ...newItems[index],
          produtoId,
          precoUnit: produto.preco,
        }
      }
    } else {
      const numValue = field === 'quantidade' 
        ? Math.max(1, parseInt(value as string) || 0)
        : Math.max(0, parseFloat(value as string) || 0)

      if (field === 'quantidade') {
        const produto = produtos.find(p => p.id === newItems[index].produtoId)
        if (produto && numValue > produto.estoque) {
          toast.error(`Quantidade maior que o estoque disponível (${produto.estoque} unidades)`)
          return
        }
      }

      newItems[index] = {
        ...newItems[index],
        [field]: numValue
      }
    }

    setItems(newItems)
    setValidationErrors({})
  }

  const validateForm = (formData: any): formData is OrcamentoFormData => {
    try {
      const validatedData = {
        ...formData,
        clienteId: Number(formData.clienteId),
        items: items.map(item => ({
          ...item,
          produtoId: Number(item.produtoId),
          quantidade: Number(item.quantidade),
          precoUnit: Number(item.precoUnit),
        })),
      }
      
      // Validar estoque
      const estoqueInvalido = validatedData.items.some((item: OrcamentoItem) => {
        const produto = produtos.find(p => p.id === item.produtoId)
        return produto && item.quantidade > produto.estoque
      })

      if (estoqueInvalido) {
        toast.error('Um ou mais itens excedem o estoque disponível')
        return false
      }

      orcamentoSchema.parse(validatedData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          errors[err.path.join('.')] = err.message
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      const data = {
        clienteId: Number(formData.clienteId),
        status: formData.status || 'Pendente',
        observacoes: formData.observacoes || '',
        items: items.map(item => ({
          ...item,
          produtoId: Number(item.produtoId),
          quantidade: Number(item.quantidade),
          precoUnit: Number(item.precoUnit),
        })),
      }

      if (!validateForm(data)) {
        return
      }

      setIsSubmitting(true)
      await onSubmit(data)
      toast.success(initialData ? 'Orçamento atualizado!' : 'Orçamento criado!')
    } catch (error) {
      console.error('Error submitting orcamento:', error)
      toast.error('Erro ao salvar orçamento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const total = items.reduce((acc, item) => {
    return acc + (Number(item.precoUnit) || 0) * (Number(item.quantidade) || 0)
  }, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          id="clienteId"
          name="clienteId"
          required
          defaultValue={initialData?.clienteId || ''}
          className={`mt-1 block w-full rounded-md border ${
            validationErrors['clienteId'] ? 'border-red-500' : 'border-gray-300'
          } bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
        {validationErrors['clienteId'] && (
          <p className="mt-1 text-sm text-red-600">{validationErrors['clienteId']}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={initialData?.status || 'Pendente'}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="Pendente">Pendente</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Rejeitado">Rejeitado</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Itens do Orçamento
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-100"
          >
            <IconPlus size={16} />
            Adicionar Item
          </button>
        </div>

        {validationErrors['items'] && (
          <p className="mt-1 text-sm text-red-600">{validationErrors['items']}</p>
        )}

        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border border-gray-200 p-4">
              <div className="flex-1">
                <select
                  value={item.produtoId}
                  onChange={(e) => handleItemChange(index, 'produtoId', e.target.value)}
                  className={`block w-full rounded-md border ${
                    validationErrors[`items.${index}.produtoId`] ? 'border-red-500' : 'border-gray-300'
                  } bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} - R$ {produto.preco.toFixed(2)}
                      {produto.estoque < 5 ? ` (Apenas ${produto.estoque} em estoque)` : ''}
                    </option>
                  ))}
                </select>
                {validationErrors[`items.${index}.produtoId`] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors[`items.${index}.produtoId`]}</p>
                )}
              </div>

              <div className="w-32">
                <input
                  type="number"
                  min="1"
                  value={item.quantidade}
                  onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                  className={`block w-full rounded-md border ${
                    validationErrors[`items.${index}.quantidade`] ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Qtd"
                />
                {validationErrors[`items.${index}.quantidade`] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors[`items.${index}.quantidade`]}</p>
                )}
              </div>

              <div className="w-32">
                <input
                  type="number"
                  step="0.01"
                  value={item.precoUnit}
                  onChange={(e) => handleItemChange(index, 'precoUnit', e.target.value)}
                  className={`block w-full rounded-md border ${
                    validationErrors[`items.${index}.precoUnit`] ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Preço"
                />
                {validationErrors[`items.${index}.precoUnit`] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors[`items.${index}.precoUnit`]}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <IconTrash size={20} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="mt-4 text-right">
            <p className="text-sm text-gray-500">
              Total: <span className="font-medium text-gray-900">R$ {total.toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          defaultValue={initialData?.observacoes}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </Form>
  )
} 