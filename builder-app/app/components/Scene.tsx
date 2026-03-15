'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import AllDomainsVisualization from './quality-domain/AllDomainsVisualization'

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 60], fov: 50 }}
        style={{ background: 'white' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <AllDomainsVisualization />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          enableZoom
          zoomToCursor
          enablePan
        />
      </Canvas>
    </div>
  )
}
