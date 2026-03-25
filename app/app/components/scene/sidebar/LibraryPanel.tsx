'use client'

import { usePathname, useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CategoryIcon from '@mui/icons-material/Category'
import TuneIcon from '@mui/icons-material/Tune'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SidebarPanel from './SidebarPanel'
import { getLibrarySectionFromPathname, LIBRARY_SECTION_LABELS } from './types'
import type { LibrarySection } from './types'

const LIBRARY_MENU_ITEMS: { section: LibrarySection; icon: React.ReactNode }[] = [
  { section: 'dictionary', icon: <MenuBookIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
  { section: 'quality-domains', icon: <CategoryIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
  { section: 'quality-dimensions', icon: <TuneIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
]

function LibraryMenu({ onNavigate }: { onNavigate: (section: LibrarySection) => void }) {
  return (
    <div className="py-1">
      {LIBRARY_MENU_ITEMS.map(({ section, icon }) => (
        <button
          key={section}
          onClick={() => onNavigate(section)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {icon}
            <Typography variant="body1">
              {LIBRARY_SECTION_LABELS[section]}
            </Typography>
          </div>
          <ChevronRightIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </button>
      ))}
    </div>
  )
}

function DictionaryView() {
  return (
    <div className="px-4 py-2">
      <div className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
        <h3 className="font-medium">Follow</h3>
      </div>
    </div>
  )
}

function QualityDomainsView() {
  return (
    <div className="px-4 py-2">
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Quality Domains library coming soon.</p>
      </div>
    </div>
  )
}

function QualityDimensionsView() {
  return (
    <div className="px-4 py-2">
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Quality Dimensions library coming soon.</p>
      </div>
    </div>
  )
}

const SECTION_VIEWS: Record<LibrarySection, React.ComponentType> = {
  'dictionary': DictionaryView,
  'quality-domains': QualityDomainsView,
  'quality-dimensions': QualityDimensionsView,
}

export default function LibraryPanel() {
  const pathname = usePathname()
  const router = useRouter()
  const activeSection = getLibrarySectionFromPathname(pathname)

  const handleNavigateToSection = (section: LibrarySection) => {
    router.push(`/library/${section}`)
  }

  const handleBreadcrumbNavigate = (href: string) => {
    router.push(href)
  }

  // Sub-section view with breadcrumb
  if (activeSection) {
    const SectionView = SECTION_VIEWS[activeSection]
    return (
      <SidebarPanel
        title={[
          { label: 'Library', href: '/library' },
          { label: LIBRARY_SECTION_LABELS[activeSection] },
        ]}
        onNavigate={handleBreadcrumbNavigate}
      >
        <SectionView />
      </SidebarPanel>
    )
  }

  // Main library menu
  return (
    <SidebarPanel title="Library">
      <LibraryMenu onNavigate={handleNavigateToSection} />
    </SidebarPanel>
  )
}
