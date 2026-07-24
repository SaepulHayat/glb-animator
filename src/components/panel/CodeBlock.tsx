import { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/themes/prism-tomorrow.css'

interface CodeBlockProps {
  code: string
}

export function CodeBlock({ code }: CodeBlockProps) {
  const html = useMemo(
    () => Prism.highlight(code, Prism.languages.tsx, 'tsx'),
    [code],
  )

  return (
    <div className="max-h-96 overflow-auto rounded-lg">
      <pre className="!m-0 p-3 text-xs leading-relaxed">
        <code
          className="language-tsx"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  )
}
