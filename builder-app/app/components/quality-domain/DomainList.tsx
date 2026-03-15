'use client'

import { useQualityDomain } from './context/QualityDomainContext'
import DomainCard from './DomainCard'
import DomainModal from './DomainModal'

export default function DomainList() {
  const { state, openModal } = useQualityDomain()

  return (
    <>
      <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-h-[calc(100vh-2rem)] overflow-y-auto max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Quality Domains</h2>
          <button
            onClick={() => openModal()}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
          >
            + Add Domain
          </button>
        </div>

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
              />
            ))}
          </div>
        )}
      </div>

      <DomainModal />
    </>
  )
}
