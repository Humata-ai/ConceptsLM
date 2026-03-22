'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import Scene from '../components/Scene'
import { AppStoreProvider, useQualityDomain } from '../store'
import Sidebar from '../components/quality-domain/Sidebar'
import TableView from '../components/quality-domain/TableView'
import { ToastProvider } from '../components/ToastProvider'
import { StateRestoration } from '../components/quality-domain/StateRestoration'

const VALID_TABS = ['data', 'timeline', 'import-export'] as const

function TabContent() {
  const { getSelectedDomain } = useQualityDomain()
  const selectedDomain = getSelectedDomain()
  const show4DTable = selectedDomain && selectedDomain.dimensions.length >= 4

  return (
    <div className="relative w-full h-screen">
      <StateRestoration />
      <Sidebar />
      <Scene />
      {show4DTable && selectedDomain && <TableView domain={selectedDomain} />}
    </div>
  )
}

export default function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = use(params)

  if (!VALID_TABS.includes(tab as typeof VALID_TABS[number])) {
    notFound()
  }

  return (
    <AppStoreProvider>
      <ToastProvider>
        <TabContent />
      </ToastProvider>
    </AppStoreProvider>
  )
}
