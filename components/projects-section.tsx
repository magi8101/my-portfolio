"use client"

import type React from "react"

import { useRef, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const projects = [
  {
    number: "01",
    name: "pyexec",
    subtitle: "Compiler",
    description: "Educational Python JIT/AOT compiler with LLVM & WebAssembly backends.",
    tech: "Python / LLVM / WASM",
    tags: ["Python", "LLVM", "WASM"],
    url: "https://github.com/magi8101/pyexec-compiler",
  },
  {
    number: "02",
    name: "velocix",
    subtitle: "Framework",
    description: "Rebuilding Starlette's core patterns to understand async Python web frameworks.",
    tech: "Python / Async / ASGI",
    tags: ["Python", "Async", "ASGI"],
    url: "https://github.com/magi8101/velocix",
  },
  {
    number: "03",
    name: "toon-parser",
    subtitle: "Parser",
    description: "High-performance Python bindings for TOON format parser, built with PyO3 and Rust.",
    tech: "Rust / Python / PyO3",
    tags: ["Rust", "Python", "PyO3"],
    url: "https://github.com/magi8101/toon-parser",
  },
  {
    number: "04",
    name: "Justjit",
    subtitle: "JIT Compiler",
    description: "Stack-based bytecode compiler for Python using LLVM. Implementing 100+ opcodes.",
    tech: "C++ / LLVM / Python",
    tags: ["C++", "LLVM", "Python"],
    url: "https://github.com/magi8101/Justjit",
  },
  {
    number: "05",
    name: "PostPyro",
    subtitle: "Database Driver",
    description: "High-performance PostgreSQL driver for Python built with Rust. DB-API 2.0 compliant.",
    tech: "Rust / Python / PostgreSQL",
    tags: ["Rust", "Python", "PostgreSQL"],
    url: "https://github.com/magi8101/PostPyro",
  },
]

// Extract all unique tags for filtering
const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort()

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Filter projects based on active tag
  const filteredProjects = useMemo(() => {
    if (!activeFilter) return projects
    return projects.filter((p) => p.tags.includes(activeFilter))
  }, [activeFilter])

  const handleFilterClick = (tag: string) => {
    setActiveFilter((current) => (current === tag ? null : tag))
    // Reset scroll position when filter changes
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
    containerRef.current.style.cursor = "grabbing"
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab"
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab"
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <section id="work" className="py-24 md:py-32">
      {/* Section header */}
      <div className="px-6 md:px-12 mb-8">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Selected Work</span>
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs font-mono text-muted-foreground">
            {filteredProjects.length.toString().padStart(2, "0")} Projects
          </span>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="px-6 md:px-12 mb-12">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              "px-3 py-1.5 text-xs font-mono uppercase tracking-widest rounded-full border transition-colors",
              activeFilter === null
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilterClick(tag)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono uppercase tracking-widest rounded-full border transition-colors",
                activeFilter === tag
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="horizontal-scroll overflow-x-auto select-none"
        style={{ cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="flex gap-6 md:gap-8 px-6 md:px-12 pb-4" style={{ width: "max-content" }}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <Link
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0"
                onClick={(e) => isDragging && e.preventDefault()}
                draggable={false}
              >
                {/* Project number and category */}
                <div className="flex items-start justify-between mb-16">
                  <span className="text-6xl md:text-7xl font-serif text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {project.subtitle}
                  </span>
                </div>

                {/* Project name */}
                <h3 className="text-3xl md:text-4xl font-serif mb-4 group-hover:text-primary transition-colors flex items-center gap-3">
                  {project.name}
                  <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8">{project.description}</p>

                {/* Tech */}
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{project.tech}</span>
              </Link>
            ))
          ) : (
            <div className="w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 flex items-center justify-center py-16">
              <p className="text-muted-foreground font-mono text-sm">No projects found with this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="px-6 md:px-12 mt-8 flex justify-end">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {filteredProjects.length > 1 ? "Drag to explore" : ""} →
        </span>
      </div>
    </section>
  )
}
