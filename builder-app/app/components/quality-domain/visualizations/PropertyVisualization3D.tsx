import { useMemo, memo, useRef, useLayoutEffect } from 'react'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { Property, QualityDomain } from '../types'
import { useQualityDomain } from '../context/QualityDomainContext'
import type { ThreeEvent } from '@react-three/fiber'

interface PropertyVisualization3DProps {
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

function PropertyVisualization3D({
  property,
  domain,
  index,
  isSelected = false,
}: PropertyVisualization3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { selectProperty } = useQualityDomain()

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    selectProperty(domain.id, property.id)
  }

  // Map each domain dimension to property range (or full range if not specified)
  const ranges = useMemo(() => {
    return domain.dimensions.map((dim) => {
      const propDim = property.dimensions.find((d) => d.dimensionId === dim.id)
      const propRange = propDim?.range || dim.range
      const [dimMin, dimMax] = dim.range

      // Normalize to -4 to +4 space (sizeX/Y/Z = 8)
      const min = -4 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 8
      const max = -4 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 8

      return { min, max, center: (min + max) / 2, size: max - min }
    })
  }, [property.dimensions, domain.dimensions])

  // Get color for this property - use blue if selected
  const color = isSelected ? '#3b82f6' : PROPERTY_COLORS[index % PROPERTY_COLORS.length]

  // Memoize position
  const position = useMemo(
    () => new THREE.Vector3(ranges[0].center, ranges[1].center, ranges[2].center),
    [ranges[0].center, ranges[1].center, ranges[2].center]
  )

  // Create Three.js objects imperatively - only once on mount or when dimensions change
  useLayoutEffect(() => {
    if (!groupRef.current) return

    const group = groupRef.current

    // Clear existing children to avoid duplicates
    while (group.children.length > 0) {
      const child = group.children[0]
      group.remove(child)
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    }

    // Create only edges/wireframe - no filled box to avoid any transparency/z-fighting issues
    const boxGeometry = new THREE.BoxGeometry(ranges[0].size, ranges[1].size, ranges[2].size)

    // Create bold edges to clearly show the property boundaries
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry)
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 3,
      opacity: 1
    })
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
    edges.position.copy(position)
    group.add(edges)

    // Cleanup on unmount
    return () => {
      boxGeometry.dispose()
      edgesGeometry.dispose()
      edgesMaterial.dispose()
    }
  }, [ranges, color, position])

  // Position label above the box to avoid occlusion by edges
  const labelPosition = useMemo(
    () => [position.x, position.y + ranges[1].size / 2 + 1.5, position.z] as const,
    [position.x, position.y, position.z, ranges]
  )

  return (
    <>
      {/* Group for imperative edge creation */}
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => { if (document.body.style) document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { if (document.body.style) document.body.style.cursor = 'default' }}
      />

      {/* Billboard group that always faces the camera - positioned above the box */}
      <Billboard position={labelPosition}>
        {/* Background rectangle for better visibility */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[property.name.length * 0.8, 1.8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.9} transparent={false} />
        </mesh>

        {/* Property label */}
        <Text
          position={[0, 0, 0]}
          fontSize={1.5}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000000"
          fillOpacity={1}
        >
          {property.name}
        </Text>
      </Billboard>
    </>
  )
}

// Custom comparison function - only re-render if property ID or dimensions actually changed
const areEqual = (prevProps: PropertyVisualization3DProps, nextProps: PropertyVisualization3DProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.index === nextProps.index &&
    prevProps.domain.id === nextProps.domain.id &&
    JSON.stringify(prevProps.property.dimensions) === JSON.stringify(nextProps.property.dimensions) &&
    JSON.stringify(prevProps.domain.dimensions) === JSON.stringify(nextProps.domain.dimensions)
  )
}

export default memo(PropertyVisualization3D, areEqual)
