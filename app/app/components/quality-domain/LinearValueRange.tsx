'use client'

import TextField from '@mui/material/TextField'

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

interface LinearValueRangeProps {
  min: number
  max: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  label?: string
}

export default function LinearValueRange({
  min,
  max,
  onMinChange,
  onMaxChange,
  label = 'Dimension value range',
}: LinearValueRangeProps) {
  const isMinInfinity = min === -Infinity
  const isMaxInfinity = max === Infinity
  const rangeError = min >= max

  const handleMinInputChange = (value: string) => {
    const parsed = value === '' ? 0 : parseFloat(value)
    if (!isNaN(parsed)) {
      onMinChange(parsed)
    }
  }

  const handleMaxInputChange = (value: string) => {
    const parsed = value === '' ? 0 : parseFloat(value)
    if (!isNaN(parsed)) {
      onMaxChange(parsed)
    }
  }

  const handleMinInfinityToggle = (checked: boolean) => {
    onMinChange(checked ? -Infinity : 0)
  }

  const handleMaxInfinityToggle = (checked: boolean) => {
    onMaxChange(checked ? Infinity : 1)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-4">{label}</label>
      <div className="flex gap-4">
        {/* Minimum section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              onClick={() => isMinInfinity && handleMinInfinityToggle(false)}
              className={`min-w-0 shrink ${isMinInfinity ? 'cursor-pointer' : ''}`}
            >
              <TextField
                type="number"
                label="Min"
                value={isMinInfinity ? '' : min}
                onChange={(e) => handleMinInputChange(e.target.value)}
                size="small"
                tabIndex={isMinInfinity ? -1 : undefined}
                error={!isMinInfinity && rangeError}
                sx={{
                  width: '100%',
                  minWidth: 0,
                  transition: 'opacity 0.2s',
                  opacity: isMinInfinity ? 0.7 : 1,
                  pointerEvents: isMinInfinity ? 'none' : 'auto',
                }}
              />
            </div>
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
            <div
              onClick={() => isMaxInfinity && handleMaxInfinityToggle(false)}
              className={`min-w-0 shrink ${isMaxInfinity ? 'cursor-pointer' : ''}`}
            >
              <TextField
                type="number"
                label="Max"
                value={isMaxInfinity ? '' : max}
                onChange={(e) => handleMaxInputChange(e.target.value)}
                size="small"
                tabIndex={isMaxInfinity ? -1 : undefined}
                error={!isMaxInfinity && rangeError}
                sx={{
                  width: '100%',
                  minWidth: 0,
                  transition: 'opacity 0.2s',
                  opacity: isMaxInfinity ? 0.7 : 1,
                  pointerEvents: isMaxInfinity ? 'none' : 'auto',
                }}
              />
            </div>
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
