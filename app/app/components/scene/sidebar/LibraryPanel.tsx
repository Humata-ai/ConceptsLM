'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CategoryIcon from '@mui/icons-material/Category'
import TuneIcon from '@mui/icons-material/Tune'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SidebarPanel from './SidebarPanel'
import { getLibrarySectionFromPathname, getDictionaryWordFromPathname, LIBRARY_SECTION_LABELS } from './types'
import type { LibrarySection } from './types'
import { useAppStore } from '@/app/store'
import { WORD_CLASS_LABELS } from '../../shared/types'
import AddWordModal from '../../dictionary/AddWordModal'
import WordEditView from '../../dictionary/WordEditView'
import WordDetailView from '../../dictionary/WordDetailView'

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
  const router = useRouter()
  const { state } = useAppStore()

  if (state.words.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <p className="text-sm">No words yet. Click + to add one.</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-2 space-y-2">
      {state.words.map((word) => {
        const slug = word.name.toLowerCase().replace(/\s+/g, '-')
        return (
          <button
            key={word.id}
            onClick={() => router.push(`/library/dictionary/${encodeURIComponent(slug)}`)}
            className="w-full p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors text-left"
          >
            <h3 className="font-medium">{word.name}</h3>
            <span className="text-xs text-gray-500">{WORD_CLASS_LABELS[word.wordClass]}</span>
          </button>
        )
      })}
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
  const wordRoute = getDictionaryWordFromPathname(pathname)
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false)

  const handleNavigateToSection = (section: LibrarySection) => {
    router.push(`/library/${section}`)
  }

  const handleBreadcrumbNavigate = (href: string) => {
    router.push(href)
  }

  // Word detail or edit view: /library/dictionary/<word> or /library/dictionary/<word>/edit
  if (wordRoute) {
    const titleSegments = [
      { label: 'Library', href: '/library' },
      { label: 'Dictionary', href: '/library/dictionary' },
      { label: decodeURIComponent(wordRoute.wordSlug) },
    ]
    if (wordRoute.isEdit) {
      titleSegments.push({ label: 'Edit' })
    }

    return (
      <SidebarPanel
        title={titleSegments}
        onNavigate={handleBreadcrumbNavigate}
      >
        {wordRoute.isEdit ? (
          <WordEditView wordSlug={wordRoute.wordSlug} />
        ) : (
          <WordDetailView wordSlug={wordRoute.wordSlug} />
        )}
      </SidebarPanel>
    )
  }

  // Sub-section view with breadcrumb
  if (activeSection) {
    const SectionView = SECTION_VIEWS[activeSection]

    const headerAction = activeSection === 'dictionary' ? (
      <Tooltip title="Add Word">
        <span>
          <Button
            onClick={() => setIsAddWordModalOpen(true)}
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ minWidth: 0, p: 0.5 }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </Button>
        </span>
      </Tooltip>
    ) : undefined

    return (
      <>
        <SidebarPanel
          title={[
            { label: 'Library', href: '/library' },
            { label: LIBRARY_SECTION_LABELS[activeSection] },
          ]}
          onNavigate={handleBreadcrumbNavigate}
          headerAction={headerAction}
        >
          <SectionView />
        </SidebarPanel>
        <AddWordModal
          isOpen={isAddWordModalOpen}
          onClose={() => setIsAddWordModalOpen(false)}
        />
      </>
    )
  }

  // Main library menu
  return (
    <SidebarPanel title="Library">
      <LibraryMenu onNavigate={handleNavigateToSection} />
    </SidebarPanel>
  )
}
