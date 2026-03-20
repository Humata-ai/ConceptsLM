'use client'

import { useState } from 'react'
import { useQualityDomain } from '@/app/store'
import LabelCard from './LabelCard'
import LabelModal from './LabelModal'
import Button from '@mui/material/Button'

export default function LabelList() {
  const { state, getSelectedDomain } = useQualityDomain()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null)

  const selectedDomain = getSelectedDomain()

  if (!selectedDomain) {
    return null
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-h-[calc(100vh-2rem)] overflow-y-auto max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Labels</h2>
        </div>

        <div className="text-xs text-gray-600 mb-3 px-1">
          Domain: <span className="font-medium">{selectedDomain.name}</span>
        </div>

        {selectedDomain.labels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No labels yet.</p>
            <p className="text-xs mt-1">Click "+ Add Label" to create one.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDomain.labels.map((label) => (
              <LabelCard
                key={label.id}
                label={label}
                domain={selectedDomain}
                isSelected={
                  state.selectedLabelId === label.id &&
                  state.selectedLabelDomainId === selectedDomain.id
                }
                onEdit={(id) => {
                  setEditingLabelId(id)
                  setIsModalOpen(true)
                }}
              />
            ))}
          </div>
        )}

        {/* Add Label button */}
        <Button
          onClick={() => {
            setEditingLabelId(null)
            setIsModalOpen(true)
          }}
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 1, textTransform: 'none' }}
        >
          Add Label
        </Button>
      </div>

      <LabelModal
        isOpen={isModalOpen}
        domainId={selectedDomain.id}
        editingLabelId={editingLabelId}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
