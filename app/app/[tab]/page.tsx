'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'

const VALID_TABS = ['scene', 'timeline', 'library', 'import-export'] as const

export default function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = use(params)

  if (!VALID_TABS.includes(tab as typeof VALID_TABS[number])) {
    notFound()
  }

  return null
}
