'use client'

import type { QualityDimension } from './types'
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
    <div className="border border-gray-200 rounded-lg p-3 space-y-3">
      {/* Row 1: Dimension Name + Remove button */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
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
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 font-bold px-1 py-1 mt-5"
          aria-label="Remove dimension"
        >
          ✕
        </button>
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
