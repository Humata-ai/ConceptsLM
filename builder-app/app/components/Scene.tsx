'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useQualityDomain } from './quality-domain/context/QualityDomainContext'
import DomainVisualization from './quality-domain/DomainVisualization'

export default function Scene() {
  const { getSelectedDomain } = useQualityDomain()
  const selectedDomain = getSelectedDomain()

  // Adjust camera position based on visualization type
  const getCameraPosition = (): [number, number, number] => {
    if (!selectedDomain) return [0, 0, 5]
    const dimCount = selectedDomain.dimensions.length
    if (dimCount === 1) return [0, 2, 10]
    if (dimCount === 2) return [0, 5, 10]
    if (dimCount === 3) return [10, 10, 10]
    return [0, 0, 5]
  }

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: getCameraPosition(), fov: 75 }}
        style={{ background: 'white' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <DomainVisualization domain={selectedDomain} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
