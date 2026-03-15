'use client'

import Scene from './components/Scene'
import { QualityDomainProvider } from './components/quality-domain/context/QualityDomainContext'
import DomainList from './components/quality-domain/DomainList'
import TableView from './components/quality-domain/TableView'
import { useQualityDomain } from './components/quality-domain/context/QualityDomainContext'

function HomeContent() {
  const { getSelectedDomain } = useQualityDomain()
  const selectedDomain = getSelectedDomain()
  const show4DTable = selectedDomain && selectedDomain.dimensions.length >= 4

  return (
    <div className="relative w-full h-screen">
      <DomainList />
      <Scene />
      {show4DTable && selectedDomain && <TableView domain={selectedDomain} />}
    </div>
  )
}

export default function Home() {
  return (
    <QualityDomainProvider>
      <HomeContent />
    </QualityDomainProvider>
  )
}
