'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useState } from 'react'
import { getDeviceTier, type DeviceTier } from '@/lib/device-tier'
import { NetworkScene } from '@/components/three/NetworkScene'

export default function SceneCanvasInner({ onReady }: { onReady: () => void }) {
  const [tier, setTier] = useState<DeviceTier | null>(null)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setTier(getDeviceTier()))
    return () => window.cancelAnimationFrame(frame)
  }, [])
  useEffect(() => { if (tier === 'low') onReady() }, [onReady, tier])
  if (!tier) return null
  if (tier === 'low') return <div className="network-fallback" aria-hidden="true"><svg viewBox="0 0 800 600" preserveAspectRatio="none"><path d="M0 420 L160 290 L310 360 L470 165 L620 300 L800 115" /><path d="M0 115 L190 250 L330 175 L520 370 L680 245 L800 410" /></svg></div>
  return <Canvas aria-hidden="true" className="scene-canvas" dpr={tier === 'high' ? [1, 2] : 1} camera={{ position: [0, 0, 9], fov: 48 }} gl={{ antialias: true, alpha: true }} onCreated={() => onReady()}><ambientLight intensity={.4} /><pointLight position={[2, 3, 5]} intensity={.6} color="#3B5BFF" /><NetworkScene count={tier === 'high' ? 56 : 28} />{tier === 'high' ? <EffectComposer multisampling={0}><Bloom intensity={.4} luminanceThreshold={.4} luminanceSmoothing={.9} /><Vignette offset={.3} darkness={.4} /></EffectComposer> : <EffectComposer multisampling={0}><Bloom intensity={.4} luminanceThreshold={.4} luminanceSmoothing={.9} /></EffectComposer>}</Canvas>
}
