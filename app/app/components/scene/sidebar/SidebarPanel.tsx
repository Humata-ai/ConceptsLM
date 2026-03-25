'use client'

import Typography from '@mui/material/Typography'

interface BreadcrumbSegment {
  label: string
  href?: string
}

interface SidebarPanelProps {
  title: string | BreadcrumbSegment[]
  children: React.ReactNode
  headerAction?: React.ReactNode
  onNavigate?: (href: string) => void
}

export default function SidebarPanel({ title, children, headerAction, onNavigate }: SidebarPanelProps) {
  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      )
    }

    return (
      <div className="flex items-center gap-1">
        {title.map((segment, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', mx: 0.25 }}>
                /
              </Typography>
            )}
            {segment.href && onNavigate ? (
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'text.primary' },
                  transition: 'color 0.15s',
                }}
                onClick={() => onNavigate(segment.href!)}
              >
                {segment.label}
              </Typography>
            ) : (
              <Typography variant="subtitle1" fontWeight="bold">
                {segment.label}
              </Typography>
            )}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        {renderTitle()}
        {headerAction}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
