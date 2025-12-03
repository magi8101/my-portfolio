"use client"

const tools = {
  languages: ["Python", "Rust", "C++", "TypeScript", "JavaScript"],
  systems: ["LLVM", "WebAssembly", "PyO3", "PostgreSQL", "Redis"],
  tools: ["Git", "Linux", "Docker", "Vscode"],
}

export function SkillsSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 border-t border-border bg-card">
      <div className="grid lg:grid-cols-12 gap-16 lg:gap-8">
        {/* Left column */}
        <div className="lg:col-span-4">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Stack</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 leading-tight">
            Tools I<br />
            work with
          </h2>
        </div>

        {/* Right column - Tools grid */}
        <div className="lg:col-span-8 lg:pl-12">
          <div className="space-y-12">
            {/* Languages */}
            <div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-6">
                Languages
              </span>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {tools.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-2xl md:text-3xl font-serif text-foreground hover:text-primary transition-colors cursor-default"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Systems */}
            <div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-6">
                Systems & Technologies
              </span>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {tools.systems.map((tech) => (
                  <span
                    key={tech}
                    className="text-2xl md:text-3xl font-serif text-foreground hover:text-primary transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-6">
                Environment
              </span>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {tools.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-2xl md:text-3xl font-serif text-foreground hover:text-primary transition-colors cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
