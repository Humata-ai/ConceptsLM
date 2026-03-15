'use client'

import type { QualityDimension } from './types'

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

  const handleMinChange = (value: string) => {
    const min = value === '' ? 0 : parseFloat(value)
    if (!isNaN(min)) {
      onChange({ ...dimension, range: [min, dimension.range[1]] as const })
    }
  }

  const handleMaxChange = (value: string) => {
    const max = value === '' ? 0 : parseFloat(value)
    if (!isNaN(max)) {
      onChange({ ...dimension, range: [dimension.range[0], max] as const })
    }
  }

  const minError = dimension.range[0] >= dimension.range[1]

  return (
    <div className="flex gap-2 items-start">
      <input
        type="text"
        value={dimension.name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Dimension name"
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
      <input
        type="number"
        value={dimension.range[0]}
        onChange={(e) => handleMinChange(e.target.value)}
        placeholder="Min"
        className={`w-24 border rounded px-3 py-2 focus:ring-2 focus:outline-none ${
          minError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        required
      />
      <input
        type="number"
        value={dimension.range[1]}
        onChange={(e) => handleMaxChange(e.target.value)}
        placeholder="Max"
        className={`w-24 border rounded px-3 py-2 focus:ring-2 focus:outline-none ${
          minError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        required
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-red-600 hover:text-red-800 font-bold px-2 py-2"
        aria-label="Remove dimension"
      >
        ✕
      </button>
    </div>
  )
}
