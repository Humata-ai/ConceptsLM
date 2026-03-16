'use client'

import { useState, useEffect } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import DimensionInput from './DimensionInput'
import type { QualityDimension, QualityDomain } from './types'
import { generateId } from './utils'

interface DomainModalProps {
  isOpen: boolean
  editingDomainId: string | null
  onClose: () => void
}

export default function DomainModal({ isOpen, editingDomainId, onClose }: DomainModalProps) {
  const { state, addDomain, updateDomain } = useQualityDomain()
  const [name, setName] = useState('')
  const [dimensions, setDimensions] = useState<QualityDimension[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const editingDomain = editingDomainId
    ? state.domains.find((d) => d.id === editingDomainId)
    : null

  useEffect(() => {
    if (isOpen) {
      if (editingDomain) {
        setName(editingDomain.name)
        setDimensions(editingDomain.dimensions)
      } else {
        setName('')
        setDimensions([])
      }
      setErrors([])
    }
  }, [isOpen, editingDomain])

  const handleAddDimension = () => {
    const newDimension: QualityDimension = {
      id: generateId(),
      name: '',
      range: [0, 1] as const,
    }
    setDimensions([...dimensions, newDimension])
  }

  const handleUpdateDimension = (index: number, dimension: QualityDimension) => {
    const updated = [...dimensions]
    updated[index] = dimension
    setDimensions(updated)
  }

  const handleRemoveDimension = (index: number) => {
    setDimensions(dimensions.filter((_, i) => i !== index))
  }

  const validate = (): boolean => {
    const newErrors: string[] = []

    if (!name.trim()) {
      newErrors.push('Domain name is required')
    }

    if (dimensions.length === 0) {
      newErrors.push('At least one dimension is required')
    }

    dimensions.forEach((dim, index) => {
      if (!dim.name.trim()) {
        newErrors.push(`Dimension ${index + 1} name is required`)
      }
      if (dim.range[0] >= dim.range[1]) {
        newErrors.push(`Dimension "${dim.name || index + 1}": Min must be less than Max`)
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const domain: QualityDomain = {
      id: editingDomain?.id || generateId(),
      name,
      dimensions,
      labels: editingDomain?.labels || [],
      createdAt: editingDomain?.createdAt || new Date(),
    }

    if (editingDomain) {
      updateDomain(domain)
    } else {
      addDomain(domain)
    }

    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="modal-backdrop" onClick={handleBackdropClick} />
      <div className="modal-content" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {editingDomain ? 'Edit Quality Domain' : 'Create Quality Domain'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="domain-name" className="block text-sm font-medium mb-1">
                Domain Name
              </label>
              <input
                id="domain-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Temperature Range"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dimensions</label>
              <div className="space-y-2">
                {dimensions.map((dimension, index) => (
                  <DimensionInput
                    key={dimension.id}
                    dimension={dimension}
                    onChange={(dim) => handleUpdateDimension(index, dim)}
                    onRemove={() => handleRemoveDimension(index)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddDimension}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Dimension
              </button>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <ul className="text-sm text-red-800 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingDomain ? 'Update Domain' : 'Save Domain'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
