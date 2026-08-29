'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Floating node network ── */
function NodeNetwork() {
  const groupRef  = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  // Create nodes deterministically to avoid render-time randomness / pure-function violations.
  const { positions, connections } = useMemo(() => {
    const count = 60
    const pos: THREE.Vector3[] = []

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 2 + ((i * 13) % 12) * 0.45
      pos.push(new THREE.Vector3(
        Math.sin(angle * 1.9 + i) * radius,
        Math.cos(angle * 1.3 + i * 0.7) * (2.5 + (i % 5) * 0.5),
        Math.sin(angle * 0.9 + i * 1.4) * 2.5,
      ))
    }

    const edges: [number, number][] = []
    const threshold = 3.5
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (pos[i].distanceTo(pos[j]) < threshold) edges.push([i, j])
      }
    }
    return { positions: pos, connections: edges }
  }, [])

  // Build line geometry
  const lineGeo = useMemo(() => {
    const pts: number[] = []
    connections.forEach(([i, j]) => {
      pts.push(positions[i].x, positions[i].y, positions[i].z)
      pts.push(positions[j].x, positions[j].y, positions[j].z)
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [connections, positions])

  // Node points geo
  const pointGeo = useMemo(() => {
    const pts: number[] = []
    positions.forEach(p => pts.push(p.x, p.y, p.z))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y  = t * 0.012
    groupRef.current.rotation.x  = Math.sin(t * 0.008) * 0.08
    groupRef.current.position.x += (mouse.x * 0.8 - groupRef.current.position.x) * 0.015
    groupRef.current.position.y += (mouse.y * 0.5 - groupRef.current.position.y) * 0.015
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#63b3ed" transparent opacity={0.08} />
      </lineSegments>

      {/* Nodes */}
      <points geometry={pointGeo}>
        <pointsMaterial
          color="#63b3ed"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>

      {/* Highlighted core nodes */}
      {positions.slice(0, 8).map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04 + (i % 3) * 0.02, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#63b3ed' : '#9f7aea'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Ambient particles ── */
function Particles() {
  const ref = useRef<THREE.Points>(null)

  const geo = useMemo(() => {
    const count = 400
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const n = i + 1
      pos[i * 3] = ((n * 17.37) % 24) - 12
      pos[i * 3 + 1] = ((n * 11.81) % 16) - 8
      pos[i * 3 + 2] = ((n * 7.23) % 8) - 4
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.006
    }
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#9f7aea" size={0.02} sizeAttenuation transparent opacity={0.35} />
    </points>
  )
}

export default function SceneCore() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]}   color="#63b3ed" intensity={1.5} distance={12} />
        <pointLight position={[-4, -3, -2]} color="#9f7aea" intensity={1.2} distance={10} />
        <NodeNetwork />
        <Particles />
      </Suspense>
    </Canvas>
  )
}
