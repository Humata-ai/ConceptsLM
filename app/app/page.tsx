'use client'

import Scene from './components/Scene'
import { AppStoreProvider, useQualityDomain } from './store'
import Sidebar from './components/quality-domain/Sidebar'
import TableView from './components/quality-domain/TableView'

import { ToastProvider } from './components/ToastProvider'
import { StateRestoration } from './components/quality-domain/StateRestoration'

function HomeContent() {
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

export default function Home() {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <HomeContent />
      </ToastProvider>
    </AppStoreProvider>
  )
}
