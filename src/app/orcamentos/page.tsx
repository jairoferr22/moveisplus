'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Table from '@/components/Table'
import OrcamentoModal from './components/OrcamentoModal'

const columns = [
  { key: 'numero', header: 'Número' },
  { key: 'cliente', header: 'Cliente', render: (value: any) => value?.nome || '-' },
  { key: 'data', header: 'Data', render: (value: string) => new Date(value).toLocaleDateString('pt-BR') },
  { 
    key: 'valorTotal', 
    header: 'Valor Total', 
    render: (value: number) => `R$ ${value?.toFixed(2) || '0,00'}`
  },
  { 
    key: 'status', 
    header: 'Status',
    render: (value: string) => {
      const colors = {
        'PENDENTE': 'text-yellow-600',
        'APROVADO': 'text-green-600',
        'REPROVADO': 'text-red-600',
        'EM_PRODUCAO': 'text-blue-600',
        'CONCLUIDO': 'text-gray-600'
      }
      return <span className={`font-medium ${colors[value] || 'text-gray-600'}`}>{value}</span>
    }
  },
]

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<any[]>([])
  const [selectedOrcamento, setSelectedOrcamento] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrcamentos()
  }, [])

  async function fetchOrcamentos() {
    try {
      const response = await fetch('/api/orcamentos')
      const data = await response.json()
      setOrcamentos(data)
    } catch (error) {
      console.error('Error fetching orcamentos:', error)
      toast.error('Erro ao carregar orçamentos')
    }
  }

  async function handleSubmit(data: any) {
    setIsLoading(true)
    try {
      if (selectedOrcamento) {
        await fetch(`/api/orcamentos/${selectedOrcamento.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast.success('Orçamento atualizado com sucesso')
      } else {
        await fetch('/api/orcamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast.success('Orçamento criado com sucesso')
      }
      fetchOrcamentos()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving orcamento:', error)
      toast.error('Erro ao salvar orçamento')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrcamentos = orcamentos.filter((orcamento) => {
    const matchesFilter = filter === 'all' || orcamento.status === filter
    const matchesSearch = 
      orcamento.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orcamento.numero?.toString().includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const statusCounts = orcamentos.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1
    return acc
  }, {})

  const totalValue = orcamentos
    .filter(o => o.status === 'APROVADO' || o.status === 'EM_PRODUCAO')
    .reduce((acc, curr) => acc + (curr.valorTotal || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Orçamentos</h1>
        <Button
          onClick={() => {
            setSelectedOrcamento(null)
            setIsModalOpen(true)
          }}
        >
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total de Orçamentos">
          <p className="text-3xl font-bold text-gray-900">{orcamentos.length}</p>
        </Card>
        <Card title="Aprovados">
          <p className="text-3xl font-bold text-green-600">
            {statusCounts['APROVADO'] || 0}
          </p>
        </Card>
        <Card title="Em Produção">
          <p className="text-3xl font-bold text-blue-600">
            {statusCounts['EM_PRODUCAO'] || 0}
          </p>
        </Card>
        <Card title="Valor Total (Aprovados)">
          <p className="text-3xl font-bold text-primary-600">
            R$ {totalValue.toFixed(2)}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'PENDENTE' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('PENDENTE')}
            >
              Pendentes
            </Button>
            <Button
              variant={filter === 'APROVADO' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('APROVADO')}
            >
              Aprovados
            </Button>
            <Button
              variant={filter === 'EM_PRODUCAO' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('EM_PRODUCAO')}
            >
              Em Produção
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Buscar orçamento..."
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                // TODO: Implementar exportação
                toast.error('Funcionalidade em desenvolvimento')
              }}
            >
              Exportar
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredOrcamentos}
          onRowClick={(orcamento) => {
            setSelectedOrcamento(orcamento)
            setIsModalOpen(true)
          }}
        />
      </Card>

      <OrcamentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrcamento(null)
        }}
        onSubmit={handleSubmit}
        initialData={selectedOrcamento}
        isLoading={isLoading}
      />
    </div>
  )
} 