"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import emailjs from "@emailjs/browser"

const links = [
  { name: "GitHub", handle: "@magi8101", href: "https://github.com/magi8101" },
  { name: "LinkedIn", handle: "Connect", href: "https://www.linkedin.com/in/magi-sharma/" },
  { name: "Instagram", handle: "@shxrmx_.xo", href: "https://instagram.com/shxrmx_.xo" },
  { name: "Email", handle: "Say hello", href: "mailto:sharmamagi0@gmail.com" },
]

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "rate-limited">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setErrorMessage("")

    try {
      // Check rate limit first
      const rateLimitRes = await fetch("/api/rate-limit", { method: "POST" })
      const rateLimitData = await rateLimitRes.json()

      if (!rateLimitRes.ok || !rateLimitData.allowed) {
        setStatus("rate-limited")
        const minutes = Math.ceil((rateLimitData.resetIn || 3600) / 60)
        setErrorMessage(`Too many messages. Please try again in ${minutes} minutes.`)
        setTimeout(() => setStatus("idle"), 5000)
        return
      }

      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setStatus("sent")
      setFormState({ name: "", email: "", message: "" })
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      console.error("EmailJS Error:", error)
      setStatus("error")
      setErrorMessage("Failed to send message. Please try again.")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12 border-t border-border">
      {/* Large CTA text */}
      <div className="mb-24">
        <h2 className="text-[10vw] md:text-[8vw] font-serif leading-[0.9] tracking-tight">
          Let's work
          <br />
          <span className="text-primary">together</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left - Links */}
        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-8">Connect</span>
          <div className="space-y-0">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-5 border-b border-border hover:border-primary transition-colors"
              >
                <div>
                  <span className="text-xl md:text-2xl font-serif text-foreground group-hover:text-primary transition-colors">
                    {link.name}
                  </span>
                  <span className="text-sm text-muted-foreground ml-4">{link.handle}</span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-8">
            Send a message
          </span>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="user_name"
                placeholder="Name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
                className="w-full bg-transparent border-b border-border py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                name="user_email"
                placeholder="Email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
                className="w-full bg-transparent border-b border-border py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Message"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-transparent border-b border-border py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            {(status === "error" || status === "rate-limited") && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-8 px-8 py-4 border border-foreground text-foreground text-sm font-mono uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : status === "error" || status === "rate-limited" ? "Try Again" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
