import React from 'react'
import Modal from '@/components/Modal'
import ClienteForm from './ClienteForm'

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export default function ClienteModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ClienteModalProps) {
  const title = initialData ? 'Editar Cliente' : 'Novo Cliente'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ClienteForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  )
} 