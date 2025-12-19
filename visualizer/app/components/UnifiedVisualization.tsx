'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { MeshData, createLineGeometry } from '../utils/appleShape';

interface UnifiedVisualizationProps {
  appleMesh: MeshData;
  tasteValues: {
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    umami: number;
  };
}

const TASTE_NAMES = ['sweet', 'sour', 'salty', 'bitter', 'umami'] as const;

// ShapeGraph mesh component (positioned on the left)
function ShapeGraphMesh({
  meshData,
  position,
}: {
  meshData: MeshData;
  position: [number, number, number];
}) {
  const meshGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(meshData.vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
    if (meshData.normals) {
      geometry.setAttribute('normal', new THREE.BufferAttribute(meshData.normals, 3));
    } else {
      geometry.computeVertexNormals();
    }
    geometry.computeBoundingBox();
    return geometry;
  }, [meshData]);

  const [xMax, yMax, zMax] = [10, 10, 10];

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * xMax;
      const y = (i / 10) * yMax;
      lines.push(createLineGeometry([x, 0, 0], [x, yMax, 0]));
      lines.push(createLineGeometry([0, y, 0], [xMax, y, 0]));
    }
    return lines;
  }, []);

  // Axes
  const axes = useMemo(() => {
    return [
      { geometry: createLineGeometry([0, 0, 0], [xMax, 0, 0]), color: '#888888', label: 'X', labelPos: [xMax + 0.5, 0, 0] as [number, number, number] },
      { geometry: createLineGeometry([0, 0, 0], [0, yMax, 0]), color: '#888888', label: 'Y', labelPos: [0, yMax + 0.5, 0] as [number, number, number] },
      { geometry: createLineGeometry([0, 0, 0], [0, 0, zMax]), color: '#888888', label: 'Z', labelPos: [0, 0, zMax + 0.5] as [number, number, number] },
    ];
  }, []);

  return (
    <group position={position}>
      {/* Grid */}
      {gridLines.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types
        <line key={`grid-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#cccccc" opacity={0.3} transparent />
        </line>
      ))}

      {/* Axes */}
      {axes.map((axis, i) => (
        <group key={`axis-${i}`}>
          {/* @ts-expect-error - React Three Fiber JSX types */}
          <line geometry={axis.geometry}>
            <lineBasicMaterial color={axis.color} linewidth={2} />
          </line>
          <Text position={axis.labelPos} fontSize={0.4} color={axis.color} anchorX="center" anchorY="middle">
            {axis.label}
          </Text>
        </group>
      ))}

      {/* Apple mesh */}
      <mesh geometry={meshGeometry} position={[xMax / 2, yMax / 2, zMax / 2]}>
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// TasteSpiderChart mesh component (positioned in the center)
function TasteSpiderChartMesh({
  tasteValues,
  position,
  radius = 2,
}: {
  tasteValues: { sweet: number; sour: number; salty: number; bitter: number; umami: number };
  position: [number, number, number];
  radius?: number;
}) {
  const getPosition = (index: number, distance: number): [number, number, number] => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance];
  };

  const axes = useMemo(() => {
    const axesGeometry: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BufferGeometry();
      const [x, y, z] = getPosition(i, radius);
      const positions = new Float32Array([0, 0, 0, x, y, z]);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      axesGeometry.push(geometry);
    }
    return axesGeometry;
  }, [radius]);

  const gridLines = useMemo(() => {
    const grids: THREE.BufferGeometry[] = [];
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (level / 5) * radius;
      const positions: number[] = [];
      for (let i = 0; i <= 5; i++) {
        const [x, y, z] = getPosition(i % 5, levelRadius);
        positions.push(x, y, z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      grids.push(geometry);
    }
    return grids;
  }, [radius]);

  const tastePentagon = useMemo(() => {
    const positions: number[] = [];
    const vertices: THREE.Vector3[] = [];

    TASTE_NAMES.forEach((taste, i) => {
      const value = tasteValues[taste];
      const [x, y, z] = getPosition(i, radius * value);
      vertices.push(new THREE.Vector3(x, 0.01, z));
    });

    const center = new THREE.Vector3(0, 0.01, 0);
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      positions.push(center.x, center.y, center.z);
      positions.push(vertices[i].x, vertices[i].y, vertices[i].z);
      positions.push(vertices[next].x, vertices[next].y, vertices[next].z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.computeVertexNormals();

    return { geometry, vertices };
  }, [tasteValues, radius]);

  const outlineGeometry = useMemo(() => {
    const positions: number[] = [];
    TASTE_NAMES.forEach((taste, i) => {
      const value = tasteValues[taste];
      const [x, y, z] = getPosition(i, radius * value);
      positions.push(x, 0.01, z);
    });
    const value = tasteValues[TASTE_NAMES[0]];
    const [x, y, z] = getPosition(0, radius * value);
    positions.push(x, 0.01, z);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return geometry;
  }, [tasteValues, radius]);

  return (
    <group position={position}>
      {/* Axes */}
      {axes.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types
        <line key={`axis-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#888888" opacity={0.4} transparent />
        </line>
      ))}

      {/* Grid */}
      {gridLines.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types
        <line key={`grid-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#888888" opacity={0.4} transparent />
        </line>
      ))}

      {/* Filled pentagon */}
      <mesh geometry={tastePentagon.geometry}>
        <meshBasicMaterial color="#4488ff" opacity={0.6} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Outline */}
      {/* @ts-expect-error - React Three Fiber JSX types */}
      <line geometry={outlineGeometry}>
        <lineBasicMaterial color="#2266cc" />
      </line>

      {/* Labels */}
      {TASTE_NAMES.map((taste, i) => {
        const [x, y, z] = getPosition(i, radius * 1.2);
        const displayName = taste.charAt(0).toUpperCase() + taste.slice(1);
        return (
          <Text
            key={`label-${i}`}
            position={[x, 0.1, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color="#333333"
            anchorX="center"
            anchorY="middle"
          >
            {displayName}
          </Text>
        );
      })}
    </group>
  );
}

// RGBColorCube mesh component (positioned on the right)
function RGBColorCubeMesh({ position }: { position: [number, number, number] }) {
  const texture = useMemo(() => {
    const size = 64;
    const data = new Uint8Array(size * size * size * 4);

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const index = (z * size * size + y * size + x) * 4;
          data[index] = (x / (size - 1)) * 255;
          data[index + 1] = (y / (size - 1)) * 255;
          data[index + 2] = (z / (size - 1)) * 255;
          data[index + 3] = 255;
        }
      }
    }

    const texture3D = new THREE.Data3DTexture(data, size, size, size);
    texture3D.format = THREE.RGBAFormat;
    texture3D.type = THREE.UnsignedByteType;
    texture3D.minFilter = THREE.LinearFilter;
    texture3D.magFilter = THREE.LinearFilter;
    texture3D.needsUpdate = true;

    return texture3D;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorTexture: { value: texture },
      },
      vertexShader: `
        varying vec3 vPosition;

        void main() {
          vPosition = position + 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform highp sampler3D colorTexture;
        varying vec3 vPosition;

        void main() {
          gl_FragColor = texture(colorTexture, vPosition);
        }
      `,
      side: THREE.FrontSide,
    });
  }, [texture]);

  return (
    <group position={position}>
      <mesh position={[0.5, 0.5, 0.5]} material={material}>
        <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
      </mesh>
    </group>
  );
}

export default function UnifiedVisualization({ appleMesh, tasteValues }: UnifiedVisualizationProps) {
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

        {/* Shape Graph - Left */}
        <group position={[-12, 0, 0]} scale={0.5}>
          <ShapeGraphMesh meshData={appleMesh} position={[0, 0, 0]} />
        </group>

        {/* Taste Spider Chart - Center */}
        <TasteSpiderChartMesh tasteValues={tasteValues} position={[0, 3, 0]} radius={3} />

        {/* RGB Color Cube - Right (scaled up) */}
        <group position={[12, 3, 0]} scale={5}>
          <RGBColorCubeMesh position={[0, 0, 0]} />
        </group>
      </Canvas>
    </div>
  );
}
