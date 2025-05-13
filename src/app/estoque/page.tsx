'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Table from '@/components/Table'
import MaterialModal from './components/MaterialModal'

const columns = [
  { key: 'name', header: 'Nome' },
  { key: 'type', header: 'Tipo' },
  { key: 'quantity', header: 'Quantidade' },
  { key: 'unit', header: 'Unidade' },
  { key: 'price', header: 'Preço', render: (value: number) => `R$ ${value.toFixed(2)}` },
  { key: 'minStock', header: 'Estoque Mínimo' },
  {
    key: 'status',
    header: 'Status',
    render: (_: any, row: any) => {
      const status = row.quantity <= row.minStock ? 'Baixo' : 'Normal'
      const color = status === 'Baixo' ? 'text-red-600' : 'text-green-600'
      return <span className={`font-medium ${color}`}>{status}</span>
    },
  },
]

export default function EstoquePage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function fetchMaterials() {
    try {
      const response = await fetch('/api/materials')
      const data = await response.json()
      setMaterials(data)
    } catch (error) {
      console.error('Error fetching materials:', error)
      toast.error('Erro ao carregar materiais')
    }
  }

  async function handleSubmit(data: any) {
    setIsLoading(true)
    try {
      if (selectedMaterial) {
        await fetch(`/api/materials/${selectedMaterial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast.success('Material atualizado com sucesso')
      } else {
        await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast.success('Material criado com sucesso')
      }
      fetchMaterials()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving material:', error)
      toast.error('Erro ao salvar material')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este material?')) return

    try {
      await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      })
      toast.success('Material excluído com sucesso')
      fetchMaterials()
    } catch (error) {
      console.error('Error deleting material:', error)
      toast.error('Erro ao excluir material')
    }
  }

  async function handleBulkDelete() {
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedMaterials.length} materiais?`)) return

    setIsLoading(true)
    try {
      await Promise.all(
        selectedMaterials.map((id) =>
          fetch(`/api/materials/${id}`, {
            method: 'DELETE',
          })
        )
      )
      toast.success('Materiais excluídos com sucesso')
      setSelectedMaterials([])
      fetchMaterials()
    } catch (error) {
      console.error('Error deleting materials:', error)
      toast.error('Erro ao excluir materiais')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMaterials = materials.filter((material) => {
    const matchesFilter = filter === 'all' || material.type === filter
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Controle de Estoque</h1>
        <Button
          onClick={() => {
            setSelectedMaterial(null)
            setIsModalOpen(true)
          }}
        >
          Adicionar Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total de Itens">
          <p className="text-3xl font-bold text-gray-900">{materials.length}</p>
        </Card>
        <Card title="Itens Abaixo do Mínimo">
          <p className="text-3xl font-bold text-red-600">
            {materials.filter((m) => m.quantity <= m.minStock).length}
          </p>
        </Card>
        <Card title="Valor Total em Estoque">
          <p className="text-3xl font-bold text-primary-600">
            R$ {materials.reduce((acc, m) => acc + m.price * m.quantity, 0).toFixed(2)}
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
              variant={filter === 'Chapa' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('Chapa')}
            >
              Chapas
            </Button>
            <Button
              variant={filter === 'Ferragem' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('Ferragem')}
            >
              Ferragens
            </Button>
            <Button
              variant={filter === 'Acabamento' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('Acabamento')}
            >
              Acabamentos
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Buscar material..."
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {selectedMaterials.length > 0 ? (
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  isLoading={isLoading}
                >
                  Excluir Selecionados ({selectedMaterials.length})
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedMaterials([])}
                >
                  Limpar Seleção
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredMaterials}
          onRowClick={(material) => {
            setSelectedMaterial(material)
            setIsModalOpen(true)
          }}
          selectable
          selectedRows={selectedMaterials}
          onSelectionChange={setSelectedMaterials}
        />
      </Card>

      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMaterial(null)
        }}
        onSubmit={handleSubmit}
        initialData={selectedMaterial}
        isLoading={isLoading}
      />
    </div>
  )
} 