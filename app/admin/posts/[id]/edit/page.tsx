import { notFound } from "next/navigation"
import { getPostById } from "@/lib/blog"
import { PostEditor } from "@/components/admin/post-editor"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const post = await getPostById(id)
  
  return {
    title: post ? `Edit: ${post.title} - Admin` : "Edit Post - Admin",
  }
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-8">Edit Post</h1>
      <PostEditor post={post} />
    </div>
  )
}
