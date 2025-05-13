import React from 'react'
import Modal from '@/components/Modal'
import MaterialForm from './MaterialForm'
import type { z } from 'zod'

interface MaterialModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export default function MaterialModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: MaterialModalProps) {
  const title = initialData ? 'Editar Material' : 'Novo Material'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <MaterialForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  )
} 