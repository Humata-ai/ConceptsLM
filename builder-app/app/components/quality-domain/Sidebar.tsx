'use client'

import { useState } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import DomainCard from './DomainCard'
import DomainModal from './DomainModal'
import LabelCard from './LabelCard'
import LabelModal from './LabelModal'
import ConceptCard from './ConceptCard'
import ConceptModal from './ConceptModal'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'

export default function Sidebar() {
  const { state, getSelectedDomain } = useQualityDomain()
  const [isOpen, setIsOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null)
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null)
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false)
  const [editingConceptId, setEditingConceptId] = useState<string | null>(null)

  const selectedDomain = getSelectedDomain()

  return (
    <>
      <div className="fixed top-0 left-0 h-full z-30 flex">
        {/* Sidebar Panel (shown when expanded) */}
        {isOpen && (
          <div className="bg-white/95 backdrop-blur-sm shadow-xl h-full overflow-y-auto w-80 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Quality Domains</h2>
                <button
                  onClick={() => {
                    setEditingDomainId(null)
                    setIsModalOpen(true)
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
                >
                  Add Domain
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">

            {state.domains.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No domains yet.</p>
                <p className="text-xs mt-1">Click "+ Add Domain" to create one.</p>
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
                        {/* Label list or empty state */}
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

                        {/* Add Label button */}
                        <button
                          onClick={() => {
                            setEditingLabelId(null)
                            setIsLabelModalOpen(true)
                          }}
                          className="w-full px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-medium"
                        >
                          Add Label
                        </button>
                      </div>
                    )}
                  </DomainCard>
                ))}
              </div>
            )}

              {/* Concepts Section */}
              <div className="border-t border-gray-300 mt-4 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-purple-900">Concepts</h2>
                  <button
                    onClick={() => {
                      setEditingConceptId(null)
                      setIsConceptModalOpen(true)
                    }}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 font-medium"
                  >
                    Add Concept
                  </button>
                </div>

                {state.concepts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No concepts yet.</p>
                    <p className="text-xs mt-1">Click "+ Add Concept" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {state.concepts.map((concept) => (
                      <ConceptCard
                        key={concept.id}
                        concept={concept}
                        isSelected={state.selectedConceptId === concept.id}
                        onEdit={(id) => {
                          setEditingConceptId(id)
                          setIsConceptModalOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button (always visible) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-2 bg-blue-600 text-white rounded-r shadow hover:bg-blue-700 transition-colors self-start mt-4 flex items-center justify-center"
        >
          {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </button>
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
    </>
  )
}
