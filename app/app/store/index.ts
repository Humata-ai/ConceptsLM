/**
 * App Store
 * 
 * Central state management for the application.
 * Manages domains, concepts, instances, and UI selection state.
 */

// Context and hooks
export { AppStoreProvider, useAppStore, useQualityDomain } from './AppStoreContext'

// Types
export type { AppState, AppAction } from './types'

// Reducer
export { appReducer } from './reducer'

// Initial state
export { initialState } from './initialState'

// Action creators
export * as actions from './actions'

// Selectors
export * as selectors from './selectors'
