'use client'

import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react'

interface Vendedor {
  id: number
  nome: string
  email: string
  telefone: string
  comissao: number
  vendasMes: number
  metaMensal: number
  status: 'Ativo' | 'Inativo'
}

const vendedoresIniciais: Vendedor[] = [
  {
    id: 1,
    nome: 'Carlos Oliveira',
    email: 'carlos@moveisplus.com',
    telefone: '(11) 97777-7777',
    comissao: 5,
    vendasMes: 45000,
    metaMensal: 50000,
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Ana Paula Silva',
    email: 'ana@moveisplus.com',
    telefone: '(11) 96666-6666',
    comissao: 5,
    vendasMes: 52000,
    metaMensal: 50000,
    status: 'Ativo',
  },
]

export default function Vendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>(vendedoresIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const [vendedorEditando, setVendedorEditando] = useState<Vendedor | null>(null)

  const handleNovoVendedor = () => {
    setVendedorEditando(null)
    setModalAberto(true)
  }

  const handleEditarVendedor = (vendedor: Vendedor) => {
    setVendedorEditando(vendedor)
    setModalAberto(true)
  }

  const handleExcluirVendedor = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este vendedor?')) {
      setVendedores(vendedores.filter(vendedor => vendedor.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Vendedores</h1>
        <button
          onClick={handleNovoVendedor}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <IconPlus size={20} />
          Novo Vendedor
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Telefone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Comissão</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vendas do Mês</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Meta Mensal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {vendedores.map((vendedor) => (
              <tr key={vendedor.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{vendedor.nome}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{vendedor.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{vendedor.telefone}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{vendedor.comissao}%</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {vendedor.vendasMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {vendedor.metaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      vendedor.status === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {vendedor.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => handleEditarVendedor(vendedor)}
                    className="mr-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <IconPencil size={20} />
                  </button>
                  <button
                    onClick={() => handleExcluirVendedor(vendedor.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <IconTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {vendedorEditando ? 'Editar Vendedor' : 'Novo Vendedor'}
              </h3>
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    defaultValue={vendedorEditando?.nome}
                  />
                </div>
                {/* Adicione mais campos do formulário aqui */}
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 