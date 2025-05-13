'use client'

import { useState } from 'react'
import { IconSearch, IconMenu2, IconX } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick?: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    // Simula uma busca em todas as entidades
    const results = [
      {
        type: 'cliente',
        id: 1,
        title: 'João Silva',
        subtitle: 'Cliente',
        href: '/clientes',
      },
      {
        type: 'produto',
        id: 1,
        title: 'Guarda-roupa 6 Portas',
        subtitle: 'Produto',
        href: '/produtos',
      },
      {
        type: 'vendedor',
        id: 1,
        title: 'Carlos Oliveira',
        subtitle: 'Vendedor',
        href: '/vendedores',
      },
    ].filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    )

    setSearchResults(results)
    setIsSearching(false)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
  }

  const handleResultClick = (result: any) => {
    router.push(result.href)
    clearSearch()
  }

  return (
    <div className="fixed right-0 top-0 flex h-20 w-[calc(100%-16rem)] items-center justify-between bg-white px-8 shadow-sm">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
      >
        <IconMenu2 size={24} />
      </button>

      <div className="relative flex-1 px-4 lg:px-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pl-10 pr-10 text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          <IconSearch
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IconX size={20} />
            </button>
          )}
        </div>

        {/* Resultados da busca */}
        {searchResults.length > 0 && (
          <div className="absolute left-4 right-4 top-full mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg lg:left-8 lg:right-8">
            <div className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex w-full items-center px-4 py-3 text-left hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.title}</p>
                    <p className="text-sm text-gray-500">{result.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header 