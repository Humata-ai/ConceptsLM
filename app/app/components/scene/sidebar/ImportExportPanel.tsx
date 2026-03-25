'use client'

import SidebarPanel from './SidebarPanel'
import ImportExportSection from '../ImportExportSection'

export default function ImportExportPanel() {
  return (
    <SidebarPanel title="Import / Export">
      <ImportExportSection />
    </SidebarPanel>
  )
}
