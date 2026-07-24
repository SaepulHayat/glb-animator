import { useMemo, useState } from 'react'
import { generateReactThreeFiberCode } from '../../lib/generateCode'
import { CodeBlock } from './CodeBlock'

interface CodePanelProps {
  fileName: string
  clipName: string | null
  autoplay: boolean
  loop: boolean
}

export function CodePanel({ fileName, clipName, autoplay, loop }: CodePanelProps) {
  const code = useMemo(
    () => generateReactThreeFiberCode({ fileName, clipName, autoplay, loop }),
    [fileName, clipName, autoplay, loop],
  )
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-200">Generated Code</h2>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-neutral-500"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <CodeBlock code={code} />
    </div>
  )
}
