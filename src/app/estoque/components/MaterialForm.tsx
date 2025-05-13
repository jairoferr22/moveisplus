import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/Input'
import Button from '@/components/Button'

const materialSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['Chapa', 'Ferragem', 'Acabamento'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
  description: z.string().optional(),
  quantity: z.number().min(0, 'Quantidade deve ser maior ou igual a 0'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  minStock: z.number().min(0, 'Estoque mínimo deve ser maior ou igual a 0'),
})

type MaterialFormData = z.infer<typeof materialSchema>

interface MaterialFormProps {
  initialData?: Partial<MaterialFormData>
  onSubmit: (data: MaterialFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function MaterialForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: MaterialFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            className={`
              block w-full rounded-md
              border-gray-300 shadow-sm
              focus:border-primary-500 focus:ring-primary-500
              sm:text-sm
              ${errors.type ? 'border-red-300' : ''}
            `}
            {...register('type')}
          >
            <option value="">Selecione...</option>
            <option value="Chapa">Chapa</option>
            <option value="Ferragem">Ferragem</option>
            <option value="Acabamento">Acabamento</option>
          </select>
          {errors.type?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <Input
          label="Unidade"
          error={errors.unit?.message}
          {...register('unit')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantidade"
          type="number"
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />

        <Input
          label="Estoque Mínimo"
          type="number"
          error={errors.minStock?.message}
          {...register('minStock', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Preço"
        type="number"
        step="0.01"
        error={errors.price?.message}
        {...register('price', { valueAsNumber: true })}
      />

      <Input
        label="Descrição"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Salvar
        </Button>
      </div>
    </form>
  )
} 