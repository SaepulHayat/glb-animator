import type { AnimationClipInfo } from '../../types/animation'

interface AnimationPanelProps {
  clips: AnimationClipInfo[]
  selectedClip: string | null
  isPlaying: boolean
  speed: number
  loop: boolean
  onSelectClip: (name: string) => void
  onTogglePlay: () => void
  onSpeedChange: (speed: number) => void
  onLoopChange: (loop: boolean) => void
}

export function AnimationPanel({
  clips,
  selectedClip,
  isPlaying,
  speed,
  loop,
  onSelectClip,
  onTogglePlay,
  onSpeedChange,
  onLoopChange,
}: AnimationPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-200">
          Animation Clips
        </h2>
        {clips.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Model ini tidak punya animation clip. Model tetap bisa dilihat di
            preview 3D, atau upload file lain yang punya animasi.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {clips.map((clip, index) => (
              <li key={`${clip.name}-${index}`}>
                <button
                  type="button"
                  onClick={() => onSelectClip(clip.name)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors ${
                    clip.name === selectedClip
                      ? 'bg-purple-400/20 text-purple-200'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span className="truncate">{clip.name || '(Tanpa nama)'}</span>
                  <span className="ml-2 shrink-0 text-xs text-neutral-500">
                    {clip.duration.toFixed(1)}s
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {clips.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-neutral-800 pt-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">
              Clip aktif
            </label>
            <select
              value={selectedClip ?? ''}
              onChange={(e) => onSelectClip(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-200"
            >
              {clips.map((clip, index) => (
                <option key={`${clip.name}-${index}`} value={clip.name}>
                  {clip.name || '(Tanpa nama)'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onTogglePlay}
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:border-neutral-500"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-neutral-400">
              <span>Speed</span>
              <span>{speed.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>

          <label className="flex items-center justify-between text-sm text-neutral-300">
            <span>Loop</span>
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => onLoopChange(e.target.checked)}
              className="h-4 w-4 accent-purple-400"
            />
          </label>
        </div>
      )}
    </div>
  )
}
