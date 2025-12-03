import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 border-t border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-baseline gap-8">
          <Link href="/" className="text-sm font-mono uppercase tracking-widest text-foreground">
            Magi Sharma
          </Link>
          <span className="text-sm text-muted-foreground">Developer & Builder</span>
        </div>

        <p className="text-sm text-muted-foreground font-mono">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
