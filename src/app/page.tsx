'use client'

import { IconAlertCircle, IconTrendingUp } from '@tabler/icons-react'

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Alerta de notificações */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center text-indigo-800">
          <IconAlertCircle className="mr-2" size={24} />
          <p className="text-lg">
            Você tem <span className="font-bold">3</span> pagamentos atrasados e{' '}
            <span className="font-bold">2</span> itens com estoque baixo.
          </p>
        </div>
      </div>

      {/* Cabeçalho do Dashboard */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700">
          <option>Últimos 7 dias</option>
          <option>Últimos 30 dias</option>
          <option>Este ano</option>
        </select>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">Vendas Totais</h3>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-bold">R$ 45.850</p>
            <span className="flex items-center text-sm font-medium text-green-600">
              <IconTrendingUp size={20} className="mr-1" />
              +12%
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">Novos Clientes</h3>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-bold">28</p>
            <span className="flex items-center text-sm font-medium text-green-600">
              <IconTrendingUp size={20} className="mr-1" />
              +8%
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700">Produtos Vendidos</h3>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-bold">124</p>
            <span className="flex items-center text-sm font-medium text-green-600">
              <IconTrendingUp size={20} className="mr-1" />
              +15%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 