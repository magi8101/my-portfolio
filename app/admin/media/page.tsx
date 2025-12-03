import { createClient } from "@/lib/supabase/server"
import { MediaLibrary } from "@/components/admin/media-library"

export const metadata = {
  title: "Media Library - Admin",
}

export default async function MediaPage() {
  const supabase = await createClient()
  
  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching media:", error)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif">Media Library</h1>
        <p className="text-muted-foreground mt-2">
          Manage your uploaded images, videos, and audio files
        </p>
      </div>

      <MediaLibrary initialMedia={media || []} />
    </div>
  )
}
