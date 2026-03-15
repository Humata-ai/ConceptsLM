import { useMemo, memo, useEffect, useState, useRef } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Property, QualityDomain } from '../types'

interface PropertyVisualization3DProps {
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

function PropertyVisualization3DDebug({
  property,
  domain,
  index,
}: PropertyVisualization3DProps) {
  const renderCount = useRef(0)
  const [flash, setFlash] = useState(false)

  // Count renders and flash on re-render
  useEffect(() => {
    renderCount.current += 1
    console.log(`[PropertyViz3D] RENDER #${renderCount.current}`, {
      propertyId: property.id,
      propertyName: property.name,
      domainId: domain.id,
      domainName: domain.name,
      timestamp: new Date().toISOString(),
    })

    // Flash red border on re-render
    setFlash(true)
    const timer = setTimeout(() => setFlash(false), 200)
    return () => clearTimeout(timer)
  })

  // Map each domain dimension to property range (or full range if not specified)
  const ranges = useMemo(() => {
    console.log(`[PropertyViz3D] Computing ranges for ${property.name}`)
    return domain.dimensions.map((dim) => {
      const propDim = property.dimensions.find((d) => d.dimensionId === dim.id)
      const propRange = propDim?.range || dim.range
      const [dimMin, dimMax] = dim.range

      // Normalize to -4 to +4 space (sizeX/Y/Z = 8)
      const min = -4 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 8
      const max = -4 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 8

      return { min, max, center: (min + max) / 2, size: max - min }
    })
  }, [property.dimensions, domain.dimensions, property.name])

  // Get color for this property
  const color = PROPERTY_COLORS[index % PROPERTY_COLORS.length]
  const flashColor = flash ? '#ff0000' : color

  // Memoize geometry for edges
  const edgesGeometry = useMemo(() => {
    console.log(`[PropertyViz3D] Creating edges geometry for ${property.name}`)
    return new THREE.EdgesGeometry(
      new THREE.BoxGeometry(ranges[0].size, ranges[1].size, ranges[2].size)
    )
  }, [ranges[0].size, ranges[1].size, ranges[2].size, property.name])

  // Memoize position arrays to prevent re-renders
  const position = useMemo(
    () => [ranges[0].center, ranges[1].center, ranges[2].center] as const,
    [ranges[0].center, ranges[1].center, ranges[2].center]
  )

  const boxSize = useMemo(
    () => [ranges[0].size, ranges[1].size, ranges[2].size] as const,
    [ranges[0].size, ranges[1].size, ranges[2].size]
  )

  return (
    <group>
      {/* Transparent box */}
      <mesh position={position}>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Edges for clarity - flash red when re-rendering */}
      <lineSegments position={position} geometry={edgesGeometry}>
        <lineBasicMaterial color={flashColor} linewidth={flash ? 4 : 1} />
      </lineSegments>

      {/* Property label with render count */}
      <Text
        position={position}
        fontSize={0.6}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {property.name} (#{renderCount.current})
      </Text>
    </group>
  )
}

// Custom comparison function - only re-render if property ID or dimensions actually changed
const areEqual = (prevProps: PropertyVisualization3DProps, nextProps: PropertyVisualization3DProps) => {
  const equal =
    prevProps.property.id === nextProps.property.id &&
    prevProps.index === nextProps.index &&
    prevProps.domain.id === nextProps.domain.id &&
    JSON.stringify(prevProps.property.dimensions) === JSON.stringify(nextProps.property.dimensions) &&
    JSON.stringify(prevProps.domain.dimensions) === JSON.stringify(nextProps.domain.dimensions)

  if (!equal) {
    console.log('[PropertyViz3D] areEqual = FALSE', {
      propertyIdChanged: prevProps.property.id !== nextProps.property.id,
      indexChanged: prevProps.index !== nextProps.index,
      domainIdChanged: prevProps.domain.id !== nextProps.domain.id,
      propertyDimensionsChanged: JSON.stringify(prevProps.property.dimensions) !== JSON.stringify(nextProps.property.dimensions),
      domainDimensionsChanged: JSON.stringify(prevProps.domain.dimensions) !== JSON.stringify(nextProps.domain.dimensions),
    })
  }

  return equal
}

export default memo(PropertyVisualization3DDebug, areEqual)
