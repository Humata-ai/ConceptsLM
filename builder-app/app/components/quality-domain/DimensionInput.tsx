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
  const isMinInfinity = dimension.range[0] === -Infinity
  const isMaxInfinity = dimension.range[1] === Infinity

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

  const handleMinInfinityToggle = (checked: boolean) => {
    const newMin = checked ? -Infinity : 0
    onChange({ ...dimension, range: [newMin, dimension.range[1]] as const })
  }

  const handleMaxInfinityToggle = (checked: boolean) => {
    const newMax = checked ? Infinity : 1
    onChange({ ...dimension, range: [dimension.range[0], newMax] as const })
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

      {/* Min value with infinity checkbox */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={isMinInfinity ? '' : dimension.range[0]}
          onChange={(e) => handleMinChange(e.target.value)}
          placeholder="Min"
          disabled={isMinInfinity}
          className={`w-20 border rounded px-2 py-2 focus:ring-2 focus:outline-none ${
            isMinInfinity
              ? 'bg-gray-100 text-gray-500'
              : minError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          required={!isMinInfinity}
        />
        <label className="flex items-center gap-1 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={isMinInfinity}
            onChange={(e) => handleMinInfinityToggle(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700">-∞</span>
        </label>
      </div>

      {/* Max value with infinity checkbox */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={isMaxInfinity ? '' : dimension.range[1]}
          onChange={(e) => handleMaxChange(e.target.value)}
          placeholder="Max"
          disabled={isMaxInfinity}
          className={`w-20 border rounded px-2 py-2 focus:ring-2 focus:outline-none ${
            isMaxInfinity
              ? 'bg-gray-100 text-gray-500'
              : minError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          required={!isMaxInfinity}
        />
        <label className="flex items-center gap-1 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={isMaxInfinity}
            onChange={(e) => handleMaxInfinityToggle(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700">∞</span>
        </label>
      </div>

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
