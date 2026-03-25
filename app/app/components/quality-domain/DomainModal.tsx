'use client'

import { useState, useEffect } from 'react'
import { useQualityDomain } from '@/app/store'
import DimensionInput from './DimensionInput'
import DomainNameInput from './DomainNameInput'
import type { QualityDimension, QualityDomain } from './types'
import { generateId } from './utils'
import Modal from '@/app/components/common/Modal'
import { required, arrayMinLength, collectErrors, validateArray } from '@/app/utils/validators'

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
    
    const nameError = required('Domain name')(name)
    if (nameError) newErrors.push(nameError)
    
    const dimsError = arrayMinLength('dimension', 1)(dimensions)
    if (dimsError) newErrors.push(dimsError)
    
    newErrors.push(...validateArray(
      dimensions,
      (dim) => {
        const errors: string[] = []
        const nameError = required('name')(dim.name)
        if (nameError) errors.push(nameError)
        if (dim.range[0] >= dim.range[1]) {
          errors.push(`Min must be less than Max`)
        }
        return errors.length > 0 ? errors.join(', ') : null
      },
      'Dimension'
    ))

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDomain ? 'Edit quality domain' : 'Create quality domain'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
            <DomainNameInput value={name} onChange={setName} />

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
                + Add dimension
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
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingDomain ? 'Update domain' : 'Save domain'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
