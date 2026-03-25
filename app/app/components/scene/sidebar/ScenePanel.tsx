'use client'

import SidebarPanel from './SidebarPanel'
import QualityDomainsSection from './QualityDomainsSection'
import ConceptsSection from './ConceptsSection'

export default function ScenePanel() {
  return (
    <SidebarPanel title="Scene">
      <QualityDomainsSection />
      <ConceptsSection />
    </SidebarPanel>
  )
}
