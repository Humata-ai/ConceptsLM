'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import LABSpheres from './LABSpheres';
import AxisLabels from './AxisLabels';
import GamutBoundary from './GamutBoundary';
import { LABColor, RGBColor } from '../utils/colorConversion';

interface ConceptualSpaceProps {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  samplingRate: number;
  onColorSelect: (lab: LABColor, rgb: RGBColor) => void;
}

function Space({ xRange, yRange, zRange, samplingRate, onColorSelect }: ConceptualSpaceProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[100, 100, 100]} intensity={0.8} />
      <pointLight position={[-100, -50, -100]} intensity={0.3} />

      <LABSpheres
        xRange={xRange}
        yRange={yRange}
        zRange={zRange}
        samplingRate={samplingRate}
        onSphereClick={onColorSelect}
      />

      <AxisLabels
        xRange={xRange}
        yRange={yRange}
        zRange={zRange}
      />

      <GamutBoundary
        xRange={xRange}
        yRange={yRange}
        zRange={zRange}
      />

      <OrbitControls makeDefault />
    </>
  );
}

export default function ConceptualSpace({ xRange, yRange, zRange, samplingRate, onColorSelect }: ConceptualSpaceProps) {
  return (
    <Canvas camera={{ position: [150, 80, 150], fov: 50 }}>
      <Space
        xRange={xRange}
        yRange={yRange}
        zRange={zRange}
        samplingRate={samplingRate}
        onColorSelect={onColorSelect}
      />
    </Canvas>
  );
}
