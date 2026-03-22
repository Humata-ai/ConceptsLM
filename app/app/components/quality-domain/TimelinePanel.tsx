'use client'

import { useState } from 'react'
import CircleIcon from '@mui/icons-material/Circle'
import BeenhereIcon from '@mui/icons-material/Beenhere'

// Mock data for the timeline
const MOCK_STATES = [
  { id: 's1', label: 'Initialized' },
  { id: 's2', label: 'Processing' },
  { id: 's3', label: 'Validating' },
  { id: 's4', label: 'Completed' },
]

const MOCK_EVENTS = [
  { id: 'e1', label: 'onStart' },
  { id: 'e2', label: 'onProcess' },
  { id: 'e3', label: 'onValidate' },
  { id: 'e4', label: 'onComplete' },
]

type SelectedItem = { type: 'state'; id: string } | { type: 'event'; id: string } | null

// Vertical spacing constants
const ROW_HEIGHT = 80
const ICON_SIZE = 24
const LEFT_COL_X = 60
const RIGHT_COL_X = 200
const START_Y = 40

export default function TimelinePanel() {
  const [selected, setSelected] = useState<SelectedItem>(null)

  const handleSelect = (type: 'state' | 'event', id: string) => {
    if (selected?.type === type && selected.id === id) {
      setSelected(null)
    } else {
      setSelected({ type, id })
    }
  }

  const totalRows = MOCK_STATES.length + MOCK_EVENTS.length
  const svgHeight = START_Y + totalRows * ROW_HEIGHT + 40

  // Positions
  const statePositions = MOCK_STATES.map((_, i) => ({
    x: LEFT_COL_X,
    y: START_Y + i * 2 * ROW_HEIGHT,
  }))

  const eventPositions = MOCK_EVENTS.map((_, i) => ({
    x: RIGHT_COL_X,
    y: START_Y + (i * 2 + 1) * ROW_HEIGHT,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Column Headers */}
      <div className="flex px-4 pt-3 pb-1">
        <div className="flex-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            State
          </span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Event
          </span>
        </div>
      </div>

      {/* SVG Timeline */}
      <div className="flex-1 overflow-y-auto px-2">
        <svg
          width="100%"
          height={svgHeight}
          viewBox={`0 0 280 ${svgHeight}`}
          style={{ display: 'block' }}
        >
          {/* Connecting lines: state[i] -> event[i] -> state[i+1] */}
          {MOCK_STATES.map((_, i) => {
            const sPos = statePositions[i]
            const ePos = eventPositions[i]
            if (ePos) {
              return (
                <line
                  key={`line-s${i}-e${i}`}
                  x1={sPos.x}
                  y1={sPos.y + ICON_SIZE / 2}
                  x2={ePos.x}
                  y2={ePos.y - ICON_SIZE / 2}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )
            }
            return null
          })}
          {MOCK_EVENTS.map((_, i) => {
            const ePos = eventPositions[i]
            const nextSPos = statePositions[i + 1]
            if (nextSPos) {
              return (
                <line
                  key={`line-e${i}-s${i + 1}`}
                  x1={ePos.x}
                  y1={ePos.y + ICON_SIZE / 2}
                  x2={nextSPos.x}
                  y2={nextSPos.y - ICON_SIZE / 2}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )
            }
            return null
          })}

          {/* State icons (CircleIcon) */}
          {MOCK_STATES.map((state, i) => {
            const pos = statePositions[i]
            const isSelected = selected?.type === 'state' && selected.id === state.id
            return (
              <foreignObject
                key={state.id}
                x={pos.x - ICON_SIZE / 2}
                y={pos.y - ICON_SIZE / 2}
                width={ICON_SIZE}
                height={ICON_SIZE}
                onClick={() => handleSelect('state', state.id)}
                style={{ cursor: 'pointer' }}
              >
                <CircleIcon
                  sx={{
                    fontSize: ICON_SIZE,
                    color: isSelected ? 'primary.main' : '#9ca3af',
                  }}
                />
              </foreignObject>
            )
          })}

          {/* Event icons (BeenhereIcon) */}
          {MOCK_EVENTS.map((event, i) => {
            const pos = eventPositions[i]
            const isSelected = selected?.type === 'event' && selected.id === event.id
            return (
              <foreignObject
                key={event.id}
                x={pos.x - ICON_SIZE / 2}
                y={pos.y - ICON_SIZE / 2}
                width={ICON_SIZE}
                height={ICON_SIZE}
                onClick={() => handleSelect('event', event.id)}
                style={{ cursor: 'pointer' }}
              >
                <BeenhereIcon
                  sx={{
                    fontSize: ICON_SIZE,
                    color: isSelected ? 'primary.main' : '#9ca3af',
                  }}
                />
              </foreignObject>
            )
          })}
        </svg>
      </div>

      {/* Selected item detail */}
      {selected && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Selected {selected.type}
          </div>
          <div className="text-sm font-medium text-gray-800">
            {selected.type === 'state'
              ? MOCK_STATES.find((s) => s.id === selected.id)?.label
              : MOCK_EVENTS.find((e) => e.id === selected.id)?.label}
          </div>
        </div>
      )}
    </div>
  )
}
