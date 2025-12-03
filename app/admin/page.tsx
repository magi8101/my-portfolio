import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { format } from "date-fns"

export const metadata = {
  title: "Admin Dashboard - Magi Sharma",
}

export default async function AdminPage() {
  const posts = await getAllPosts()
  const publishedCount = posts.filter(p => p.published).length
  const draftCount = posts.filter(p => !p.published).length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your blog posts and media</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-foreground text-background text-xs sm:text-sm font-mono uppercase tracking-widest hover:bg-foreground/90 transition-colors text-center"
        >
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-card border border-border p-3 sm:p-6">
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Total Posts
          </span>
          <p className="text-2xl sm:text-4xl font-serif mt-1 sm:mt-2">{posts.length}</p>
        </div>
        <div className="bg-card border border-border p-3 sm:p-6">
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Published
          </span>
          <p className="text-2xl sm:text-4xl font-serif mt-1 sm:mt-2">{publishedCount}</p>
        </div>
        <div className="bg-card border border-border p-3 sm:p-6">
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Drafts
          </span>
          <p className="text-2xl sm:text-4xl font-serif mt-1 sm:mt-2">{draftCount}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif">Recent Posts</h2>
          <Link
            href="/admin/posts"
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <Link
              href="/admin/posts/new"
              className="text-primary hover:underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            {posts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between p-4 hover:bg-card transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{post.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className={post.published ? "text-green-500" : "text-yellow-500"}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span>
                      {format(new Date(post.created_at), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  Edit
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
