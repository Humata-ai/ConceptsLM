'use client'

import { type ReactNode } from 'react'
import { useModal } from '@/app/hooks/useModal'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

/**
 * Shared Modal Component
 * 
 * Provides consistent modal behavior across the application:
 * - Backdrop click to close
 * - Escape key to close
 * - Standard styling
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'md' 
}: ModalProps) {
  const { handleBackdropClick, handleKeyDown } = useModal(onClose)

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="modal-backdrop" onClick={handleBackdropClick} />
      <div className="modal-content" onClick={handleBackdropClick}>
        <div className={`bg-white rounded-lg shadow-xl p-6 ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto`}>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}
