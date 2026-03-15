'use client'

import { memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import AllDomainsVisualization from './quality-domain/AllDomainsVisualization'

function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 60], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: 'white' }}
        frameloop="always"
        gl={{ logarithmicDepthBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <AllDomainsVisualization />
        <OrbitControls
          enableDamping={false}
          enableZoom
          zoomToCursor
          enablePan
          makeDefault
        />
      </Canvas>
    </div>
  )
}

// Memoize Scene to prevent re-renders when parent (HomeContent) re-renders
export default memo(Scene)
