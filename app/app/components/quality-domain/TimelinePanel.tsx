'use client'

import { useState } from 'react'

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
const DOT_RADIUS = 8
const MARKER_WIDTH = 110
const MARKER_HEIGHT = 32
const MARKER_TIP_HEIGHT = 10
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

  // Build the interleaved sequence: state0, event0, state1, event1, ...
  // Each state dot sits at an even row index, each event marker at an odd row index
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
            Events
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
            // Line from state dot down-right to event marker
            if (ePos) {
              return (
                <line
                  key={`line-s${i}-e${i}`}
                  x1={sPos.x}
                  y1={sPos.y + DOT_RADIUS}
                  x2={ePos.x}
                  y2={ePos.y - MARKER_TIP_HEIGHT - MARKER_HEIGHT / 2}
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
            // Line from event marker down-left to next state dot
            if (nextSPos) {
              return (
                <line
                  key={`line-e${i}-s${i + 1}`}
                  x1={ePos.x}
                  y1={ePos.y + MARKER_HEIGHT / 2}
                  x2={nextSPos.x}
                  y2={nextSPos.y - DOT_RADIUS}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )
            }
            return null
          })}

          {/* State dots */}
          {MOCK_STATES.map((state, i) => {
            const pos = statePositions[i]
            const isSelected = selected?.type === 'state' && selected.id === state.id
            return (
              <g
                key={state.id}
                onClick={() => handleSelect('state', state.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={DOT_RADIUS + 5}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                )}
                {/* Outer circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={DOT_RADIUS}
                  fill={isSelected ? '#3b82f6' : '#6366f1'}
                  stroke={isSelected ? '#2563eb' : '#4f46e5'}
                  strokeWidth={2}
                />
                {/* Inner dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={3}
                  fill="white"
                />
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + DOT_RADIUS + 16}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isSelected ? 600 : 400}
                  fill={isSelected ? '#2563eb' : '#374151'}
                >
                  {state.label}
                </text>
              </g>
            )
          })}

          {/* Event house markers */}
          {MOCK_EVENTS.map((event, i) => {
            const pos = eventPositions[i]
            const isSelected = selected?.type === 'event' && selected.id === event.id
            const halfW = MARKER_WIDTH / 2
            const halfH = MARKER_HEIGHT / 2

            // House marker path: rectangle body with triangular top (pointing up)
            // Starts at top-center tip, goes right to top-right corner of rect,
            // down to bottom-right, across to bottom-left, up to top-left, back to tip.
            const path = [
              `M ${pos.x} ${pos.y - halfH - MARKER_TIP_HEIGHT}`, // tip top center
              `L ${pos.x + halfW} ${pos.y - halfH}`, // top-right of rect
              `L ${pos.x + halfW} ${pos.y + halfH}`, // bottom-right
              `L ${pos.x - halfW} ${pos.y + halfH}`, // bottom-left
              `L ${pos.x - halfW} ${pos.y - halfH}`, // top-left of rect
              'Z',
            ].join(' ')

            return (
              <g
                key={event.id}
                onClick={() => handleSelect('event', event.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection glow */}
                {isSelected && (
                  <path
                    d={path}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    transform={`translate(0, 0) scale(1)`}
                    style={{ filter: 'url(#glow)' }}
                  />
                )}
                {/* Marker shape */}
                <path
                  d={path}
                  fill={isSelected ? '#dbeafe' : '#fef3c7'}
                  stroke={isSelected ? '#3b82f6' : '#f59e0b'}
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
                {/* Label text */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={isSelected ? 600 : 400}
                  fill={isSelected ? '#2563eb' : '#92400e'}
                >
                  {event.label}
                </text>
              </g>
            )
          })}

          {/* SVG filter for selection glow */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
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
