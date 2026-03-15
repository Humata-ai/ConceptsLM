export interface QualityDimension {
  id: string
  name: string
  range: readonly [number, number]
}

export interface QualityDomain {
  id: string
  name: string
  dimensions: QualityDimension[]
  createdAt: Date
}

export interface QualityDomainState {
  domains: QualityDomain[]
  selectedDomainId: string | null
  isModalOpen: boolean
  editingDomainId: string | null
}

export type QualityDomainAction =
  | { type: 'ADD_DOMAIN'; payload: QualityDomain }
  | { type: 'UPDATE_DOMAIN'; payload: QualityDomain }
  | { type: 'DELETE_DOMAIN'; payload: string }
  | { type: 'SELECT_DOMAIN'; payload: string | null }
  | { type: 'OPEN_MODAL'; payload?: string }
  | { type: 'CLOSE_MODAL' }
