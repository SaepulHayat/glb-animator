export interface CodeGenOptions {
  fileName: string
  clipName: string | null
  autoplay: boolean
  loop: boolean
}

function toComponentName(fileName: string): string {
  const base = fileName.replace(/\.[^/.]+$/, '')
  const words = base.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  const pascal = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
    // strip any leading digits so the result is always a valid identifier
    .replace(/^[0-9]+/, '')

  if (!pascal) return 'Model'
  return pascal.charAt(0).toUpperCase() + pascal.slice(1)
}

export function generateReactThreeFiberCode({
  fileName,
  clipName,
  autoplay,
  loop,
}: CodeGenOptions): string {
  const componentName = toComponentName(fileName)
  const glbPath = `/${fileName}`

  if (clipName === null) {
    return `// 1. Taruh file GLB ini di folder /public pada project React Anda.
// 2. Sesuaikan GLB_PATH di bawah kalau nama filenya beda.
// 3. Model ini tidak punya animation clip, jadi cukup ditampilkan statis.
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

const GLB_PATH = ${JSON.stringify(glbPath)}

function Model() {
  const { scene } = useGLTF(GLB_PATH)
  return <primitive object={scene} />
}

useGLTF.preload(GLB_PATH)

export default function ${componentName}Viewer() {
  return (
    <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}
`
  }

  return `// 1. Taruh file GLB ini di folder /public pada project React Anda.
// 2. Sesuaikan GLB_PATH dan DEFAULT_CLIP di bawah kalau nama file/clip beda.
import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce, LoopRepeat, type Group } from 'three'

const GLB_PATH = ${JSON.stringify(glbPath)}
const DEFAULT_CLIP = ${JSON.stringify(clipName)}
const AUTOPLAY = ${autoplay}
const LOOP = ${loop}

function Model() {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(GLB_PATH)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const action = actions[DEFAULT_CLIP]
    if (!action) return

    action.reset()
    action.setLoop(LOOP ? LoopRepeat : LoopOnce, Infinity)
    action.clampWhenFinished = !LOOP
    action.paused = !AUTOPLAY
    action.play()

    return () => {
      action.fadeOut(0.2)
    }
  }, [actions])

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(GLB_PATH)

export default function ${componentName}Viewer() {
  return (
    <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}
`
}
