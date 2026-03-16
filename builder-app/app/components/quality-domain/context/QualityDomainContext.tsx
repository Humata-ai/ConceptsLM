'use client'

import { createContext, useContext, useReducer, useMemo, useCallback, useEffect, type ReactNode } from 'react'
import type { QualityDomain, QualityDomainState, QualityDomainAction, Property, Concept } from '../types'
import defaultDataJson from '../defaultData.json'
import { saveToLocalStorage } from '../localStorage'

interface QualityDomainContextType {
  state: QualityDomainState
  dispatch: React.Dispatch<QualityDomainAction>
  addDomain: (domain: QualityDomain) => void
  updateDomain: (domain: QualityDomain) => void
  deleteDomain: (id: string) => void
  selectDomain: (id: string | null) => void
  selectProperty: (domainId: string, propertyId: string) => void
  selectConcept: (conceptId: string | null) => void
  clearSelection: () => void
  getSelectedDomain: () => QualityDomain | null
  addProperty: (domainId: string, property: Property) => void
  updateProperty: (domainId: string, property: Property) => void
  deleteProperty: (domainId: string, propertyId: string) => void
  addConcept: (concept: Concept) => void
  updateConcept: (concept: Concept) => void
  deleteConcept: (id: string) => void
  getConceptProperties: (conceptId: string) => Property[]
}

const QualityDomainContext = createContext<QualityDomainContextType | undefined>(undefined)

// JSON-compatible types for loading from file
interface JsonDimension {
  id: string
  name: string
  range: number[]  // JSON arrays don't have tuple types
  type?: string
}

interface JsonPropertyDimensionRange {
  dimensionId: string
  range: number[]  // JSON arrays don't have tuple types
}

interface JsonProperty {
  id: string
  name: string
  description?: string
  domainId: string
  dimensions: JsonPropertyDimensionRange[]
  createdAt: string
}

interface JsonDomain {
  id: string
  name: string
  dimensions: JsonDimension[]
  properties: JsonProperty[]
  createdAt: string
}

interface JsonConcept {
  id: string
  name: string
  propertyRefs: { domainId: string; propertyId: string }[]
  createdAt: string
}

interface JsonState {
  domains: JsonDomain[]
  selectedDomainId: string | null
  concepts: JsonConcept[]
}

// Helper to convert JSON array to readonly tuple
function toRangeTuple(arr: number[]): readonly [number, number] {
  if (arr.length !== 2) {
    throw new Error(`Range must have exactly 2 elements, got ${arr.length}`)
  }
  return [arr[0], arr[1]] as const
}

// Load default data from JSON file (can be easily updated by pasting new JSON)
const jsonData: JsonState = defaultDataJson as JsonState

const initialState: QualityDomainState = {
  domains: jsonData.domains.map(domain => ({
    ...domain,
    dimensions: domain.dimensions.map(dim => ({
      ...dim,
      range: toRangeTuple(dim.range),
    })),
    properties: domain.properties.map(prop => ({
      ...prop,
      dimensions: prop.dimensions.map(d => ({
        ...d,
        range: toRangeTuple(d.range),
      })),
      createdAt: new Date(prop.createdAt),
    })),
    createdAt: new Date(domain.createdAt),
  })),
  selectedDomainId: null,
  selectedPropertyId: null,
  selectedPropertyDomainId: null,
  selectedConceptId: null,
  concepts: jsonData.concepts.map(concept => ({
    ...concept,
    propertyRefs: concept.propertyRefs,
    createdAt: new Date(concept.createdAt),
  })),
}

function qualityDomainReducer(
  state: QualityDomainState,
  action: QualityDomainAction
): QualityDomainState {
  switch (action.type) {
    case 'ADD_DOMAIN':
      return {
        ...state,
        domains: [...state.domains, action.payload],
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
        selectedPropertyId: null,
        selectedPropertyDomainId: null,
        selectedConceptId: null,
      }
    case 'SELECT_PROPERTY':
      if (!action.payload) {
        return {
          ...state,
          selectedPropertyId: null,
          selectedPropertyDomainId: null,
        }
      }
      return {
        ...state,
        selectedDomainId: null,
        selectedPropertyId: action.payload.propertyId,
        selectedPropertyDomainId: action.payload.domainId,
        selectedConceptId: null,
      }
    case 'SELECT_CONCEPT':
      return {
        ...state,
        selectedDomainId: null,
        selectedPropertyId: null,
        selectedPropertyDomainId: null,
        selectedConceptId: action.payload,
      }
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedDomainId: null,
        selectedPropertyId: null,
        selectedPropertyDomainId: null,
        selectedConceptId: null,
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
    case 'ADD_CONCEPT':
      return {
        ...state,
        concepts: [...state.concepts, action.payload],
      }
    case 'UPDATE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.map((concept) =>
          concept.id === action.payload.id ? action.payload : concept
        ),
      }
    case 'DELETE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.filter((concept) => concept.id !== action.payload),
      }
    case 'RESTORE_STATE':
      return {
        ...state,
        domains: action.payload.domains,
        concepts: action.payload.concepts,
        // Keep selection state cleared
        selectedDomainId: null,
        selectedPropertyId: null,
        selectedPropertyDomainId: null,
        selectedConceptId: null,
      }
    default:
      return state
  }
}

export function QualityDomainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(qualityDomainReducer, initialState)

  // Auto-save to localStorage on every state change
  useEffect(() => {
    saveToLocalStorage(state)
  }, [state])

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

  const selectProperty = useCallback((domainId: string, propertyId: string) => {
    dispatch({ type: 'SELECT_PROPERTY', payload: { domainId, propertyId } })
  }, [])

  const selectConcept = useCallback((conceptId: string | null) => {
    dispatch({ type: 'SELECT_CONCEPT', payload: conceptId })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
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

  const addConcept = useCallback((concept: Concept) => {
    dispatch({ type: 'ADD_CONCEPT', payload: concept })
  }, [])

  const updateConcept = useCallback((concept: Concept) => {
    dispatch({ type: 'UPDATE_CONCEPT', payload: concept })
  }, [])

  const deleteConcept = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CONCEPT', payload: id })
  }, [])

  const getConceptProperties = useCallback((conceptId: string): Property[] => {
    const concept = state.concepts.find((c) => c.id === conceptId)
    if (!concept) return []

    const properties: Property[] = []
    for (const ref of concept.propertyRefs) {
      const domain = state.domains.find((d) => d.id === ref.domainId)
      if (domain) {
        const property = domain.properties.find((p) => p.id === ref.propertyId)
        if (property) {
          properties.push(property)
        }
      }
    }
    return properties
  }, [state.concepts, state.domains])

  // Memoize context value to only recreate when state changes
  const value: QualityDomainContextType = useMemo(() => ({
    state,
    dispatch,
    addDomain,
    updateDomain,
    deleteDomain,
    selectDomain,
    selectProperty,
    selectConcept,
    clearSelection,
    getSelectedDomain,
    addProperty,
    updateProperty,
    deleteProperty,
    addConcept,
    updateConcept,
    deleteConcept,
    getConceptProperties,
  }), [state, addDomain, updateDomain, deleteDomain, selectDomain, selectProperty, selectConcept, clearSelection, getSelectedDomain, addProperty, updateProperty, deleteProperty, addConcept, updateConcept, deleteConcept, getConceptProperties])

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
