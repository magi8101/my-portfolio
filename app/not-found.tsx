import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center min-h-[80vh]">
        <span className="text-[20vw] md:text-[15vw] font-serif text-muted-foreground/20 leading-none select-none">
          404
        </span>
        
        <h1 className="text-3xl md:text-5xl font-serif mt-4 text-center">
          Page not found
        </h1>
        
        <p className="text-muted-foreground text-lg mt-4 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Link
            href="/"
            className="px-6 py-3 border border-foreground text-foreground text-sm font-mono uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-border text-muted-foreground text-sm font-mono uppercase tracking-widest hover:border-foreground hover:text-foreground transition-colors"
          >
            Read blog
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
