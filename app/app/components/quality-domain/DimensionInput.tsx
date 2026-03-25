'use client'

import TextField from '@mui/material/TextField'
import type { QualityDimension } from './types'

interface ToggleKnobProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleKnob({ checked, onChange }: ToggleKnobProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

interface ToggleLabelProps {
  active: boolean
  children: React.ReactNode
}

function ToggleLabel({ active, children }: ToggleLabelProps) {
  return (
    <span className={`text-sm text-gray-700 whitespace-nowrap transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}>
      {children}
    </span>
  )
}

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

      {/* Row 2: Minimum and Maximum side by side */}
      <label className="block text-xs font-medium text-gray-600 mb-4">Dimension value range</label>
      <div className="flex gap-4">
        {/* Minimum section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <TextField
              type="number"
              label="Minimum"
              value={isMinInfinity ? '' : dimension.range[0]}
              onChange={(e) => handleMinChange(e.target.value)}
              size="small"
              tabIndex={isMinInfinity ? -1 : undefined}
              error={!isMinInfinity && minError}
              sx={{
                width: 100,
                minWidth: 0,
                transition: 'opacity 0.2s',
                opacity: isMinInfinity ? 0.7 : 1,
                pointerEvents: isMinInfinity ? 'none' : 'auto',
              }}
            />
            <ToggleKnob
              checked={isMinInfinity}
              onChange={handleMinInfinityToggle}
            />
            <ToggleLabel active={isMinInfinity}>-Infinity</ToggleLabel>
          </div>
        </div>

        {/* Maximum section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <TextField
              type="number"
              label="Maximum"
              value={isMaxInfinity ? '' : dimension.range[1]}
              onChange={(e) => handleMaxChange(e.target.value)}
              size="small"
              tabIndex={isMaxInfinity ? -1 : undefined}
              error={!isMaxInfinity && minError}
              sx={{
                width: 100,
                minWidth: 0,
                transition: 'opacity 0.2s',
                opacity: isMaxInfinity ? 0.7 : 1,
                pointerEvents: isMaxInfinity ? 'none' : 'auto',
              }}
            />
            <ToggleKnob
              checked={isMaxInfinity}
              onChange={handleMaxInfinityToggle}
            />
            <ToggleLabel active={isMaxInfinity}>Infinity</ToggleLabel>
          </div>
        </div>
      </div>
    </div>
  )
}
