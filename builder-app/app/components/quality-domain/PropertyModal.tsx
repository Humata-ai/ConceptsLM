'use client'

import { useState, useEffect } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import type { Property, PropertyDimensionRange, QualityDimension } from './types'
import { generateId } from './utils'

interface PropertyModalProps {
  isOpen: boolean
  domainId: string | null
  editingPropertyId: string | null
  onClose: () => void
}

export default function PropertyModal({
  isOpen,
  domainId,
  editingPropertyId,
  onClose,
}: PropertyModalProps) {
  const { state, addProperty, updateProperty } = useQualityDomain()
  const [name, setName] = useState('')
  const [dimensionRanges, setDimensionRanges] = useState<PropertyDimensionRange[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const domain = domainId ? state.domains.find((d) => d.id === domainId) : null
  const editingProperty = editingPropertyId && domain
    ? domain.properties.find((p) => p.id === editingPropertyId)
    : null

  useEffect(() => {
    if (isOpen && domain) {
      if (editingProperty) {
        setName(editingProperty.name)
        setDimensionRanges(editingProperty.dimensions)
      } else {
        setName('')
        // Initialize with all dimensions of the domain, each with default ranges
        setDimensionRanges(
          domain.dimensions.map((dim) => ({
            dimensionId: dim.id,
            range: dim.range,
          }))
        )
      }
      setErrors([])
    }
  }, [isOpen, domain, editingProperty])

  const handleDimensionRangeChange = (
    dimensionId: string,
    field: 'min' | 'max',
    value: number
  ) => {
    setDimensionRanges((ranges) =>
      ranges.map((r) => {
        if (r.dimensionId === dimensionId) {
          const newRange: readonly [number, number] =
            field === 'min' ? [value, r.range[1]] : [r.range[0], value]
          return { ...r, range: newRange }
        }
        return r
      })
    )
  }

  const validate = (): boolean => {
    const newErrors: string[] = []

    if (!name.trim()) {
      newErrors.push('Property name is required')
    }

    if (!domain) {
      newErrors.push('Invalid domain')
      setErrors(newErrors)
      return false
    }

    dimensionRanges.forEach((dr) => {
      const dimension = domain.dimensions.find((d) => d.id === dr.dimensionId)
      if (!dimension) return

      if (dr.range[0] >= dr.range[1]) {
        newErrors.push(`${dimension.name}: Min must be less than Max`)
      }

      if (dr.range[0] < dimension.range[0] || dr.range[1] > dimension.range[1]) {
        newErrors.push(
          `${dimension.name}: Range must be within domain range [${dimension.range[0]}, ${dimension.range[1]}]`
        )
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !domain) {
      return
    }

    const property: Property = {
      id: editingProperty?.id || generateId(),
      name,
      domainId: domain.id,
      dimensions: dimensionRanges,
      createdAt: editingProperty?.createdAt || new Date(),
    }

    if (editingProperty) {
      updateProperty(domain.id, property)
    } else {
      addProperty(domain.id, property)
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

  if (!isOpen || !domain) return null

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="modal-backdrop" onClick={handleBackdropClick} />
      <div className="modal-content" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {editingProperty ? 'Edit Property' : 'Create Property'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="property-name" className="block text-sm font-medium mb-1">
                Property Name
              </label>
              <input
                id="property-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Red, Heavy, Bright"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Dimension Ranges (Domain: {domain.name})
              </label>
              <div className="space-y-3">
                {dimensionRanges.map((dr) => {
                  const dimension = domain.dimensions.find((d) => d.id === dr.dimensionId)
                  if (!dimension) return null

                  return (
                    <div key={dr.dimensionId} className="border border-gray-200 rounded p-3">
                      <div className="text-sm font-medium mb-2">{dimension.name}</div>
                      <div className="text-xs text-gray-500 mb-2">
                        Domain range: [{dimension.range[0]}, {dimension.range[1]}]
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Min</label>
                          <input
                            type="number"
                            value={dr.range[0]}
                            onChange={(e) =>
                              handleDimensionRangeChange(
                                dr.dimensionId,
                                'min',
                                parseFloat(e.target.value)
                              )
                            }
                            step="any"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Max</label>
                          <input
                            type="number"
                            value={dr.range[1]}
                            onChange={(e) =>
                              handleDimensionRangeChange(
                                dr.dimensionId,
                                'max',
                                parseFloat(e.target.value)
                              )
                            }
                            step="any"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingProperty ? 'Update Property' : 'Save Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
