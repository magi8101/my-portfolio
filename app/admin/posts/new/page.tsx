import { PostEditor } from "@/components/admin/post-editor"

export const metadata = {
  title: "New Post - Admin",
}

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-8">New Post</h1>
      <PostEditor />
    </div>
  )
}
