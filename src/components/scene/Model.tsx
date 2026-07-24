import { useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { LoopOnce, LoopRepeat, type Group } from 'three'
import type { AnimationClipInfo } from '../../types/animation'

interface ModelProps {
  url: string
  selectedClip: string | null
  isPlaying: boolean
  speed: number
  loop: boolean
  onClipsLoaded: (clips: AnimationClipInfo[]) => void
}

export function Model({
  url,
  selectedClip,
  isPlaying,
  speed,
  loop,
  onClipsLoaded,
}: ModelProps) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    onClipsLoaded(
      animations.map((clip) => ({ name: clip.name, duration: clip.duration })),
    )
  }, [animations, onClipsLoaded])

  useEffect(() => {
    if (selectedClip === null) return
    const action = actions[selectedClip]
    if (!action) return

    action.reset().fadeIn(0.2).play()
    return () => {
      action.fadeOut(0.2)
    }
  }, [actions, selectedClip])

  useEffect(() => {
    if (selectedClip === null) return
    const action = actions[selectedClip]
    if (action) action.paused = !isPlaying
  }, [isPlaying, actions, selectedClip])

  useEffect(() => {
    if (selectedClip === null) return
    const action = actions[selectedClip]
    if (action) action.timeScale = speed
  }, [speed, actions, selectedClip])

  useEffect(() => {
    if (selectedClip === null) return
    const action = actions[selectedClip]
    if (!action) return
    action.setLoop(loop ? LoopRepeat : LoopOnce, Infinity)
    action.clampWhenFinished = !loop
  }, [loop, actions, selectedClip])

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}
