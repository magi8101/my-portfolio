"use client"

import { useState, useRef } from "react"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }
  
  return (
    <div className="my-6 sm:my-8 relative group -mx-4 sm:mx-0">
      <div className="flex items-center justify-between bg-card border border-border border-b-0 px-3 sm:px-4 py-2">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        <button
          type="button"
          onClick={copyToClipboard}
          className="text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        ref={preRef}
        className="bg-card border border-border overflow-x-auto p-3 sm:p-4"
      >
        <code className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}
