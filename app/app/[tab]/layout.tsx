'use client'

import Scene from '../components/Scene'
import { useQualityDomain } from '../store'
import Sidebar from '../components/quality-domain/Sidebar'
import TableView from '../components/quality-domain/TableView'
import { StateRestoration } from '../components/quality-domain/StateRestoration'

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const { getSelectedDomain } = useQualityDomain()
  const selectedDomain = getSelectedDomain()
  const show4DTable = selectedDomain && selectedDomain.dimensions.length >= 4

  return (
    <div className="relative w-full h-screen">
      <StateRestoration />
      <Sidebar />
      <Scene />
      {show4DTable && selectedDomain && <TableView domain={selectedDomain} />}
      {children}
    </div>
  )
}
