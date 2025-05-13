'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Table from '@/components/Table'
import ClienteModal from './components/ClienteModal'
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react'

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  endereco: string
  ultimaCompra: string
}

const columns = [
  { key: 'nome', header: 'Nome' },
  { key: 'email', header: 'Email' },
  { key: 'telefone', header: 'Telefone' },
  { key: 'endereco', header: 'Endereço' },
  { key: 'ultimaCompra', header: 'Última Compra' },
]

const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua A, 123',
    ultimaCompra: '2024-05-10',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 88888-8888',
    endereco: 'Rua B, 456',
    ultimaCompra: '2024-05-08',
  },
]

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error fetching clientes:', error)
      toast.error('Erro ao carregar clientes')
    }
  }

  async function handleSubmit(data: any) {
    setIsLoading(true)
    try {
      if (selectedCliente) {
        await fetch(`/api/clientes/${selectedCliente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast.success('Cliente atualizado com sucesso')
      } else {
        await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast.success('Cliente criado com sucesso')
      }
      fetchClientes()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving cliente:', error)
      toast.error('Erro ao salvar cliente')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
      })
      toast.success('Cliente excluído com sucesso')
      fetchClientes()
    } catch (error) {
      console.error('Error deleting cliente:', error)
      toast.error('Erro ao excluir cliente')
    }
  }

  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  // Calcula métricas para os cards
  const clientesComCompraRecente = clientes.filter(cliente => {
    const ultimaCompra = new Date(cliente.ultimaCompra)
    const umMesAtras = new Date()
    umMesAtras.setMonth(umMesAtras.getMonth() - 1)
    return ultimaCompra >= umMesAtras
  })

  const clientesSemCompra = clientes.filter(cliente => !cliente.ultimaCompra)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <IconPlus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total de Clientes">
          <p className="text-3xl font-bold text-gray-900">{clientes.length}</p>
        </Card>
        <Card title="Clientes Ativos">
          <p className="text-3xl font-bold text-green-600">
            {clientesComCompraRecente.length}
          </p>
        </Card>
        <Card title="Clientes Inativos">
          <p className="text-3xl font-bold text-red-600">
            {clientesSemCompra.length}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 max-w-sm">
            <input
              type="search"
              placeholder="Buscar cliente..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredClientes}
          onRowClick={(cliente) => {
            setSelectedCliente(cliente)
            setIsModalOpen(true)
          }}
        />
      </Card>

      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCliente(null)
        }}
        onSubmit={handleSubmit}
        initialData={selectedCliente}
        isLoading={isLoading}
      />
    </div>
  )
} 