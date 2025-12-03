import Link from "next/link"
import { getPublishedPosts } from "@/lib/blog"
import { format } from "date-fns"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogSearch } from "@/components/blog/blog-search"

// Dynamic rendering since we fetch from Supabase
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Blog - Magi Sharma",
  description: "Technical articles about compilers, systems programming, and developer tools.",
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12">
        <div className="mb-10 sm:mb-16">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Blog
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif mt-4 leading-tight">
            Writing about
            <br />
            <span className="text-primary">code and systems</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-6 sm:mt-8 max-w-2xl">
            Technical deep-dives into compilers, parsers, and the tools I build.
            Sharing what I learn as I explore how things work beneath the abstractions.
          </p>
        </div>

        <BlogSearch posts={posts} />

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-lg">
              No posts published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-0 border-t border-border">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block py-6 sm:py-8 border-b border-border hover:border-primary transition-colors"
              >
                <div className="grid md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 items-start">
                  <div className="hidden md:block md:col-span-1">
                    <span className="text-4xl font-serif text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  
                  <div className="md:col-span-7">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground mt-2 sm:mt-3 line-clamp-2 text-sm sm:text-base">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <div className="md:col-span-4 flex flex-wrap gap-3 sm:gap-4 md:justify-end items-start">
                    {post.published_at && (
                      <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                        {format(new Date(post.published_at), "MMM dd, yyyy")}
                      </span>
                    )}
                    {post.read_time && (
                      <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                        {post.read_time} min read
                      </span>
                    )}
                  </div>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 md:ml-[calc(8.333%+2rem)]">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-mono text-muted-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
