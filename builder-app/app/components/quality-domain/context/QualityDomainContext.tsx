'use client'

import { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from 'react'
import type { QualityDomain, QualityDomainState, QualityDomainAction, Property } from '../types'
import defaultDataJson from '../defaultData.json'

interface QualityDomainContextType {
  state: QualityDomainState
  dispatch: React.Dispatch<QualityDomainAction>
  addDomain: (domain: QualityDomain) => void
  updateDomain: (domain: QualityDomain) => void
  deleteDomain: (id: string) => void
  selectDomain: (id: string | null) => void
  getSelectedDomain: () => QualityDomain | null
  addProperty: (domainId: string, property: Property) => void
  updateProperty: (domainId: string, property: Property) => void
  deleteProperty: (domainId: string, propertyId: string) => void
}

const QualityDomainContext = createContext<QualityDomainContextType | undefined>(undefined)

// Load default data from JSON file (can be easily updated by pasting new JSON)
const initialState: QualityDomainState = defaultDataJson as QualityDomainState

function qualityDomainReducer(
  state: QualityDomainState,
  action: QualityDomainAction
): QualityDomainState {
  switch (action.type) {
    case 'ADD_DOMAIN':
      return {
        ...state,
        domains: [...state.domains, action.payload],
        selectedDomainId: action.payload.id,
      }
    case 'UPDATE_DOMAIN':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.id ? action.payload : domain
        ),
      }
    case 'DELETE_DOMAIN':
      return {
        ...state,
        domains: state.domains.filter((domain) => domain.id !== action.payload),
        selectedDomainId:
          state.selectedDomainId === action.payload ? null : state.selectedDomainId,
      }
    case 'SELECT_DOMAIN':
      return {
        ...state,
        selectedDomainId: action.payload,
      }
    case 'ADD_PROPERTY':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.domainId
            ? { ...domain, properties: [...domain.properties, action.payload.property] }
            : domain
        ),
      }
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.domainId
            ? {
                ...domain,
                properties: domain.properties.map((prop) =>
                  prop.id === action.payload.property.id ? action.payload.property : prop
                ),
              }
            : domain
        ),
      }
    case 'DELETE_PROPERTY':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.domainId
            ? {
                ...domain,
                properties: domain.properties.filter(
                  (prop) => prop.id !== action.payload.propertyId
                ),
              }
            : domain
        ),
      }
    default:
      return state
  }
}

export function QualityDomainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(qualityDomainReducer, initialState)

  // Memoize helper functions to prevent recreation on every render
  const addDomain = useCallback((domain: QualityDomain) => {
    dispatch({ type: 'ADD_DOMAIN', payload: domain })
  }, [])

  const updateDomain = useCallback((domain: QualityDomain) => {
    dispatch({ type: 'UPDATE_DOMAIN', payload: domain })
  }, [])

  const deleteDomain = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOMAIN', payload: id })
  }, [])

  const selectDomain = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_DOMAIN', payload: id })
  }, [])

  const getSelectedDomain = useCallback(() => {
    if (!state.selectedDomainId) return null
    return state.domains.find((d) => d.id === state.selectedDomainId) || null
  }, [state.selectedDomainId, state.domains])

  const addProperty = useCallback((domainId: string, property: Property) => {
    dispatch({ type: 'ADD_PROPERTY', payload: { domainId, property } })
  }, [])

  const updateProperty = useCallback((domainId: string, property: Property) => {
    dispatch({ type: 'UPDATE_PROPERTY', payload: { domainId, property } })
  }, [])

  const deleteProperty = useCallback((domainId: string, propertyId: string) => {
    dispatch({ type: 'DELETE_PROPERTY', payload: { domainId, propertyId } })
  }, [])

  // Memoize context value to only recreate when state changes
  const value: QualityDomainContextType = useMemo(() => ({
    state,
    dispatch,
    addDomain,
    updateDomain,
    deleteDomain,
    selectDomain,
    getSelectedDomain,
    addProperty,
    updateProperty,
    deleteProperty,
  }), [state, addDomain, updateDomain, deleteDomain, selectDomain, getSelectedDomain, addProperty, updateProperty, deleteProperty])

  return (
    <QualityDomainContext.Provider value={value}>
      {children}
    </QualityDomainContext.Provider>
  )
}

export function useQualityDomain() {
  const context = useContext(QualityDomainContext)
  if (context === undefined) {
    throw new Error('useQualityDomain must be used within a QualityDomainProvider')
  }
  return context
}
