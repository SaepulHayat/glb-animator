import { useRef, useState } from 'react'
import { ACCEPTED_FILE_EXTENSION } from '../../lib/constants'

interface FileDropzoneProps {
  onFileSelected: (file: File) => void
}

export function FileDropzone({ onFileSelected }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (e.dataTransfer.types.includes('Files')) setIsDragActive(true)
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragActive(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors sm:py-14 ${
        isDragActive
          ? 'border-purple-400 bg-purple-400/10'
          : 'border-neutral-700 bg-neutral-900/80 hover:border-neutral-500'
      }`}
    >
      <svg
        className="h-10 w-10 text-neutral-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 7.5a4.5 4.5 0 0 1 8.79-1.39 3.75 3.75 0 0 1 3.7 3.64A3.75 3.75 0 0 1 19.5 17H7A4 4 0 0 1 7.5 7.5Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v7m0-7 3 3m-3-3-3 3" />
      </svg>
      <div>
        <p className="text-base font-medium text-neutral-200">
          Drag &amp; drop file .glb ke sini
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          atau klik untuk memilih file dari komputer Anda
        </p>
      </div>
      <p className="text-xs text-neutral-600">Format .glb · maksimum 100MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_EXTENSION}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
