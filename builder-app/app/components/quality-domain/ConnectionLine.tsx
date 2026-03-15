import { Line } from '@react-three/drei'

interface ConnectionLineProps {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  opacity?: number
}

export default function ConnectionLine({
  start,
  end,
  color = 'blue',
  opacity = 0.5,
}: ConnectionLineProps) {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={1}
      opacity={opacity}
      transparent
    />
  )
}
