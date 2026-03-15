'use client'

import { useState, useEffect } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import type { Concept, PropertyReference } from './types'
import { generateId } from './utils'

interface ConceptModalProps {
  isOpen: boolean
  editingConceptId: string | null
  onClose: () => void
}

export default function ConceptModal({
  isOpen,
  editingConceptId,
  onClose,
}: ConceptModalProps) {
  const { state, addConcept, updateConcept } = useQualityDomain()
  const [name, setName] = useState('')
  const [selectedPropertyRefs, setSelectedPropertyRefs] = useState<PropertyReference[]>([])
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<string[]>([])

  const editingConcept = editingConceptId
    ? state.concepts.find((c) => c.id === editingConceptId)
    : null

  useEffect(() => {
    if (isOpen) {
      if (editingConcept) {
        setName(editingConcept.name)
        setSelectedPropertyRefs(editingConcept.propertyRefs)
      } else {
        setName('')
        setSelectedPropertyRefs([])
      }
      // Expand all domains by default
      setExpandedDomains(new Set(state.domains.map(d => d.id)))
      setErrors([])
    }
  }, [isOpen, editingConcept, state.domains])

  const toggleDomain = (domainId: string) => {
    setExpandedDomains((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(domainId)) {
        newSet.delete(domainId)
      } else {
        newSet.add(domainId)
      }
      return newSet
    })
  }

  const isPropertySelected = (domainId: string, propertyId: string): boolean => {
    return selectedPropertyRefs.some(
      (ref) => ref.domainId === domainId && ref.propertyId === propertyId
    )
  }

  const toggleProperty = (domainId: string, propertyId: string) => {
    setSelectedPropertyRefs((prev) => {
      const exists = prev.some(
        (ref) => ref.domainId === domainId && ref.propertyId === propertyId
      )
      if (exists) {
        return prev.filter(
          (ref) => !(ref.domainId === domainId && ref.propertyId === propertyId)
        )
      } else {
        return [...prev, { domainId, propertyId }]
      }
    })
  }

  const getSelectedCount = (domainId: string): number => {
    return selectedPropertyRefs.filter((ref) => ref.domainId === domainId).length
  }

  const validate = (): boolean => {
    const newErrors: string[] = []

    if (!name.trim()) {
      newErrors.push('Concept name is required')
    }

    if (selectedPropertyRefs.length === 0) {
      newErrors.push('At least one property must be selected')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const concept: Concept = {
      id: editingConcept?.id || generateId(),
      name,
      propertyRefs: selectedPropertyRefs,
      createdAt: editingConcept?.createdAt || new Date(),
    }

    if (editingConcept) {
      updateConcept(concept)
    } else {
      addConcept(concept)
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
          <h2 className="text-2xl font-bold mb-4 text-purple-900">
            {editingConcept ? 'Edit Concept' : 'Create Concept'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="concept-name" className="block text-sm font-medium mb-1">
                Concept Name
              </label>
              <input
                id="concept-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., Apple, Car, House"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Properties
              </label>
              <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded p-2">
                {state.domains.map((domain) => {
                  const isExpanded = expandedDomains.has(domain.id)
                  const selectedCount = getSelectedCount(domain.id)
                  const totalCount = domain.properties.length

                  return (
                    <div key={domain.id} className="border border-gray-200 rounded">
                      <button
                        type="button"
                        onClick={() => toggleDomain(domain.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
                      >
                        <span className="font-medium text-sm">
                          {domain.name}
                          <span className="ml-2 text-xs text-gray-500">
                            ({selectedCount}/{totalCount} selected)
                          </span>
                        </span>
                        <span className="text-gray-500">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="p-2 space-y-1 border-t border-gray-200">
                          {domain.properties.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No properties in this domain</p>
                          ) : (
                            domain.properties.map((property) => (
                              <label
                                key={property.id}
                                className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={isPropertySelected(domain.id, property.id)}
                                  onChange={() => toggleProperty(domain.id, property.id)}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm">{property.name}</span>
                              </label>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {editingConcept ? 'Update Concept' : 'Save Concept'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
