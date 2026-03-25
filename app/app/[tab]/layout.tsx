'use client'

import Scene from '../components/scene/Scene'
import { useQualityDomain } from '../store'
import Sidebar from '../components/scene/Sidebar'
import TableView from '../components/scene/TableView'
import { StateRestoration } from '../components/scene/StateRestoration'

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
