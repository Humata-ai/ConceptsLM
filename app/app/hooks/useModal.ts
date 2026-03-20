import { useCallback } from 'react'

/**
 * Hook for managing modal state and event handlers
 * 
 * Provides standardized handlers for backdrop clicks and keyboard events
 */
export function useModal(onClose: () => void) {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  return {
    handleBackdropClick,
    handleKeyDown,
  }
}
