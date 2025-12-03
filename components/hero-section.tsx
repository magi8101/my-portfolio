"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-32 pb-12">
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-[90vw]">
          {/* Large headline */}
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-serif leading-[0.85] tracking-tight">
            <span className="block">Developer</span>
            <span className="block text-primary">&amp; Builder</span>
          </h1>

          {/* Subtext positioned asymmetrically */}
          <div className="mt-12 md:mt-16 md:ml-[20vw] max-w-md">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Crafting compilers, parsers, and systems-level tools. I build things that make other developers more
              productive.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-12 border-t border-border">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Location</span>
            <p className="text-foreground mt-1">Chennai, India</p>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Local Time</span>
            <p className="text-foreground mt-1 font-mono">{time} IST</p>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Status</span>
            <p className="text-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Available
            </p>
          </div>
        </div>

        <Link
          href="#work"
          className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Scroll to explore
        </Link>
      </div>
    </section>
  )
}
