'use client'

import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react'

interface Produto {
  id: number
  nome: string
  categoria: string
  preco: number
  estoque: number
  fornecedor: string
  ultimaAtualizacao: string
}

const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: 'Guarda-roupa 6 Portas',
    categoria: 'Dormitório',
    preco: 2499.90,
    estoque: 5,
    fornecedor: 'Móveis Silva',
    ultimaAtualizacao: '2024-05-10',
  },
  {
    id: 2,
    nome: 'Cozinha Completa',
    categoria: 'Cozinha',
    preco: 3999.90,
    estoque: 3,
    fornecedor: 'Planejados Plus',
    ultimaAtualizacao: '2024-05-09',
  },
]

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)

  const handleNovoProduto = () => {
    setProdutoEditando(null)
    setModalAberto(true)
  }

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto)
    setModalAberto(true)
  }

  const handleExcluirProduto = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(produto => produto.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={handleNovoProduto}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <IconPlus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estoque</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fornecedor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Última Atualização</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{produto.nome}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{produto.categoria}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{produto.estoque}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{produto.fornecedor}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{produto.ultimaAtualizacao}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => handleEditarProduto(produto)}
                    className="mr-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <IconPencil size={20} />
                  </button>
                  <button
                    onClick={() => handleExcluirProduto(produto.id)}
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
                {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
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
                    defaultValue={produtoEditando?.nome}
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