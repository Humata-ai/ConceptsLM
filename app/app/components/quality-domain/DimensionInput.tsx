'use client'

import CloseIcon from '@mui/icons-material/Close'
import type { QualityDimension } from '../shared/types'
import LinearValueRange from './LinearValueRange'

interface DimensionInputProps {
  dimension: QualityDimension
  onChange: (dimension: QualityDimension) => void
  onRemove: () => void
}

export default function DimensionInput({
  dimension,
  onChange,
  onRemove,
}: DimensionInputProps) {
  const handleNameChange = (name: string) => {
    onChange({ ...dimension, name })
  }

  const handleMinChange = (value: number) => {
    onChange({ ...dimension, range: [value, dimension.range[1]] as const })
  }

  const handleMaxChange = (value: number) => {
    onChange({ ...dimension, range: [dimension.range[0], value] as const })
  }

  return (
    <div className="relative border border-gray-200 rounded-lg p-3 space-y-3">
      {/* Remove button - top right corner */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 cursor-pointer"
        aria-label="Remove dimension"
      >
        <CloseIcon sx={{ fontSize: 12 }} />
      </button>

      {/* Row 1: Dimension Name */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Dimension name</label>
        <input
          type="text"
          value={dimension.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Dimension name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Row 2: Linear Value Range */}
      <LinearValueRange
        min={dimension.range[0]}
        max={dimension.range[1]}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    </div>
  )
}
