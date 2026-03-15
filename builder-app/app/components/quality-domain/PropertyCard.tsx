'use client'

import { useState } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import type { Property, QualityDomain } from './types'

interface PropertyCardProps {
  property: Property
  domain: QualityDomain
  onEdit: (propertyId: string) => void
}

export default function PropertyCard({ property, domain, onEdit }: PropertyCardProps) {
  const { deleteProperty } = useQualityDomain()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(property.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteProperty(domain.id, property.id)
    setShowDeleteConfirm(false)
  }

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  const getDimensionInfo = () => {
    return property.dimensions.map((dr) => {
      const dimension = domain.dimensions.find((d) => d.id === dr.dimensionId)
      if (!dimension) return null
      return {
        name: dimension.name,
        range: dr.range,
      }
    }).filter(Boolean)
  }

  const dimensionInfo = getDimensionInfo()

  return (
    <div className="p-3 rounded-lg bg-white border border-gray-300">
      {showDeleteConfirm ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-600">Delete this property?</p>
          <div className="flex gap-2">
            <button
              onClick={confirmDelete}
              className="flex-1 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={cancelDelete}
              className="flex-1 px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <h3 className="font-medium text-sm">{property.name}</h3>
          </div>
          <div className="space-y-1 mb-2">
            {dimensionInfo.map((info, index) => (
              <div key={index} className="text-xs text-gray-600">
                <span className="font-medium">{info?.name}:</span>{' '}
                <span className="font-mono">
                  [{info?.range[0]}, {info?.range[1]}]
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
