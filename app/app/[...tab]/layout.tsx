'use client'

import { usePathname } from 'next/navigation'
import Scene from '../components/scene/Scene'
import { useQualityDomain } from '../store'
import Sidebar from '../components/scene/Sidebar'
import TableView from '../components/scene/TableView'
import { StateRestoration } from '../components/scene/StateRestoration'
import { getTabFromPathname } from '../components/scene/sidebar/types'

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeTab = getTabFromPathname(pathname)
  const { getSelectedDomain } = useQualityDomain()
  const selectedDomain = getSelectedDomain()
  const show4DTable = selectedDomain && selectedDomain.dimensions.length >= 4

  return (
    <div className="relative w-full h-screen">
      <StateRestoration />
      <Sidebar />
      <Scene activeTab={activeTab} />
      {show4DTable && selectedDomain && <TableView domain={selectedDomain} />}
      {children}
    </div>
  )
}
