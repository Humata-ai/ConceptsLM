'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import SidebarPanel from './SidebarPanel'
import TimelinePanel from '../TimelinePanel'
import EventModal from '../EventModal'

export default function TimelineSidebarPanel() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  return (
    <>
      <SidebarPanel
        title="Timeline"
        headerAction={
          <Button
            onClick={() => setIsEventModalOpen(true)}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Add Event
          </Button>
        }
      >
        <TimelinePanel />
      </SidebarPanel>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </>
  )
}
