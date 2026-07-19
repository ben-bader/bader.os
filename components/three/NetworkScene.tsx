'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

function seeded(index: number, factor: number) { return ((Math.sin(index * 91.73 + factor) + 1) / 2) }

export function NetworkScene({ count = 54 }: { count?: number }) {
  const group = useRef<Group>(null)
  const { points, segments } = useMemo(() => {
    const nodes = Array.from({ length: count }, (_, index) => new THREE.Vector3((seeded(index, 1) - .5) * 10, (seeded(index, 2) - .5) * 7, (seeded(index, 3) - .5) * 3))
    const positions: number[] = []
    nodes.forEach((node, index) => nodes.slice(index + 1).forEach((other) => { if (node.distanceTo(other) < 2.6) positions.push(node.x, node.y, node.z, other.x, other.y, other.z) }))
    return { points: nodes, segments: new Float32Array(positions) }
  }, [count])

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * .035
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * .16) * .05
    group.current.position.y = Math.sin(state.clock.elapsedTime * .25) * .14
  })

  return <group ref={group}>
    <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[segments, 3]} /></bufferGeometry><lineBasicMaterial color="#3B5BFF" transparent opacity={.32} /></lineSegments>
    {points.map((point, index) => <mesh key={index} position={point}><sphereGeometry args={[.055, 8, 8]} /><meshBasicMaterial color="#3B5BFF" transparent opacity={.8} /></mesh>)}
  </group>
}
