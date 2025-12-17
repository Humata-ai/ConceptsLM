'use client';

import { Text } from '@react-three/drei';

interface AxisLabelsProps {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
}

export default function AxisLabels({ xRange, yRange, zRange }: AxisLabelsProps) {
  const offset = 15;
  const fontSize = 8;
  const tickFontSize = 4;

  return (
    <group>
      {/* X Axis - A* (Green-Red) */}
      <Text
        position={[xRange[1] + offset, 0, 0]}
        fontSize={fontSize}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
      >
        A* → Red
      </Text>
      <Text
        position={[xRange[0] - offset, 0, 0]}
        fontSize={fontSize}
        color="#44ff44"
        anchorX="center"
        anchorY="middle"
      >
        Green ← A*
      </Text>

      {/* A* tick marks */}
      <Text
        position={[0, -5, 0]}
        fontSize={tickFontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        A*=0
      </Text>
      <Text
        position={[xRange[1], -5, 0]}
        fontSize={tickFontSize}
        color="#ff8888"
        anchorX="center"
        anchorY="middle"
      >
        127
      </Text>
      <Text
        position={[xRange[0], -5, 0]}
        fontSize={tickFontSize}
        color="#88ff88"
        anchorX="center"
        anchorY="middle"
      >
        -128
      </Text>

      {/* Y Axis - L* (Lightness) */}
      <Text
        position={[0, yRange[1] + offset, 0]}
        fontSize={fontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        L* ↑ Light
      </Text>
      <Text
        position={[0, yRange[0] - offset, 0]}
        fontSize={fontSize}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        Dark ↓ L*
      </Text>

      {/* L* tick marks */}
      <Text
        position={[-10, yRange[1] / 2, 0]}
        fontSize={tickFontSize}
        color="#cccccc"
        anchorX="right"
        anchorY="middle"
      >
        L*=50
      </Text>
      <Text
        position={[-10, yRange[1], 0]}
        fontSize={tickFontSize}
        color="#ffffff"
        anchorX="right"
        anchorY="middle"
      >
        100
      </Text>
      <Text
        position={[-10, yRange[0], 0]}
        fontSize={tickFontSize}
        color="#888888"
        anchorX="right"
        anchorY="middle"
      >
        0
      </Text>

      {/* Z Axis - B* (Blue-Yellow) */}
      <Text
        position={[0, 0, zRange[1] + offset]}
        fontSize={fontSize}
        color="#ffff44"
        anchorX="center"
        anchorY="middle"
      >
        B* → Yellow
      </Text>
      <Text
        position={[0, 0, zRange[0] - offset]}
        fontSize={fontSize}
        color="#4444ff"
        anchorX="center"
        anchorY="middle"
      >
        Blue ← B*
      </Text>

      {/* B* tick marks */}
      <Text
        position={[0, -5, 0]}
        fontSize={tickFontSize}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        B*=0
      </Text>
      <Text
        position={[0, -5, zRange[1]]}
        fontSize={tickFontSize}
        color="#ffff88"
        anchorX="center"
        anchorY="middle"
      >
        127
      </Text>
      <Text
        position={[0, -5, zRange[0]]}
        fontSize={tickFontSize}
        color="#8888ff"
        anchorX="center"
        anchorY="middle"
      >
        -128
      </Text>
    </group>
  );
}
