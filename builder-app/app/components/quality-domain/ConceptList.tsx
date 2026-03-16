'use client'

import { useState } from 'react'
import { useQualityDomain } from './context/QualityDomainContext'
import ConceptCard from './ConceptCard'
import ConceptModal from './ConceptModal'

export default function ConceptList() {
  const { state } = useQualityDomain()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConceptId, setEditingConceptId] = useState<string | null>(null)

  return (
    <>
      <div className="absolute bottom-4 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-h-[calc(50vh-2rem)] overflow-y-auto max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-purple-900">Concepts</h2>
          <button
            onClick={() => {
              setEditingConceptId(null)
              setIsModalOpen(true)
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
                  setIsModalOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ConceptModal
        isOpen={isModalOpen}
        editingConceptId={editingConceptId}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
