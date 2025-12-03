"use client"

import type { ReactNode } from "react"
import type { JSONContent } from "@tiptap/react"
import { ImageBlock } from "./blocks/image-block"
import { VideoBlock } from "./blocks/video-block"
import { AudioBlock } from "./blocks/audio-block"
import { CodeBlock } from "./blocks/code-block"

interface PostContentProps {
  content: unknown
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

function renderNode(node: JSONContent, index: number): ReactNode {
  const key = `${node.type}-${index}`
  
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="text-base sm:text-lg leading-relaxed text-foreground mb-4 sm:mb-6">
          {node.content?.map((child, i) => renderInline(child, i))}
        </p>
      )
    
    case "heading": {
      const level = (node.attrs?.level || 2) as HeadingLevel
      const headingClasses: Record<HeadingLevel, string> = {
        1: "text-2xl sm:text-3xl md:text-4xl font-serif mt-8 sm:mt-12 mb-4 sm:mb-6",
        2: "text-xl sm:text-2xl md:text-3xl font-serif mt-6 sm:mt-10 mb-3 sm:mb-4",
        3: "text-lg sm:text-xl md:text-2xl font-serif mt-5 sm:mt-8 mb-3 sm:mb-4",
        4: "text-base sm:text-lg md:text-xl font-serif mt-4 sm:mt-6 mb-2 sm:mb-3",
        5: "text-base sm:text-lg font-serif mt-3 sm:mt-4 mb-2",
        6: "text-sm sm:text-base font-serif mt-3 sm:mt-4 mb-2",
      }
      const className = headingClasses[level] || headingClasses[2]
      const children = node.content?.map((child, i) => renderInline(child, i))
      
      // Generate ID for anchor linking
      const textContent = node.content?.map((child) => {
        const c = child as { text?: string }
        return c.text || ""
      }).join("") || ""
      const id = textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      
      switch (level) {
        case 1:
          return <h1 key={key} id={id} className={className}>{children}</h1>
        case 2:
          return <h2 key={key} id={id} className={className}>{children}</h2>
        case 3:
          return <h3 key={key} id={id} className={className}>{children}</h3>
        case 4:
          return <h4 key={key} id={id} className={className}>{children}</h4>
        case 5:
          return <h5 key={key} id={id} className={className}>{children}</h5>
        case 6:
          return <h6 key={key} id={id} className={className}>{children}</h6>
        default:
          return <h2 key={key} id={id} className={className}>{children}</h2>
      }
    }
    
    case "bulletList":
      return (
        <ul key={key} className="list-disc pl-4 sm:pl-6 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
          {node.content?.map((item, i) => renderNode(item, i))}
        </ul>
      )
    
    case "orderedList":
      return (
        <ol key={key} className="list-decimal pl-4 sm:pl-6 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
          {node.content?.map((item, i) => renderNode(item, i))}
        </ol>
      )
    
    case "listItem":
      return (
        <li key={key} className="text-base sm:text-lg leading-relaxed">
          {node.content?.map((child, i) => {
            if (child.type === "paragraph") {
              return child.content?.map((inline, j) => renderInline(inline, j))
            }
            return renderNode(child, i)
          })}
        </li>
      )
    
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-2 border-primary pl-4 sm:pl-6 my-6 sm:my-8 italic text-base sm:text-lg">
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )
    
    case "codeBlock":
      return (
        <CodeBlock
          key={key}
          code={node.content?.[0]?.text || ""}
          language={node.attrs?.language || "plaintext"}
        />
      )
    
    case "horizontalRule":
      return <hr key={key} className="border-border my-8 sm:my-12" />
    
    case "image":
      return (
        <ImageBlock
          key={key}
          src={node.attrs?.src || ""}
          alt={node.attrs?.alt || ""}
          title={node.attrs?.title}
        />
      )
    
    case "youtube":
      return (
        <div key={key} className="my-6 sm:my-8 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${node.attrs?.src}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )
    
    case "video":
      return (
        <VideoBlock
          key={key}
          src={node.attrs?.src || ""}
          poster={node.attrs?.poster}
        />
      )
    
    case "audio":
      return (
        <AudioBlock
          key={key}
          src={node.attrs?.src || ""}
          title={node.attrs?.title}
        />
      )
    
    case "doc":
      return (
        <div key={key}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </div>
      )
    
    default:
      if (node.content) {
        return (
          <div key={key}>
            {node.content.map((child, i) => renderNode(child, i))}
          </div>
        )
      }
      return null
  }
}

function renderInline(node: JSONContent, index: number): ReactNode {
  const key = `inline-${index}`
  
  if (node.type === "text") {
    let content: React.ReactNode = node.text
    
    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case "bold":
            content = <strong key={`bold-${key}`}>{content}</strong>
            break
          case "italic":
            content = <em key={`italic-${key}`}>{content}</em>
            break
          case "code":
            content = (
              <code key={`code-${key}`} className="px-1 sm:px-1.5 py-0.5 bg-muted font-mono text-xs sm:text-sm break-all">
                {content}
              </code>
            )
            break
          case "link":
            content = (
              <a
                key={`link-${key}`}
                href={mark.attrs?.href}
                target={mark.attrs?.target || "_blank"}
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                {content}
              </a>
            )
            break
          case "strike":
            content = <s key={`strike-${key}`}>{content}</s>
            break
        }
      }
    }
    
    return <span key={key}>{content}</span>
  }
  
  if (node.type === "hardBreak") {
    return <br key={key} />
  }
  
  return null
}

export function PostContent({ content }: PostContentProps) {
  if (!content) {
    return null
  }
  
  // Handle string content (legacy HTML)
  if (typeof content === "string") {
    return (
      <div
        className="prose prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }
  
  // Handle Tiptap JSON content
  const jsonContent = content as JSONContent
  
  return (
    <div className="post-content">
      {jsonContent.type === "doc" && jsonContent.content
        ? jsonContent.content.map((node, i) => renderNode(node, i))
        : renderNode(jsonContent, 0)}
    </div>
  )
}
