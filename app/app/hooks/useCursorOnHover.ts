import { useCallback } from 'react'

/**
 * Hook for managing cursor style on hover
 * 
 * Provides consistent pointer cursor behavior for interactive elements
 * 
 * @returns Object with onPointerOver and onPointerOut handlers
 */
export function useCursorOnHover() {
  const handlePointerOver = useCallback(() => {
    if (document.body.style) {
      document.body.style.cursor = 'pointer'
    }
  }, [])

  const handlePointerOut = useCallback(() => {
    if (document.body.style) {
      document.body.style.cursor = 'default'
    }
  }, [])

  return {
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
  }
}
