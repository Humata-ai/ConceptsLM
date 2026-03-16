import { useMemo, memo } from 'react'
import { Text } from '@react-three/drei'
import type { Property, QualityDomain } from '../types'
import { useQualityDomain } from '../context/QualityDomainContext'
import type { ThreeEvent } from '@react-three/fiber'

interface PropertyVisualization2DProps {
  property: Property
  domain: QualityDomain
  index: number
  isSelected?: boolean
}

const PROPERTY_COLORS = [
  '#10b981', // Emerald green
  '#a855f7', // Purple
  '#3b82f6', // Blue
  '#f59e0b', // Amber/Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
]

function PropertyVisualization2D({
  property,
  domain,
  index,
  isSelected = false,
}: PropertyVisualization2DProps) {
  const { selectProperty } = useQualityDomain()

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    selectProperty(domain.id, property.id)
  }

  const dimX = domain.dimensions[0]
  const dimY = domain.dimensions[1]
  const [dimMinX, dimMaxX] = dimX.range
  const [dimMinY, dimMaxY] = dimY.range

  // Find property ranges for each dimension (or use full range if not specified)
  const propertyDimX = property.dimensions.find((d) => d.dimensionId === dimX.id)
  const propertyDimY = property.dimensions.find((d) => d.dimensionId === dimY.id)

  // Memoize position and size calculations
  const { centerX, centerY, sizeX, sizeY, color } = useMemo(() => {
    const propRangeX = propertyDimX?.range || dimX.range
    const propRangeY = propertyDimY?.range || dimY.range

    // Normalize to -5 to +5 space (sizeX = 10, sizeY = 10)
    const minX = -5 + ((propRangeX[0] - dimMinX) / (dimMaxX - dimMinX)) * 10
    const maxX = -5 + ((propRangeX[1] - dimMinX) / (dimMaxX - dimMinX)) * 10
    const minY = -5 + ((propRangeY[0] - dimMinY) / (dimMaxY - dimMinY)) * 10
    const maxY = -5 + ((propRangeY[1] - dimMinY) / (dimMaxY - dimMinY)) * 10

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const sizeX = maxX - minX
    const sizeY = maxY - minY

    // Get color for this property - use blue if selected
    const color = isSelected ? '#3b82f6' : PROPERTY_COLORS[index % PROPERTY_COLORS.length]

    return { centerX, centerY, sizeX, sizeY, color }
  }, [
    propertyDimX,
    propertyDimY,
    dimX.range,
    dimY.range,
    dimMinX,
    dimMaxX,
    dimMinY,
    dimMaxY,
    index,
    isSelected,
  ])

  // Memoize position arrays to prevent re-renders
  const meshPosition = useMemo(() => [centerX, centerY, 0.1] as const, [centerX, centerY])
  const labelPosition = useMemo(() => [centerX, centerY, 0.3] as const, [centerX, centerY])
  const boxSize = useMemo(() => [sizeX, sizeY, 0.1] as const, [sizeX, sizeY])
  const rotation = useMemo(() => [0, 0, 0] as const, [])

  return (
    <group
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => { if (document.body.style) document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { if (document.body.style) document.body.style.cursor = 'default' }}
    >
      {/* Property rectangle */}
      <mesh position={meshPosition}>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Property label */}
      <Text
        position={labelPosition}
        fontSize={0.6}
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
const areEqual = (prevProps: PropertyVisualization2DProps, nextProps: PropertyVisualization2DProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.index === nextProps.index &&
    prevProps.domain.id === nextProps.domain.id &&
    JSON.stringify(prevProps.property.dimensions) === JSON.stringify(nextProps.property.dimensions) &&
    JSON.stringify(prevProps.domain.dimensions) === JSON.stringify(nextProps.domain.dimensions)
  )
}

export default memo(PropertyVisualization2D, areEqual)
