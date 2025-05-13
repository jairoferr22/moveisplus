'use client'

import { ReactNode } from 'react'

interface FormProps {
  onSubmit: (data: any) => void
  children: ReactNode
  className?: string
}

export default function Form({ onSubmit, children, className = '' }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  )
} 