import { memo } from 'react'
import type { QualityDomain } from '../shared/types'
import Visualization1D from './visualizations/Visualization1D'
import Visualization2D from './visualizations/Visualization2D'
import Visualization3D from './visualizations/Visualization3D'

interface DomainVisualizationProps {
  domain: QualityDomain | null
}

function DomainVisualization({ domain }: DomainVisualizationProps) {
  if (!domain) {
    return null
  }

  const dimensionCount = domain.dimensions.length

  if (dimensionCount === 0) {
    return null
  }

  if (dimensionCount === 1) {
    return <Visualization1D domain={domain} />
  }

  if (dimensionCount === 2) {
    return <Visualization2D domain={domain} />
  }

  if (dimensionCount === 3) {
    return <Visualization3D domain={domain} />
  }

  // 4D+ is handled by TableView which is rendered outside the Canvas
  return null
}

export default memo(DomainVisualization)
