"use client"

import { useEffect, useRef } from "react"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }
  
  return (
    <div className="my-8 relative group">
      <div className="flex items-center justify-between bg-card border border-border border-b-0 px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        <button
          type="button"
          onClick={copyToClipboard}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          Copy
        </button>
      </div>
      <pre
        ref={preRef}
        className="bg-card border border-border overflow-x-auto p-4"
      >
        <code className="text-sm font-mono leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  )
}
