'use client'

import dynamic from 'next/dynamic'

const SceneCanvasInner = dynamic(() => import('@/components/three/SceneCanvasInner'), { ssr: false })
export function SceneCanvas({ onReady }: { onReady: () => void }) { return <SceneCanvasInner onReady={onReady} /> }
