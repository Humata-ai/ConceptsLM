'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { QualityDomain, QualityDomainState, QualityDomainAction } from '../types'

interface QualityDomainContextType {
  state: QualityDomainState
  dispatch: React.Dispatch<QualityDomainAction>
  addDomain: (domain: QualityDomain) => void
  updateDomain: (domain: QualityDomain) => void
  deleteDomain: (id: string) => void
  selectDomain: (id: string | null) => void
  openModal: (editingId?: string) => void
  closeModal: () => void
  getSelectedDomain: () => QualityDomain | null
}

const QualityDomainContext = createContext<QualityDomainContextType | undefined>(undefined)

const initialState: QualityDomainState = {
  domains: [],
  selectedDomainId: null,
  isModalOpen: false,
  editingDomainId: null,
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
    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        editingDomainId: action.payload || null,
      }
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        editingDomainId: null,
      }
    default:
      return state
  }
}

export function QualityDomainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(qualityDomainReducer, initialState)

  const addDomain = (domain: QualityDomain) => {
    dispatch({ type: 'ADD_DOMAIN', payload: domain })
  }

  const updateDomain = (domain: QualityDomain) => {
    dispatch({ type: 'UPDATE_DOMAIN', payload: domain })
  }

  const deleteDomain = (id: string) => {
    dispatch({ type: 'DELETE_DOMAIN', payload: id })
  }

  const selectDomain = (id: string | null) => {
    dispatch({ type: 'SELECT_DOMAIN', payload: id })
  }

  const openModal = (editingId?: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: editingId })
  }

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  const getSelectedDomain = () => {
    if (!state.selectedDomainId) return null
    return state.domains.find((d) => d.id === state.selectedDomainId) || null
  }

  const value: QualityDomainContextType = {
    state,
    dispatch,
    addDomain,
    updateDomain,
    deleteDomain,
    selectDomain,
    openModal,
    closeModal,
    getSelectedDomain,
  }

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
