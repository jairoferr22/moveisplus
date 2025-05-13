import { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  footer?: ReactNode
  onClick?: () => void
  loading?: boolean
  error?: boolean
}

export default function Card({
  title,
  subtitle,
  children,
  className = '',
  footer,
  onClick,
  loading = false,
  error = false,
}: CardProps) {
  const baseClasses = 'rounded-lg bg-white shadow-sm'
  const statusClasses = error ? 'border-red-300' : loading ? 'opacity-70' : 'border-gray-200'
  const interactionClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''

  return (
    <div
      className={`${baseClasses} ${statusClasses} ${interactionClasses} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-6 py-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={`px-6 py-4 ${loading ? 'animate-pulse' : ''}`}>
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>Erro ao carregar dados</p>
          </div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className="border-t border-gray-200 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  )
} 