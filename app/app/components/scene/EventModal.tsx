'use client'

import { useState, useEffect } from 'react'
import { useQualityDomain } from '@/app/store'
import Modal from '@/app/components/common/Modal'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
  const { state } = useQualityDomain()
  const [subjectInstanceId, setSubjectInstanceId] = useState('')
  const [forceVector, setForceVector] = useState('')
  const [resultVector, setResultVector] = useState('')
  const [patientInstanceId, setPatientInstanceId] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSubjectInstanceId('')
      setForceVector('')
      setResultVector('')
      setPatientInstanceId('')
    }
  }, [isOpen])

  // Group instances by their parent concept for the dropdown
  const instancesByConcept = state.scene.concepts.map((concept) => ({
    concept,
    instances: state.scene.instances.filter((i) => i.conceptId === concept.id),
  })).filter((group) => group.instances.length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No-op for now
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Event"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="event-subject" className="block text-sm font-medium mb-1">
            Subject
          </label>
          {instancesByConcept.length === 0 ? (
            <div className="text-xs text-gray-500 italic border border-gray-200 rounded p-3">
              No concept instances available. Create instances from the Data tab first.
            </div>
          ) : (
            <select
              id="event-subject"
              value={subjectInstanceId}
              onChange={(e) => setSubjectInstanceId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select a concept instance --</option>
              {instancesByConcept.map(({ concept, instances }) => (
                <optgroup key={concept.id} label={concept.name}>
                  {instances.map((instance) => (
                    <option key={instance.id} value={instance.id}>
                      {instance.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="event-force-vector" className="block text-sm font-medium mb-1">
            Force Vector
          </label>
          <input
            id="event-force-vector"
            type="text"
            value={forceVector}
            onChange={(e) => setForceVector(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Force Vector"
          />
        </div>

        <div>
          <label htmlFor="event-result-vector" className="block text-sm font-medium mb-1">
            Result Vector
          </label>
          <input
            id="event-result-vector"
            type="text"
            value={resultVector}
            onChange={(e) => setResultVector(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Result Vector"
          />
        </div>

        <div>
          <label htmlFor="event-patient" className="block text-sm font-medium mb-1">
            Patient
          </label>
          {instancesByConcept.length === 0 ? (
            <div className="text-xs text-gray-500 italic border border-gray-200 rounded p-3">
              No concept instances available. Create instances from the Data tab first.
            </div>
          ) : (
            <select
              id="event-patient"
              value={patientInstanceId}
              onChange={(e) => setPatientInstanceId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select a concept instance --</option>
              {instancesByConcept.map(({ concept, instances }) => (
                <optgroup key={concept.id} label={concept.name}>
                  {instances.map((instance) => (
                    <option key={instance.id} value={instance.id}>
                      {instance.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>
      </form>
    </Modal>
  )
}
