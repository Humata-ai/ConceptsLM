'use client';

import { useMemo } from 'react';
import { Vector3 } from 'three';
import { labFromCoordinates, isInGamut } from '../utils/colorConversion';

interface GamutBoundaryProps {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
}

export default function GamutBoundary({ xRange, yRange, zRange }: GamutBoundaryProps) {
  const positions = useMemo(() => {
    const boundaryPoints: Vector3[] = [];
    const samplingRate = 5;

    for (let l = yRange[0]; l <= yRange[1]; l += samplingRate) {
      for (let a = xRange[0]; a <= xRange[1]; a += samplingRate) {
        for (let b = zRange[0]; b <= zRange[1]; b += samplingRate) {
          const lab = labFromCoordinates(a, l, b);
          const isThisInGamut = isInGamut(lab);

          if (isThisInGamut) {
            const neighbors = [
              labFromCoordinates(a + samplingRate, l, b),
              labFromCoordinates(a - samplingRate, l, b),
              labFromCoordinates(a, l + samplingRate, b),
              labFromCoordinates(a, l - samplingRate, b),
              labFromCoordinates(a, l, b + samplingRate),
              labFromCoordinates(a, l, b - samplingRate),
            ];

            const hasOutOfGamutNeighbor = neighbors.some(n => !isInGamut(n));

            if (hasOutOfGamutNeighbor) {
              boundaryPoints.push(new Vector3(a, l, b));
            }
          }
        }
      }
    }

    console.log(`Generated ${boundaryPoints.length} gamut boundary points`);

    const arr = new Float32Array(boundaryPoints.length * 3);
    boundaryPoints.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });

    return arr;
  }, [xRange, yRange, zRange]);

  if (positions.length === 0) {
    return null;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}
