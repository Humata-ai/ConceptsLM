'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'

const VALID_TABS = ['scene', 'timeline', 'library', 'import-export'] as const
const VALID_LIBRARY_SECTIONS = ['dictionary', 'quality-domains', 'quality-dimensions'] as const

export default function TabPage({ params }: { params: Promise<{ tab: string[] }> }) {
  const { tab } = use(params)
  const mainTab = tab[0]

  if (!VALID_TABS.includes(mainTab as typeof VALID_TABS[number])) {
    notFound()
  }

  // Handle library sub-routes: /library/dictionary, /library/quality-domains, etc.
  if (mainTab === 'library' && tab.length > 1) {
    const section = tab[1]
    if (!VALID_LIBRARY_SECTIONS.includes(section as typeof VALID_LIBRARY_SECTIONS[number])) {
      notFound()
    }
    // No further nesting allowed
    if (tab.length > 2) {
      notFound()
    }
  }

  // No sub-routes for non-library tabs
  if (mainTab !== 'library' && tab.length > 1) {
    notFound()
  }

  return null
}
