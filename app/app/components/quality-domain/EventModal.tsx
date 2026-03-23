'use client'

import { useState, useEffect } from 'react'
import Modal from '@/app/components/common/Modal'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
  const [subject, setSubject] = useState('')
  const [forceVector, setForceVector] = useState('')
  const [resultVector, setResultVector] = useState('')
  const [patient, setPatient] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSubject('')
      setForceVector('')
      setResultVector('')
      setPatient('')
    }
  }, [isOpen])

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
          <input
            id="event-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Subject"
          />
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
          <input
            id="event-patient"
            type="text"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Patient"
          />
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
