import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/Input'
import Button from '@/components/Button'

const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  cpf: z.string().optional().or(z.literal('')),
  cnpj: z.string().optional().or(z.literal('')),
  endereco: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  estado: z.string().optional().or(z.literal('')),
  cep: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // Pelo menos um dos campos CPF ou CNPJ deve ser preenchido
  return data.cpf || data.cnpj
}, {
  message: 'Preencha CPF ou CNPJ',
  path: ['cpf']
})

type ClienteFormData = z.infer<typeof clienteSchema>

interface ClienteFormProps {
  initialData?: Partial<ClienteFormData>
  onSubmit: (data: ClienteFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ClienteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Telefone"
          error={errors.telefone?.message}
          {...register('telefone')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="CPF"
          error={errors.cpf?.message}
          {...register('cpf')}
        />
        <Input
          label="CNPJ"
          error={errors.cnpj?.message}
          {...register('cnpj')}
        />
      </div>

      <Input
        label="Endereço"
        error={errors.endereco?.message}
        {...register('endereco')}
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Cidade"
          error={errors.cidade?.message}
          {...register('cidade')}
        />
        <Input
          label="Estado"
          error={errors.estado?.message}
          {...register('estado')}
        />
        <Input
          label="CEP"
          error={errors.cep?.message}
          {...register('cep')}
        />
      </div>

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