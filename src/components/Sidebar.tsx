'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconUsers, IconBox, IconUserCircle } from '@tabler/icons-react'

const Sidebar = () => {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', icon: IconHome, href: '/' },
    { name: 'Clientes', icon: IconUsers, href: '/clientes' },
    { name: 'Produtos', icon: IconBox, href: '/produtos' },
    { name: 'Vendedores', icon: IconUserCircle, href: '/vendedores' },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#4338CA] text-white">
      <div className="p-6">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <IconBox size={32} />
          <span>MóveisPlus</span>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 text-lg transition-colors ${
                isActive ? 'bg-[#4F46E5] text-white' : 'text-gray-200 hover:bg-[#4F46E5]'
              }`}
            >
              <item.icon size={24} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar 