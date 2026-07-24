import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import { RotatingCube } from './RotatingCube'
import { Model } from './Model'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import type { AnimationClipInfo } from '../../types/animation'

interface SceneProps {
  modelUrl: string | null
  selectedClip: string | null
  isPlaying: boolean
  speed: number
  loop: boolean
  onModelError: (error: Error) => void
  onClipsLoaded: (clips: AnimationClipInfo[]) => void
}

export function Scene({
  modelUrl,
  selectedClip,
  isPlaying,
  speed,
  loop,
  onModelError,
  onClipsLoaded,
}: SceneProps) {
  return (
    <>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {modelUrl ? (
          <ModelErrorBoundary resetKey={modelUrl} onError={onModelError}>
            <Suspense fallback={null}>
              <Model
                url={modelUrl}
                selectedClip={selectedClip}
                isPlaying={isPlaying}
                speed={speed}
                loop={loop}
                onClipsLoaded={onClipsLoaded}
              />
            </Suspense>
          </ModelErrorBoundary>
        ) : (
          <RotatingCube />
        )}
        <OrbitControls />
      </Canvas>
      <Loader containerStyles={{ position: 'absolute', zIndex: 5 }} />
    </>
  )
}
