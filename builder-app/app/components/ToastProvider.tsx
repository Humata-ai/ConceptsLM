'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

interface ToastContextType {
  showToast: (message: string, onUndo?: () => void) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [onUndo, setOnUndo] = useState<(() => void) | undefined>(undefined)

  const showToast = (msg: string, undoCallback?: () => void) => {
    setMessage(msg)
    setOnUndo(() => undoCallback)
    setOpen(true)
  }

  const hideToast = () => {
    setOpen(false)
  }

  const handleUndo = () => {
    if (onUndo) {
      onUndo()
    }
    hideToast()
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideToast}
          severity="info"
          sx={{ width: '100%' }}
          action={
            onUndo && (
              <Button color="inherit" size="small" onClick={handleUndo}>
                UNDO
              </Button>
            )
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
