'use client'

import { useEffect, useRef } from 'react'
import { useQualityDomain } from '@/app/store'
import { useToast } from '../ToastProvider'
import { loadFromLocalStorage, clearLocalStorage } from './localStorage'

export function StateRestoration() {
  const { dispatch } = useQualityDomain()
  const { showToast } = useToast()
  const hasCheckedRef = useRef(false)

  // Check localStorage on mount
  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true

    const savedState = loadFromLocalStorage()

    if (savedState) {
      // Restore state
      dispatch({ type: 'RESTORE_STATE', payload: savedState })

      // Show toast with undo button
      showToast('Loaded state from previous session', () => {
        // Undo callback: clear localStorage and restore default state
        clearLocalStorage()

        // Reload the page to get default state
        window.location.reload()
      })
    }
  }, [dispatch, showToast])

  return null // This component doesn't render anything
}
