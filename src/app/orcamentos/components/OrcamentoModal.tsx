import React from 'react'
import Modal from '@/components/Modal'
import OrcamentoForm from './OrcamentoForm'

interface OrcamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export default function OrcamentoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: OrcamentoModalProps) {
  const title = initialData ? 'Editar Orçamento' : 'Novo Orçamento'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="2xl">
      <OrcamentoForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  )
} 