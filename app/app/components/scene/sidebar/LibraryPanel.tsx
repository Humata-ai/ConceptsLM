'use client'

import SidebarPanel from './SidebarPanel'
import CollapsibleSection from './CollapsibleSection'

export default function LibraryPanel() {
  return (
    <SidebarPanel title="Library">
      <CollapsibleSection title="Manner Verbs">
        <div className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
          <h3 className="font-medium">Follow</h3>
        </div>
      </CollapsibleSection>
    </SidebarPanel>
  )
}
