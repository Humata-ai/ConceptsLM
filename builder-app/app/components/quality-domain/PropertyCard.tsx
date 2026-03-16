'use client'

import { useState } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import type { Property, QualityDomain } from './types'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface PropertyCardProps {
  property: Property
  domain: QualityDomain
  onEdit: (propertyId: string) => void
}

export default function PropertyCard({ property, domain, onEdit }: PropertyCardProps) {
  const { deleteProperty } = useQualityDomain()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setAnchorEl(null)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleMenuClose()
    onEdit(property.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleMenuClose()
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
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm flex-1">{property.name}</h3>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              aria-label="more options"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
            </Menu>
          </div>
          <div className="space-y-1">
            {dimensionInfo.map((info, index) => (
              <div key={index} className="text-xs text-gray-600">
                <span className="font-medium">{info?.name}:</span>{' '}
                <span className="font-mono">
                  [{info?.range[0]}, {info?.range[1]}]
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
