"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // If not on homepage, anchor links need to go to homepage first
  const getHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`
    }
    return href
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <nav className="px-6 md:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="text-white text-sm font-mono uppercase tracking-widest">
            Magi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={getHref(item.href)}
                className="text-white text-sm font-mono uppercase tracking-widest hover:opacity-50 transition-opacity"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-sm font-mono uppercase tracking-widest"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      {/* Full screen mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col justify-center px-6">
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <Link key={item.name} href={getHref(item.href)} onClick={() => setIsMobileMenuOpen(false)} className="block">
                <span className="text-muted-foreground font-mono text-sm">0{index + 1}</span>
                <span className="block text-foreground text-6xl font-serif hover:text-primary transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
