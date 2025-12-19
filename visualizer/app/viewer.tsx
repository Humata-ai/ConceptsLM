'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ShapeSpace from './components/conceptual-spaces/shape-space';
import TasteSpace from './components/conceptual-spaces/taste-space';
import ColorSpace from './components/conceptual-spaces/color-space';
import { MeshData } from './utils/appleShape';
import { DictionaryItem } from './types/dictionary';

interface ViewerProps {
  dictionaryData: DictionaryItem;
  meshData: MeshData;
}

export default function Viewer({ dictionaryData, meshData }: ViewerProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [0, 12, 25],
          fov: 50,
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['white']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />

        <OrbitControls
          makeDefault
          target={[0, 3, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={60}
        />

        {/* Shape Space - Left */}
        <group position={[-12, 0, 0]} scale={0.5}>
          <ShapeSpace meshData={meshData} unit={dictionaryData.shape.unit} />
        </group>

        {/* Taste Space - Center */}
        <TasteSpace tasteValues={dictionaryData.taste} position={[0, 3, 0]} radius={3} />

        {/* Color Space - Right (scaled up) */}
        <group position={[12, 3, 0]} scale={5}>
          <ColorSpace highlightColor={dictionaryData.color} />
        </group>
      </Canvas>
    </div>
  );
}
