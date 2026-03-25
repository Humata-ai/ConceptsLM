'use client'

import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import LinearProgress from '@mui/material/LinearProgress'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  loading?: boolean
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

/**
 * Shared Modal Component
 * 
 * Provides consistent modal behavior across the application:
 * - Standard styling
 * - Users must explicitly close via Cancel/X button
 * - Portals to document.body to escape any stacking context or overflow constraints
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  loading,
  children,
  maxWidth = 'md' 
}: ModalProps) {
  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return createPortal(
    <div>
      <div className="modal-backdrop" />
      <div className="modal-content">
        <div className={`bg-white rounded-lg shadow-xl overflow-hidden ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto`}>
          {loading && <LinearProgress />}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
