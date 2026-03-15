import { useMemo, type ReactElement } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { QualityDomain } from '../types'
import PropertyVisualization2D from './PropertyVisualization2D'

interface Visualization2DProps {
  domain: QualityDomain
}

export default function Visualization2D({ domain }: Visualization2DProps) {
  const dimX = domain.dimensions[0]
  const dimY = domain.dimensions[1]
  const [minX, maxX] = dimX.range
  const [minY, maxY] = dimY.range

  const sizeX = 10
  const sizeY = 10
  const gridDivisions = 10

  // Create grid lines
  const gridLines = useMemo(() => {
    const lines: ReactElement[] = []
    const stepX = sizeX / gridDivisions
    const stepY = sizeY / gridDivisions

    // Vertical lines
    for (let i = 0; i <= gridDivisions; i++) {
      const x = -sizeX / 2 + i * stepX
      lines.push(
        <mesh key={`v-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[0.02, 0.02, sizeY]} />
          <meshStandardMaterial color="#d1d5db" />
        </mesh>
      )
    }

    // Horizontal lines
    for (let i = 0; i <= gridDivisions; i++) {
      const z = -sizeY / 2 + i * stepY
      lines.push(
        <mesh key={`h-${i}`} position={[0, 0, z]}>
          <boxGeometry args={[sizeX, 0.02, 0.02]} />
          <meshStandardMaterial color="#d1d5db" />
        </mesh>
      )
    }

    return lines
  }, [sizeX, sizeY, gridDivisions])

  return (
    <group>
      {/* Grid plane (transparent) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[sizeX, sizeY]} />
        <meshStandardMaterial color="#f3f4f6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Grid lines */}
      <group rotation={[-Math.PI / 2, 0, 0]}>{gridLines}</group>

      {/* Boundary rectangle */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <lineSegments>
          <edgesGeometry
            args={[new THREE.PlaneGeometry(sizeX, sizeY)]}
          />
          <lineBasicMaterial color="#3b82f6" linewidth={2} />
        </lineSegments>
      </group>

      {/* X-axis label */}
      <Text
        position={[0, -1, -sizeY / 2 - 1]}
        fontSize={0.4}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {dimX.name}
      </Text>

      {/* X-axis min/max labels */}
      <Text
        position={[-sizeX / 2, -0.5, -sizeY / 2 - 0.5]}
        fontSize={0.3}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {minX.toString()}
      </Text>
      <Text
        position={[sizeX / 2, -0.5, -sizeY / 2 - 0.5]}
        fontSize={0.3}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {maxX.toString()}
      </Text>

      {/* Y-axis label */}
      <Text
        position={[-sizeX / 2 - 1, -1, 0]}
        fontSize={0.4}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        {dimY.name}
      </Text>

      {/* Y-axis min/max labels */}
      <Text
        position={[-sizeX / 2 - 0.5, -0.5, -sizeY / 2]}
        fontSize={0.3}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {minY.toString()}
      </Text>
      <Text
        position={[-sizeX / 2 - 0.5, -0.5, sizeY / 2]}
        fontSize={0.3}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {maxY.toString()}
      </Text>

      {/* Render properties */}
      {domain.properties.map((property, index) => (
        <PropertyVisualization2D
          key={property.id}
          property={property}
          domain={domain}
          index={index}
        />
      ))}
    </group>
  )
}
