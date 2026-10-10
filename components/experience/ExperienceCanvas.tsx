'use client'

/* eslint-disable react-hooks/immutability -- R3F's frame loop owns these mutable Three.js objects and shader uniforms. */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import { useEffect, useMemo, useRef, useSyncExternalStore, type RefObject } from 'react'
import * as THREE from 'three'
import Lenis from 'lenis'
import type { CapabilityLevel } from '@/lib/experience/capabilities'
import { pointerBus } from '@/lib/experience/PointerBus'
import { projectFocusBus } from '@/lib/experience/ProjectFocusBus'
import { scrollBus } from '@/lib/experience/ScrollBus'
import { getLenis, setLenis } from '@/lib/lenis'
import { projectSystems } from '@/lib/content'
import { createEngineeringGlass, createScreenRefractionMaterial } from './HeroMaterial'

const sections = ['home', 'work', 'about', 'capabilities', 'journey', 'contact'] as const

function FrameBridge() {
  const { setFrameloop, gl } = useThree()

  useEffect(() => {
    let lenis: Lenis | null = null
    const startLenis = () => {
      if (lenis) return
      lenis = new Lenis({ autoRaf: false, anchors: true, smoothWheel: true, lerp: 0.085 })
      setLenis(lenis)
      document.documentElement.classList.add('lenis', 'lenis-smooth')
    }
    const releaseLenis = () => {
      if (!lenis) return
      const current = lenis
      lenis = null
      setLenis(null)
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      current.destroy()
    }
    startLenis()

    const visibility = () => {
      if (document.hidden) {
        releaseLenis()
        setFrameloop('never')
      } else {
        startLenis()
        setFrameloop('always')
      }
    }
    const contextLost = () => {
      releaseLenis()
      window.dispatchEvent(new Event('portfolio:webgl-unavailable'))
    }
    document.addEventListener('visibilitychange', visibility)
    gl.domElement.addEventListener('webglcontextlost', contextLost)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      gl.domElement.removeEventListener('webglcontextlost', contextLost)
      releaseLenis()
    }
  }, [gl, setFrameloop])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * 1000
    getLenis()?.raf(time)
    pointerBus.update(delta)
    scrollBus.tick(delta)
  })

  return null
}

function createSystemLoop() {
  const shape = new THREE.Shape()
  shape.moveTo(-0.78, -0.55)
  shape.quadraticCurveTo(-0.93, -0.82, -0.64, -0.91)
  shape.quadraticCurveTo(0.35, -1.02, 0.76, -0.75)
  shape.quadraticCurveTo(0.98, -0.56, 0.87, -0.14)
  shape.lineTo(0.72, 0.56)
  shape.quadraticCurveTo(0.65, 0.89, 0.28, 0.87)
  shape.lineTo(-0.54, 0.8)
  shape.quadraticCurveTo(-0.88, 0.73, -0.84, 0.34)
  shape.closePath()

  const channel = new THREE.Path()
  channel.moveTo(-0.35, -0.3)
  channel.quadraticCurveTo(-0.45, 0.02, -0.31, 0.28)
  channel.lineTo(0.2, 0.33)
  channel.quadraticCurveTo(0.43, 0.34, 0.47, 0.08)
  channel.lineTo(0.48, -0.18)
  channel.quadraticCurveTo(0.46, -0.33, 0.21, -0.32)
  channel.closePath()
  shape.holes.push(channel)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.04,
    bevelThickness: 0.055,
    curveSegments: 24,
  })
  geometry.center()
  geometry.computeVertexNormals()
  return geometry
}

function HeroObject({ level, groupRef, refractionMaterial }: {
  level: CapabilityLevel
  groupRef: RefObject<THREE.Group | null>
  refractionMaterial: THREE.ShaderMaterial
}) {
  const group = groupRef
  const rimLight = useRef<THREE.PointLight>(null)
  const glass = useMemo(() => createEngineeringGlass(level), [level])
  const geometry = useMemo(() => createSystemLoop(), [])
  const lastAngle = useRef(0)
  const compact = level === 'low'

  useFrame((_, delta) => {
    if (!group.current) return
    const desktop = window.innerWidth > 900
    group.current.visible = desktop
    if (!desktop) return
    const scroll = scrollBus.getSnapshot()
    const pointer = pointerBus.getSnapshot()
    const focused = projectFocusBus.getSnapshot().id !== null
    const sectionIndex = sections.indexOf(scroll.section)
    const t = sectionIndex / (sections.length - 1)
    const targetX = THREE.MathUtils.lerp(1.1, -1.45, t)
    const targetY = THREE.MathUtils.lerp(0.45, -0.25, t)
    const targetScale = 0.94 * (focused ? 1.035 : 1)
    const smoothing = 1 - Math.exp(-delta * 2.2)

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 2.2, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 2.2, delta)
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, targetScale, smoothing)
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, targetScale, smoothing)
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, targetScale, smoothing)
    group.current.rotation.y += (0.055 + Math.min(Math.abs(scroll.velocity) / 12000, 0.07)) * delta
    if (focused) group.current.rotation.y += delta * 0.12
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.smoothY * 0.12, 1.6, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -pointer.smoothX * 0.11, 1.6, delta)

    const targetAngle = Math.atan2(pointer.smoothY + 0.15, pointer.smoothX + 0.2)
    const angleDelta = Math.atan2(Math.sin(targetAngle - lastAngle.current), Math.cos(targetAngle - lastAngle.current))
    lastAngle.current += angleDelta * (1 - Math.exp(-delta * 3.4))
    rimLight.current?.position.set(
      group.current.position.x + Math.cos(lastAngle.current) * 2.35,
      group.current.position.y + Math.sin(lastAngle.current) * 1.65,
      2.3,
    )

    const shader = glass.userData.shader as { uniforms: { uPointerDirection: { value: THREE.Vector3 } } } | undefined
    shader?.uniforms.uPointerDirection.value.set(pointer.smoothX, pointer.smoothY, 0.85).normalize()
    refractionMaterial.uniforms.uPointerDirection.value.set(pointer.smoothX, pointer.smoothY, 0.85).normalize()
  })

  return (
    <group ref={group} position={[1.1, 0.45, 0]} scale={0.94}>
      <mesh geometry={geometry} material={glass} castShadow={!compact} receiveShadow={!compact} />
      <mesh geometry={geometry} scale={1.008}>
        <primitive object={refractionMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.67, 0.83, 0.04]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#C6F36B" emissive="#C6F36B" emissiveIntensity={0.24} />
      </mesh>
      <pointLight ref={rimLight} color="#C6F36B" intensity={compact ? 1.8 : 2.8} distance={5.5} decay={2} />
    </group>
  )
}

function ProjectSystemVisual({ projectId }: { projectId: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, size } = useThree()
  const project = projectSystems.find(item => `project-${item.id}` === projectId)
  const positions = useMemo(() => {
    if (!project) return []
    return project.nodes.map((_, index) => {
      const columns = Math.min(4, project.nodes.length)
      const rows = Math.ceil(project.nodes.length / columns)
      const col = index % columns
      const row = Math.floor(index / columns)
      return new THREE.Vector3(
        (col / Math.max(columns - 1, 1) - 0.5) * 0.82,
        (0.5 - row / Math.max(rows - 1, 1)) * 0.58,
        (index % 2) * 0.035,
      )
    })
  }, [project])
  const { geometry, colors } = useMemo(() => {
    if (!project) return { geometry: new THREE.BufferGeometry(), colors: [] as THREE.Color[] }
    const indexById = new Map(project.nodes.map((node, index) => [node.id, index]))
    const vertices: number[] = []
    project.edges.forEach(edge => {
      const from = positions[indexById.get(edge.from) ?? -1]
      const to = positions[indexById.get(edge.to) ?? -1]
      if (from && to) vertices.push(from.x, from.y, from.z, to.x, to.y, to.z)
    })
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return {
      geometry: lineGeometry,
      colors: project.nodes.map(node => new THREE.Color(node.status === 'pending' ? '#9C9890' : '#78A4A3')),
    }
  }, [project, positions])
  const nodesRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    if (!nodesRef.current) return
    positions.forEach((position, index) => {
      dummy.position.copy(position)
      dummy.scale.setScalar(0.035)
      dummy.updateMatrix()
      nodesRef.current!.setMatrixAt(index, dummy.matrix)
      nodesRef.current!.setColorAt(index, colors[index])
    })
    nodesRef.current.instanceMatrix.needsUpdate = true
    if (nodesRef.current.instanceColor) nodesRef.current.instanceColor.needsUpdate = true
  }, [colors, dummy, positions])

  useFrame(() => {
    const rect = projectFocusBus.getSnapshot().rect
    const reveal = projectFocusBus.getSnapshot().progress
    if (!groupRef.current || !rect || !('fov' in camera)) return
    const perspectiveCamera = camera as THREE.PerspectiveCamera
    const distance = Math.max(0.1, perspectiveCamera.position.z + 0.65)
    const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov / 2)) * distance
    const worldWidth = worldHeight * (size.width / Math.max(size.height, 1))
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    groupRef.current.position.set(
      perspectiveCamera.position.x + (centerX / size.width - 0.5) * worldWidth,
      perspectiveCamera.position.y + (0.5 - centerY / size.height) * worldHeight,
      perspectiveCamera.position.z - distance,
    )
    groupRef.current.scale.set(
      (rect.width / size.width) * worldWidth * reveal,
      (rect.height / size.height) * worldHeight * reveal,
      1,
    )
  })

  useEffect(() => () => geometry.dispose(), [geometry])
  if (!project) return null

  return (
    <group ref={groupRef}>
    <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#A7C78D" transparent opacity={0.32} />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, project.nodes.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.32} metalness={0.24} transparent opacity={0.68} />
      </instancedMesh>
    </group>
  )
}

function ExperienceScene({ level }: { level: CapabilityLevel }) {
  const { viewport, size, camera } = useThree()
  const background = useMemo(() => new THREE.Color('#101315'), [])
  const heroRef = useRef<THREE.Group>(null)
  const refractionMaterial = useMemo(() => createScreenRefractionMaterial(), [])
  const fitScale = viewport.width < 4 ? 0.72 : Math.min(1, viewport.width / 7.5)
  const fboScale = level === 'high' ? 0.72 : level === 'medium' ? 0.48 : 0.24
  const backgroundTarget = useFBO(
    Math.max(128, Math.round(size.width * fboScale)),
    Math.max(128, Math.round(size.height * fboScale)),
    { depthBuffer: true, stencilBuffer: false, samples: 0 },
  )
  const drawingSize = useMemo(() => new THREE.Vector2(), [])
  const cameraAim = useMemo(() => new THREE.Vector3(), [])
  const focusedProject = useSyncExternalStore(
    projectFocusBus.subscribe,
    () => projectFocusBus.getSnapshot().id,
    () => null,
  )

  useFrame((_, delta) => {
    const sectionIndex = sections.indexOf(scrollBus.getSnapshot().section)
    const cameraStates = [
      [0, 0, 7.5], [0.16, 0.04, 7.2], [-0.12, 0.06, 7.8],
      [0.1, -0.04, 7.7], [-0.14, 0.02, 7.35], [0.12, 0.04, 7.3], [0, 0, 8.1],
    ]
    const target = cameraStates[sectionIndex] ?? cameraStates[0]
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target[0], 1.5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target[1], 1.5, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target[2], 1.5, delta)
    cameraAim.set(target[0] * 0.18, target[1] * 0.12, 0)
    camera.lookAt(cameraAim)
  })

  useFrame(({ gl, scene, camera, clock }) => {
    if (!heroRef.current) return
    const wasVisible = heroRef.current.visible
    heroRef.current.visible = false
    gl.setRenderTarget(backgroundTarget)
    gl.clear(true, true, true)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    heroRef.current.visible = wasVisible
    gl.clear(true, true, true)
    gl.getDrawingBufferSize(drawingSize)
    refractionMaterial.uniforms.uSceneTexture.value = backgroundTarget.texture
    refractionMaterial.uniforms.uResolution.value.copy(drawingSize)
    refractionMaterial.uniforms.uTime.value = clock.elapsedTime
    refractionMaterial.uniforms.uRefractionStrength.value = level === 'high' ? 1 : level === 'medium' ? 0.68 : 0.34
    refractionMaterial.uniforms.uCurlStrength.value = THREE.MathUtils.clamp(scrollBus.getSnapshot().velocity / 9000, -0.075, 0.075)
    gl.render(scene, camera)
  }, 1)

  useEffect(() => () => {
    refractionMaterial.dispose()
  }, [refractionMaterial])

  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={['#101315', 8, 17]} />
      <ambientLight intensity={0.62} color="#DCE8D6" />
      <hemisphereLight args={['#C7D7CA', '#202B28', 1.1]} />
      <directionalLight position={[-3.5, 4.5, 5]} color="#E8F3D7" intensity={2.1} />
      <directionalLight position={[4.5, -2, 2]} color="#718984" intensity={1.15} />
      <pointLight position={[-4, -3, -1]} color="#C6F36B" intensity={0.32} distance={8} />
      <group scale={fitScale}>
        <HeroObject level={level} groupRef={heroRef} refractionMaterial={refractionMaterial} />
      </group>
      {focusedProject && <ProjectSystemVisual projectId={focusedProject} />}
    </>
  )
}

export default function ExperienceCanvas({ level }: { level: CapabilityLevel }) {
  const dpr: [number, number] = level === 'high' ? [1, 1.55] : level === 'medium' ? [1, 1.25] : [1, 1.05]

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 7.5], fov: 36, near: 0.1, far: 35 }}
      gl={{ alpha: false, antialias: level !== 'low', powerPreference: 'high-performance' }}
      fallback={<div className="experience-fallback" />}
      aria-hidden="true"
    >
      <FrameBridge />
      <ExperienceScene level={level} />
    </Canvas>
  )
}
