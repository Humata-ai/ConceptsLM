'use client'

import { useState } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import type { QualityDomain } from './types'

interface DomainCardProps {
  domain: QualityDomain
  isSelected: boolean
}

export default function DomainCard({ domain, isSelected }: DomainCardProps) {
  const { selectDomain, openModal, deleteDomain } = useQualityDomain()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleClick = () => {
    selectDomain(domain.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    openModal(domain.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteDomain(domain.id)
    setShowDeleteConfirm(false)
  }

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
  }

  const getDimensionLabel = () => {
    const count = domain.dimensions.length
    if (count === 0) return '0D'
    if (count === 1) return '1D'
    if (count === 2) return '2D'
    if (count === 3) return '3D'
    return `${count}D`
  }

  return (
    <div
      onClick={handleClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 border-2 border-blue-500'
          : 'bg-white border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {showDeleteConfirm ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-600">Delete this domain?</p>
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
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{domain.name}</h3>
            </div>
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
              {getDimensionLabel()}
            </span>
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
