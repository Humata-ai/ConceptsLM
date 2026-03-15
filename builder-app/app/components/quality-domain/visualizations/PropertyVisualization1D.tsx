import { useMemo, memo } from 'react'
import { Text } from '@react-three/drei'
import type { Property, QualityDomain } from '../types'

interface PropertyVisualization1DProps {
  property: Property
  domain: QualityDomain
  index: number
}

const PROPERTY_COLORS = [
  '#10b981', // Emerald green
  '#a855f7', // Purple
  '#3b82f6', // Blue
  '#f59e0b', // Amber/Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
]

function PropertyVisualization1D({
  property,
  domain,
  index,
}: PropertyVisualization1DProps) {
  const dimension = domain.dimensions[0]
  const [dimMin, dimMax] = dimension.range

  // Find the property range for this dimension
  const propertyDimension = property.dimensions.find(
    (d) => d.dimensionId === dimension.id
  )

  // Memoize position and size calculations
  const { centerPos, width, color } = useMemo(() => {
    if (!propertyDimension) {
      return { centerPos: 0, width: 0, color: '#000000' }
    }

    const [propMin, propMax] = propertyDimension.range

    // Normalize to -5 to +5 space (length = 10)
    const minPos = -5 + ((propMin - dimMin) / (dimMax - dimMin)) * 10
    const maxPos = -5 + ((propMax - dimMin) / (dimMax - dimMin)) * 10

    const centerPos = (minPos + maxPos) / 2
    const width = maxPos - minPos

    // Get color for this property
    const color = PROPERTY_COLORS[index % PROPERTY_COLORS.length]

    return { centerPos, width, color }
  }, [propertyDimension, dimMin, dimMax, index])

  if (!propertyDimension) {
    // Property doesn't define a range for this dimension - skip rendering
    return null
  }

  // Memoize position arrays to prevent re-renders
  const boxPosition = useMemo(() => [centerPos, 0.3, 0] as const, [centerPos])
  const labelPosition = useMemo(() => [centerPos, 0.6, 0] as const, [centerPos])
  const boxSize = useMemo(() => [width, 0.3, 0.1] as const, [width])

  return (
    <group>
      {/* Property box */}
      <mesh position={boxPosition}>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Property label */}
      <Text
        position={labelPosition}
        fontSize={0.5}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {property.name}
      </Text>
    </group>
  )
}

// Custom comparison function - only re-render if property ID or dimensions actually changed
const areEqual = (prevProps: PropertyVisualization1DProps, nextProps: PropertyVisualization1DProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.index === nextProps.index &&
    prevProps.domain.id === nextProps.domain.id &&
    JSON.stringify(prevProps.property.dimensions) === JSON.stringify(nextProps.property.dimensions) &&
    JSON.stringify(prevProps.domain.dimensions) === JSON.stringify(nextProps.domain.dimensions)
  )
}

export default memo(PropertyVisualization1D, areEqual)
