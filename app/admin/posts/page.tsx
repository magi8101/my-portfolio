import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { format } from "date-fns"
import { PostActions } from "@/components/admin/post-actions"

export const metadata = {
  title: "Posts - Admin",
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-foreground text-background text-xs sm:text-sm font-mono uppercase tracking-widest hover:bg-foreground/90 transition-colors text-center"
        >
          New Post
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
        <div className="border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Title
                </th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-widest hidden md:table-cell">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-widest hidden md:table-cell">
                  Date
                </th>
                <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-card/50 transition-colors">
                  <td className="p-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1 md:hidden">
                      <span className={post.published ? "text-green-500" : "text-yellow-500"}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                      {" - "}
                      {format(new Date(post.created_at), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-mono ${
                        post.published
                          ? "text-green-500 bg-green-500/10"
                          : "text-yellow-500 bg-yellow-500/10"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                    {format(new Date(post.created_at), "MMM dd, yyyy")}
                  </td>
                  <td className="p-4 text-right">
                    <PostActions post={post} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
