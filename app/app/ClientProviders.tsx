'use client'

import { AppStoreProvider } from './store'
import { ToastProvider } from './components/ToastProvider'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AppStoreProvider>
  )
}
