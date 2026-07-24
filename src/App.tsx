import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Scene } from './components/scene/Scene'
import { FileDropzone } from './components/upload/FileDropzone'
import { AnimationPanel } from './components/panel/AnimationPanel'
import { validateGlbFile } from './lib/validateGlbFile'
import type { AnimationClipInfo } from './types/animation'

const CodePanel = lazy(() =>
  import('./components/panel/CodePanel').then((m) => ({ default: m.CodePanel })),
)

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [clips, setClips] = useState<AnimationClipInfo[]>([])
  const [selectedClip, setSelectedClip] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [loop, setLoop] = useState(true)

  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl)
        // Cleared here (not in Model) so it still runs if the file is swapped mid-load.
        useGLTF.clear(modelUrl)
      }
    }
  }, [modelUrl])

  const resetAnimationState = () => {
    setClips([])
    setSelectedClip(null)
    setIsPlaying(true)
    setSpeed(1)
    setLoop(true)
  }

  const handleFileSelected = (file: File) => {
    const result = validateGlbFile(file)
    if (!result.valid) {
      setError(result.message)
      return
    }
    setError(null)
    resetAnimationState()
    setFileName(file.name)
    setModelUrl(URL.createObjectURL(file))
  }

  const handleModelError = () => {
    setError(
      `File "${fileName ?? 'ini'}" gagal dibuka — kemungkinan rusak atau bukan .glb yang valid. Coba export ulang dari software 3D Anda dan upload lagi.`,
    )
    setModelUrl(null)
    setFileName(null)
    resetAnimationState()
  }

  const handleReset = () => {
    setModelUrl(null)
    setFileName(null)
    setError(null)
    resetAnimationState()
  }

  const handleClipsLoaded = useCallback((loadedClips: AnimationClipInfo[]) => {
    setClips(loadedClips)
    setSelectedClip((current) => current ?? loadedClips[0]?.name ?? null)
  }, [])

  return (
    <div className="flex h-screen w-screen flex-col bg-neutral-950 text-neutral-100">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-4 py-3">
        <h1 className="text-lg font-semibold">GLB Animator</h1>
        {fileName && (
          <div className="flex min-w-0 items-center gap-3 text-sm text-neutral-400">
            <span className="max-w-[10rem] truncate sm:max-w-xs" title={fileName}>
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="flex-shrink-0 rounded border border-neutral-700 px-2 py-1 text-xs hover:border-neutral-500"
            >
              Ganti file
            </button>
          </div>
        )}
      </header>
      <main className="relative flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="relative z-0 min-h-[45vh] w-full flex-1 lg:min-h-0 lg:w-auto lg:min-w-0">
          <Scene
            modelUrl={modelUrl}
            selectedClip={selectedClip}
            isPlaying={isPlaying}
            speed={speed}
            loop={loop}
            onModelError={handleModelError}
            onClipsLoaded={handleClipsLoaded}
          />
          {!modelUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60 p-6">
              <div className="w-full max-w-md">
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold text-neutral-100">
                    Mulai dengan upload model 3D Anda
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    Preview model, cek animasinya, lalu generate kode React
                    Three Fiber siap pakai.
                  </p>
                </div>
                <FileDropzone onFileSelected={handleFileSelected} />
                {error && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-left text-sm text-red-300">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 8v5M12 16h.01" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {modelUrl && fileName && (
          <aside className="relative z-10 flex max-h-[45vh] w-full flex-shrink-0 flex-col gap-4 overflow-y-auto border-t border-neutral-800 bg-neutral-900/60 p-4 lg:max-h-none lg:w-96 lg:border-l lg:border-t-0">
            <AnimationPanel
              clips={clips}
              selectedClip={selectedClip}
              isPlaying={isPlaying}
              speed={speed}
              loop={loop}
              onSelectClip={setSelectedClip}
              onTogglePlay={() => setIsPlaying((playing) => !playing)}
              onSpeedChange={setSpeed}
              onLoopChange={setLoop}
            />
            <Suspense
              fallback={
                <p className="text-sm text-neutral-500">Memuat code generator…</p>
              }
            >
              <CodePanel
                fileName={fileName}
                clipName={selectedClip}
                autoplay={isPlaying}
                loop={loop}
              />
            </Suspense>
          </aside>
        )}
      </main>
    </div>
  )
}

export default App
