"use client"

import { useState } from "react"

interface ImageBlockProps {
  src: string
  alt: string
  title?: string
}

export function ImageBlock({ src, alt, title }: ImageBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <>
      <figure className="my-6 sm:my-8 -mx-4 sm:mx-0">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full cursor-zoom-in block relative"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
            loading="lazy"
          />
        </button>
        {title && (
          <figcaption className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 text-center px-4 sm:px-0">
            {title}
          </figcaption>
        )}
      </figure>
      
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsExpanded(false)
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Close [ESC]
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
          />
        </div>
      )}
    </>
  )
}
