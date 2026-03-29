'use client'

import { useState } from 'react'
import { useQualityDomain } from '@/app/store'
import DomainCard from '../../quality-domain/DomainCard'
import DomainModal from '../../quality-domain/DomainModal'
import LabelCard from '../../quality-domain/LabelCard'
import LabelModal from '../../quality-domain/LabelModal'
import Button from '@mui/material/Button'
import CollapsibleSection from './CollapsibleSection'

export default function QualityDomainsSection() {
  const { state } = useQualityDomain()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null)
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null)

  return (
    <>
      <CollapsibleSection title="Quality Domains" borderBottom>
        {state.scene.domains.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No domains yet.</p>
            <p className="text-xs mt-1">Click &quot;New domain&quot; to create one.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.scene.domains.map((domain) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                isSelected={state.scene.selectedDomainId === domain.id}
                onEdit={(id) => {
                  setEditingDomainId(id)
                  setIsModalOpen(true)
                }}
              >
                {(state.scene.selectedDomainId === domain.id || state.scene.selectedLabelDomainId === domain.id) && (
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
                              state.scene.selectedLabelId === label.id &&
                              state.scene.selectedLabelDomainId === domain.id
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
      </CollapsibleSection>

      <DomainModal
        isOpen={isModalOpen}
        editingDomainId={editingDomainId}
        onClose={() => setIsModalOpen(false)}
      />

      {(state.scene.selectedDomainId || state.scene.selectedLabelDomainId) && (
        <LabelModal
          isOpen={isLabelModalOpen}
          domainId={state.scene.selectedDomainId || state.scene.selectedLabelDomainId}
          editingLabelId={editingLabelId}
          onClose={() => setIsLabelModalOpen(false)}
        />
      )}
    </>
  )
}
