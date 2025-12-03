"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Menu, X } from "lucide-react"

interface AdminNavProps {
  user: User
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Posts", href: "/admin/posts" },
    { name: "Media", href: "/admin/media" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <nav className="px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/admin" className="text-sm font-mono uppercase tracking-widest">
              Admin
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-mono uppercase tracking-widest transition-colors ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className="hidden sm:block text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              View Site
            </Link>
            <span className="text-sm text-muted-foreground hidden lg:block truncate max-w-[150px]">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="hidden sm:block text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-20 px-4 md:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-lg font-mono uppercase tracking-widest transition-colors ${
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-muted-foreground"
              >
                View Site
              </Link>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
