'use client'

import { useState } from 'react'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  borderBottom?: boolean
}

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  borderBottom = false,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={borderBottom ? 'border-b border-gray-200' : ''}>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        {expanded ? (
          <KeyboardArrowUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        ) : (
          <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        )}
      </button>

      {expanded && (
        <div className="px-4 py-2">
          {children}
        </div>
      )}
    </div>
  )
}
