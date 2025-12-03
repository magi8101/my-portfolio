"use client"

import { useEffect, useState } from "react"

interface TableOfContentsProps {
  content: unknown
}

interface TOCItem {
  id: string
  text: string
  level: number
}

function extractHeadings(content: unknown): TOCItem[] {
  const headings: TOCItem[] = []
  
  if (!content || typeof content !== "object") return headings
  
  const jsonContent = content as { type?: string; content?: unknown[]; attrs?: { level?: number } }
  
  function traverse(node: unknown) {
    if (!node || typeof node !== "object") return
    
    const n = node as { type?: string; content?: unknown[]; attrs?: { level?: number }; text?: string }
    
    if (n.type === "heading" && n.attrs?.level && n.attrs.level <= 3) {
      const text = extractText(n.content)
      if (text) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        
        headings.push({
          id,
          text,
          level: n.attrs.level,
        })
      }
    }
    
    if (n.content && Array.isArray(n.content)) {
      n.content.forEach(traverse)
    }
  }
  
  function extractText(content: unknown[] | undefined): string {
    if (!content) return ""
    return content
      .map((node) => {
        const n = node as { text?: string; content?: unknown[] }
        if (n.text) return n.text
        if (n.content) return extractText(n.content)
        return ""
      })
      .join("")
  }
  
  traverse(jsonContent)
  return headings
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const headings = extractHeadings(content)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )
    
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    
    return () => observer.disconnect()
  }, [headings])
  
  if (headings.length < 3) return null
  
  return (
    <nav className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-56 max-h-[60vh] overflow-y-auto">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-4">
        On this page
      </span>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`block text-sm transition-colors ${
                level === 2 ? "pl-0" : level === 3 ? "pl-3" : "pl-0"
              } ${
                activeId === id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
