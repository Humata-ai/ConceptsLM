'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQualityDomain } from '@/app/store'
import DomainCard from '../quality-domain/DomainCard'
import DomainModal from '../quality-domain/DomainModal'
import LabelCard from '../quality-domain/LabelCard'
import LabelModal from '../quality-domain/LabelModal'
import ConceptCard from '../concept/ConceptCard'
import ConceptModal from '../concept/ConceptModal'
import TimelinePanel from './TimelinePanel'
import EventModal from './EventModal'
import LayersIcon from '@mui/icons-material/Layers'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import TimelineIcon from '@mui/icons-material/Timeline'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ImportExportSection from './ImportExportSection'

type SidebarView = 'scene' | 'import-export' | 'timeline' | 'library'

const VALID_TABS: SidebarView[] = ['scene', 'import-export', 'timeline', 'library']

function getTabFromPathname(pathname: string): SidebarView | null {
  const segment = pathname.replace(/^\//, '')
  if (VALID_TABS.includes(segment as SidebarView)) {
    return segment as SidebarView
  }
  return null
}

export default function Sidebar() {
  const { state, getSelectedDomain } = useQualityDomain()
  const pathname = usePathname()
  const router = useRouter()
  const activeView = getTabFromPathname(pathname)
  const [collapsed, setCollapsed] = useState(false)
  const visibleView = collapsed ? null : activeView

  const handleTabClick = (tab: SidebarView) => {
    if (activeView === tab) {
      setCollapsed((prev) => !prev)
      return
    }
    setCollapsed(false)
    router.push(`/${tab}`)
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null)
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null)
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false)
  const [editingConceptId, setEditingConceptId] = useState<string | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [domainsExpanded, setDomainsExpanded] = useState(true)
  const [conceptsExpanded, setConceptsExpanded] = useState(true)

  const selectedDomain = getSelectedDomain()

  return (
    <>
      <div className="fixed top-0 left-0 h-full z-30 flex">
        {/* Vertical Tab Strip (always visible) */}
        <div
          className="h-full flex flex-col items-center py-2 gap-1"
          style={{
            width: 48,
            backgroundColor: 'rgba(245, 245, 245, 0.98)',
            borderRight: '1px solid rgba(0,0,0,0.08)',
          }}
        >
            <Tooltip title="Scene" placement="right">
              <IconButton
                onClick={() => handleTabClick('scene')}
                sx={{
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                  backgroundColor: visibleView === 'scene' ? 'primary.main' : 'transparent',
                  color: visibleView === 'scene' ? 'white' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: visibleView === 'scene' ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <LayersIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Timeline" placement="right">
              <IconButton
                onClick={() => handleTabClick('timeline')}
                sx={{
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                  backgroundColor: visibleView === 'timeline' ? 'primary.main' : 'transparent',
                  color: visibleView === 'timeline' ? 'white' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: visibleView === 'timeline' ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <TimelineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Library" placement="right">
              <IconButton
                onClick={() => handleTabClick('library')}
                sx={{
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                  backgroundColor: visibleView === 'library' ? 'primary.main' : 'transparent',
                  color: visibleView === 'library' ? 'white' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: visibleView === 'library' ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <CollectionsBookmarkIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Import / Export" placement="right">
              <IconButton
                onClick={() => handleTabClick('import-export')}
                sx={{
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                  backgroundColor: visibleView === 'import-export' ? 'primary.main' : 'transparent',
                  color: visibleView === 'import-export' ? 'white' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: visibleView === 'import-export' ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ImportExportIcon fontSize="small" />
              </IconButton>
            </Tooltip>
        </div>

        {/* Sidebar Content Panel */}
        {visibleView && (
          <div className="bg-white/95 backdrop-blur-sm shadow-xl h-full overflow-y-auto w-80 flex flex-col">
            {/* Scene View */}
            {activeView === 'scene' && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-gray-200">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Scene
                  </Typography>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Quality Domains Section */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => setDomainsExpanded((prev) => !prev)}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Quality Domains
                      </Typography>
                      {domainsExpanded ? (
                        <KeyboardArrowUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      )}
                    </button>

                    {domainsExpanded && (
                      <div className="px-4 py-2">
                        {state.domains.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No domains yet.</p>
                            <p className="text-xs mt-1">Click &quot;New domain&quot; to create one.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {state.domains.map((domain) => (
                              <DomainCard
                                key={domain.id}
                                domain={domain}
                                isSelected={state.selectedDomainId === domain.id}
                                onEdit={(id) => {
                                  setEditingDomainId(id)
                                  setIsModalOpen(true)
                                }}
                              >
                                {(state.selectedDomainId === domain.id || state.selectedLabelDomainId === domain.id) && (
                                  <div className="pl-2">
                                    {domain.labels.length === 0 ? (
                                      <div className="text-center py-4 text-gray-500">
                                        <p className="text-xs">No labels yet.</p>
                                      </div>
                                    ) : (
                                      <div className="space-y-2 mb-2">
                                        {domain.labels.map((label) => (
                                          <LabelCard
                                            key={label.id}
                                            label={label}
                                            domain={domain}
                                            isSelected={
                                              state.selectedLabelId === label.id &&
                                              state.selectedLabelDomainId === domain.id
                                            }
                                            onEdit={(id) => {
                                              setEditingLabelId(id)
                                              setIsLabelModalOpen(true)
                                            }}
                                          />
                                        ))}
                                      </div>
                                    )}

                                    <Button
                                      onClick={() => {
                                        setEditingLabelId(null)
                                        setIsLabelModalOpen(true)
                                      }}
                                      variant="outlined"
                                      color="primary"
                                      fullWidth
                                      sx={{ textTransform: 'none' }}
                                    >
                                      Add label
                                    </Button>
                                  </div>
                                )}
                              </DomainCard>
                            ))}
                          </div>
                        )}

                        <Button
                          onClick={() => {
                            setEditingDomainId(null)
                            setIsModalOpen(true)
                          }}
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mt: 1, textTransform: 'none' }}
                        >
                          New domain
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Concepts Section */}
                  <div>
                    <button
                      onClick={() => setConceptsExpanded((prev) => !prev)}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Concepts
                      </Typography>
                      {conceptsExpanded ? (
                        <KeyboardArrowUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      )}
                    </button>

                    {conceptsExpanded && (
                      <div className="px-4 py-2">
                        {state.concepts.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No concepts yet.</p>
                            <p className="text-xs mt-1">Click &quot;New concept&quot; to create one.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {state.concepts.map((concept) => (
                              <ConceptCard
                                key={concept.id}
                                concept={concept}
                                isSelected={state.selectedConceptId === concept.id && !state.selectedInstanceId}
                                onEdit={(id) => {
                                  setEditingConceptId(id)
                                  setIsConceptModalOpen(true)
                                }}
                              />
                            ))}
                          </div>
                        )}

                        <Button
                          onClick={() => {
                            setEditingConceptId(null)
                            setIsConceptModalOpen(true)
                          }}
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mt: 1, textTransform: 'none' }}
                        >
                          New concept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Import / Export View */}
            {activeView === 'import-export' && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-gray-200">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Import / Export
                  </Typography>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <ImportExportSection />
                </div>
              </div>
            )}

            {/* Timeline View */}
            {activeView === 'timeline' && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Timeline
                  </Typography>
                  <Button
                    onClick={() => setIsEventModalOpen(true)}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    Add Event
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TimelinePanel />
                </div>
              </div>
            )}

            {/* Library View */}
            {activeView === 'library' && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-gray-200">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Library
                  </Typography>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-2">
                    <div className="p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                      <h3 className="font-medium">Follow</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DomainModal
        isOpen={isModalOpen}
        editingDomainId={editingDomainId}
        onClose={() => setIsModalOpen(false)}
      />

      {(state.selectedDomainId || state.selectedLabelDomainId) && (
        <LabelModal
          isOpen={isLabelModalOpen}
          domainId={state.selectedDomainId || state.selectedLabelDomainId}
          editingLabelId={editingLabelId}
          onClose={() => setIsLabelModalOpen(false)}
        />
      )}

      <ConceptModal
        isOpen={isConceptModalOpen}
        editingConceptId={editingConceptId}
        onClose={() => setIsConceptModalOpen(false)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </>
  )
}
