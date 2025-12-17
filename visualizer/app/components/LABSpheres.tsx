'use client';

import { useRef, useEffect, useMemo } from 'react';
import { InstancedMesh, Object3D, Color } from 'three';
import { LABColor, RGBColor, labFromCoordinates, labToRgb } from '../utils/colorConversion';

interface SphereData {
  position: [number, number, number];
  color: [number, number, number];
  lab: LABColor;
  rgb: RGBColor;
}

interface LABSpheresProps {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  samplingRate: number;
  onSphereClick?: (lab: LABColor, rgb: RGBColor) => void;
}

export default function LABSpheres({
  xRange,
  yRange,
  zRange,
  samplingRate,
  onSphereClick
}: LABSpheresProps) {
  const meshRef = useRef<InstancedMesh>(null);

  const sphereData = useMemo(() => {
    const spheres: SphereData[] = [];

    for (let y = yRange[0]; y <= yRange[1]; y += samplingRate) {
      for (let x = xRange[0]; x <= xRange[1]; x += samplingRate) {
        for (let z = zRange[0]; z <= zRange[1]; z += samplingRate) {
          const lab = labFromCoordinates(x, y, z);
          const rgb = labToRgb(lab);

          if (rgb) {
            spheres.push({
              position: [x, y, z],
              color: [rgb.r / 255, rgb.g / 255, rgb.b / 255],
              lab,
              rgb
            });
          }
        }
      }
    }

    console.log(`Generated ${spheres.length} spheres`);
    return spheres;
  }, [xRange, yRange, zRange, samplingRate]);

  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const tempObject = new Object3D();
    const tempColor = new Color();

    sphereData.forEach((sphere, i) => {
      tempObject.position.set(...sphere.position);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      tempColor.setRGB(...sphere.color);
      mesh.setColorAt(i, tempColor);
    });

    if (mesh.instanceMatrix) {
      mesh.instanceMatrix.needsUpdate = true;
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [sphereData]);

  const handleClick = (event: any) => {
    event.stopPropagation();
    const instanceId = event.instanceId;

    if (instanceId !== undefined && instanceId < sphereData.length) {
      const sphere = sphereData[instanceId];
      console.log('Clicked sphere:', sphere);
      onSphereClick?.(sphere.lab, sphere.rgb);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, sphereData.length]}
      onClick={handleClick}
    >
      <sphereGeometry args={[samplingRate * 0.3, 8, 8]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
