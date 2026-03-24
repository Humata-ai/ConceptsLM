'use client'

import { useState, useEffect } from 'react'
import { useQualityDomain } from '@/app/store'
import type { QualityDomainLabel, RegionDimensionRange, PointDimensionValue, QualityDimension } from './types'
import { generateId } from './utils'
import Modal from '@/app/components/common/Modal'

interface LabelModalProps {
  isOpen: boolean
  domainId: string | null
  editingLabelId: string | null
  onClose: () => void
}

export default function LabelModal({
  isOpen,
  domainId,
  editingLabelId,
  onClose,
}: LabelModalProps) {
  const { state, addLabel, updateLabel } = useQualityDomain()
  const [name, setName] = useState('')
  const [labelType, setLabelType] = useState<'region' | 'point' | null>(null)
  const [regionDimensions, setRegionDimensions] = useState<RegionDimensionRange[]>([])
  const [pointDimensions, setPointDimensions] = useState<PointDimensionValue[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const domain = domainId ? state.domains.find((d) => d.id === domainId) : null
  const editingLabel = editingLabelId && domain
    ? domain.labels.find((l) => l.id === editingLabelId)
    : null

  useEffect(() => {
    if (isOpen && domain) {
      if (editingLabel) {
        setName(editingLabel.name)
        setLabelType(editingLabel.type)

        if (editingLabel.type === 'region') {
          setRegionDimensions(editingLabel.dimensions)
          setPointDimensions([])
        } else {
          setPointDimensions(editingLabel.dimensions)
          setRegionDimensions([])
        }
      } else {
        setName('')
        setLabelType(null)
        setRegionDimensions(
          domain.dimensions.map((dim) => ({
            dimensionId: dim.id,
            range: dim.range,
          }))
        )
        setPointDimensions(
          domain.dimensions.map((dim) => ({
            dimensionId: dim.id,
            value: (dim.range[0] + dim.range[1]) / 2,
          }))
        )
      }
      setErrors([])
    }
  }, [isOpen, domain, editingLabel])

  const handleRegionRangeChange = (
    dimensionId: string,
    field: 'min' | 'max',
    value: number
  ) => {
    setRegionDimensions((ranges) =>
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

  const handlePointValueChange = (dimensionId: string, value: number) => {
    setPointDimensions((points) =>
      points.map((p) =>
        p.dimensionId === dimensionId ? { ...p, value } : p
      )
    )
  }

  const validate = (): boolean => {
    const newErrors: string[] = []

    if (!name.trim()) {
      newErrors.push('Label name is required')
    }

    if (!labelType) {
      newErrors.push('Please select a label type')
    }

    if (!domain) {
      newErrors.push('Invalid domain')
      setErrors(newErrors)
      return false
    }

    if (labelType === 'region') {
      regionDimensions.forEach((dr) => {
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
    } else if (labelType === 'point') {
      pointDimensions.forEach((pd) => {
        const dimension = domain.dimensions.find((d) => d.id === pd.dimensionId)
        if (!dimension) return

        if (pd.value < dimension.range[0] || pd.value > dimension.range[1]) {
          newErrors.push(
            `${dimension.name}: Value must be within domain range [${dimension.range[0]}, ${dimension.range[1]}]`
          )
        }
      })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleGenerate = async () => {
    if (!name.trim()) {
      setErrors(['Please enter a label name before generating'])
      return
    }
    if (!labelType || !domain) return

    setIsGenerating(true)
    setErrors([])

    try {
      const response = await fetch('/api/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labelName: name,
          labelType,
          domainName: domain.name,
          dimensions: domain.dimensions.map((d) => ({
            id: d.id,
            name: d.name,
            range: [d.range[0], d.range[1]],
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate')
      }

      const data = await response.json()

      if (labelType === 'region' && data.type === 'region') {
        setRegionDimensions(data.dimensions)
      } else if (labelType === 'point' && data.type === 'point') {
        setPointDimensions(data.dimensions)
      }
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Failed to generate label dimensions'])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !domain || !labelType) {
      return
    }

    const label: QualityDomainLabel = labelType === 'region'
      ? {
          type: 'region',
          id: editingLabel?.id || generateId(),
          name,
          domainId: domain.id,
          dimensions: regionDimensions,
          createdAt: editingLabel?.createdAt || new Date(),
        }
      : {
          type: 'point',
          id: editingLabel?.id || generateId(),
          name,
          domainId: domain.id,
          dimensions: pointDimensions,
          createdAt: editingLabel?.createdAt || new Date(),
        }

    if (editingLabel) {
      updateLabel(domain.id, label)
    } else {
      addLabel(domain.id, label)
    }

    onClose()
  }

  if (!isOpen || !domain) return null

  const showTypeSelection = !editingLabel && !labelType
  const showForm = editingLabel || labelType

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLabel ? 'Edit Label' : 'Create Label'}
    >

          {showTypeSelection && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Choose the type of label to create:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLabelType('region')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-lg font-semibold mb-2">Region</div>
                  <div className="text-sm text-gray-600">
                    Define a range for each dimension
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setLabelType('point')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-lg font-semibold mb-2">Point</div>
                  <div className="text-sm text-gray-600">
                    Define a single value for each dimension
                  </div>
                </button>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {editingLabel && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <div className="text-sm font-medium text-blue-900">
                    Type: {editingLabel.type === 'region' ? 'Region' : 'Point'}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="label-name" className="block text-sm font-medium mb-1">
                  Label Name
                </label>
                <div className="flex gap-2">
                  <input
                    id="label-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Red, Heavy, Bright"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !name.trim()}
                    className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    {isGenerating ? 'Generating...' : 'AI Fill'}
                  </button>
                </div>
              </div>

              {labelType === 'region' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dimension Ranges (Domain: {domain.name})
                  </label>
                  <div className="space-y-3">
                    {regionDimensions.map((dr) => {
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
                                  handleRegionRangeChange(
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
                                  handleRegionRangeChange(
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
              )}

              {labelType === 'point' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dimension Values (Domain: {domain.name})
                  </label>
                  <div className="space-y-3">
                    {pointDimensions.map((pd) => {
                      const dimension = domain.dimensions.find((d) => d.id === pd.dimensionId)
                      if (!dimension) return null

                      return (
                        <div key={pd.dimensionId} className="border border-gray-200 rounded p-3">
                          <div className="text-sm font-medium mb-2">{dimension.name}</div>
                          <div className="text-xs text-gray-500 mb-2">
                            Domain range: [{dimension.range[0]}, {dimension.range[1]}]
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Value</label>
                            <input
                              type="number"
                              value={pd.value}
                              onChange={(e) =>
                                handlePointValueChange(pd.dimensionId, parseFloat(e.target.value))
                              }
                              step="any"
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

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
              {editingLabel ? 'Update Label' : 'Save Label'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
