export interface QualityDimension {
  id: string
  name: string
  range: readonly [number, number]
}

export interface PropertyDimensionRange {
  dimensionId: string
  range: readonly [number, number]
}

export interface Property {
  id: string
  name: string
  domainId: string
  dimensions: PropertyDimensionRange[]
  createdAt: Date
}

export interface QualityDomain {
  id: string
  name: string
  dimensions: QualityDimension[]
  properties: Property[]
  createdAt: Date
}

export interface QualityDomainState {
  domains: QualityDomain[]
  selectedDomainId: string | null
}

export type QualityDomainAction =
  | { type: 'ADD_DOMAIN'; payload: QualityDomain }
  | { type: 'UPDATE_DOMAIN'; payload: QualityDomain }
  | { type: 'DELETE_DOMAIN'; payload: string }
  | { type: 'SELECT_DOMAIN'; payload: string | null }
  | { type: 'ADD_PROPERTY'; payload: { domainId: string; property: Property } }
  | { type: 'UPDATE_PROPERTY'; payload: { domainId: string; property: Property } }
  | { type: 'DELETE_PROPERTY'; payload: { domainId: string; propertyId: string } }
