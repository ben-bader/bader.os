'use client'

import { useCallback, useState } from 'react'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { Preloader } from '@/components/layout/Preloader'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Timeline } from '@/components/sections/Timeline'
import { Contact } from '@/components/sections/Contact'
import { SceneCanvas } from '@/components/three/SceneCanvas'
import { profile } from '@/content/data'
import { PageTransition } from '@/components/layout/PageTransition'

export function HomeExperience() {
  const [sceneReady, setSceneReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const complete = useCallback(() => setRevealed(true), [])
  return <><div className="scene-layer"><SceneCanvas onReady={() => setSceneReady(true)} /></div><CustomCursor /><Preloader sceneReady={sceneReady} onComplete={complete} /><header className="site-header" aria-label="Site header"><a className="wordmark" href="#main" aria-label={`${profile.name}, home`}>{profile.name}</a><nav className="header-nav" aria-label="Primary navigation"><a href="#projects">Work</a><a href="#contact">Contact</a><ThemeToggle /></nav></header><PageTransition><main id="main"><Hero revealed={revealed} /><About /><Skills /><Projects /><Timeline /><Contact /></main></PageTransition></>
}
