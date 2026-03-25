'use client'

import Typography from '@mui/material/Typography'

interface SidebarPanelProps {
  title: string
  children: React.ReactNode
  headerAction?: React.ReactNode
}

export default function SidebarPanel({ title, children, headerAction }: SidebarPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        {headerAction}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
