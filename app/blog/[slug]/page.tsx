import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug } from "@/lib/blog"
import { format } from "date-fns"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PostContent } from "@/components/blog/post-content"
import { ViewCounter } from "@/components/blog/view-counter"
import { LikeButton } from "@/components/blog/like-button"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { ActiveReaders } from "@/components/blog/active-readers"
import { PopularPosts } from "@/components/blog/popular-posts"
import { ShareButtons } from "@/components/blog/share-buttons"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { ReadingTimeLeft } from "@/components/blog/reading-time-left"
import { GiscusComments } from "@/components/blog/giscus-comments"
import { ArrowLeft } from "lucide-react"

// Dynamic rendering since we fetch from Supabase
export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Post Not Found",
    }
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://magi-portfolio.vercel.app"
  const ogImageUrl = post.og_image || `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt || "")}&type=blog`
  
  return {
    title: `${post.meta_title || post.title} - Magi Sharma`,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [ogImageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const { title, tags, published_at, read_time, cover_url, cover_type, cover_thumbnail, content } = post

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ReadingProgress slug={slug} />
      
      <article className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-8 sm:mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
          
          <header className="mb-8 sm:mb-12">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-mono text-muted-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
              {title}
            </h1>
            
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm font-mono text-muted-foreground">
              {published_at && (
                <time dateTime={published_at}>
                  {format(new Date(published_at), "MMMM dd, yyyy")}
                </time>
              )}
              {read_time && (
                <ReadingTimeLeft readTime={read_time} />
              )}
              <ViewCounter slug={slug} trackView />
              <ActiveReaders slug={slug} />
            </div>
          </header>
          
          {cover_url && (
            <div className="mb-8 sm:mb-12">
              {cover_type === "image" && (
                <img
                  src={cover_url}
                  alt={title}
                  className="w-full h-auto"
                />
              )}
              {cover_type === "video" && (
                <video
                  src={cover_url}
                  poster={cover_thumbnail || undefined}
                  controls
                  playsInline
                  className="w-full h-auto"
                />
              )}
              {cover_type === "audio" && (
                <audio
                  src={cover_url}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}
          
          <PostContent content={content} />
          
          {/* Like button and share */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Did you find this helpful?</span>
                <LikeButton slug={slug} />
              </div>
              <ShareButtons title={title} slug={slug} />
            </div>
          </div>
          
          <PopularPosts currentSlug={slug} limit={3} />
          
          <GiscusComments slug={slug} />
        </div>
        
        <TableOfContents content={content} />
      </article>

      <Footer />
    </main>
  )
}
