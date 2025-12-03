"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Image as ImageIcon,
  Video,
  Music,
  Upload,
  Trash2,
  Copy,
  Check,
  Loader2,
  X,
  FileAudio,
  FileVideo,
  File,
} from "lucide-react"
import type { Media } from "@/lib/supabase/types"
import { uploadFile, deleteFile, type UploadResult } from "@/lib/storage"
import { createClient } from "@/lib/supabase/client"

interface MediaLibraryProps {
  initialMedia: Media[]
}

type MediaFilter = "all" | "image" | "video" | "audio"

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const router = useRouter()
  const [media, setMedia] = useState<Media[]>(initialMedia)
  const [filter, setFilter] = useState<MediaFilter>("all")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredMedia = filter === "all" 
    ? media 
    : media.filter((m) => m.type === filter)

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Uploading ${file.name} (${i + 1}/${files.length})...`)
      
      try {
        const result: UploadResult = await uploadFile(file)
        
        const supabase = createClient()
        const { data, error } = await supabase
          .from("media")
          .insert({
            type: result.type,
            filename: result.filename,
            url: result.url,
            size: result.size,
            mime_type: result.mimeType,
          })
          .select()
          .single()
        
        if (error) throw error
        
        if (data) {
          setMedia((prev) => [data, ...prev])
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed"
        alert(`Failed to upload ${file.name}: ${message}`)
      }
    }
    
    setIsUploading(false)
    setUploadProgress("")
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleDelete = useCallback(async () => {
    if (!mediaToDelete) return
    
    setIsDeleting(true)
    
    try {
      const urlParts = mediaToDelete.url.split("/")
      const path = `${mediaToDelete.type}s/${urlParts[urlParts.length - 1]}`
      
      await deleteFile(path)
      
      const supabase = createClient()
      const { error } = await supabase
        .from("media")
        .delete()
        .eq("id", mediaToDelete.id)
      
      if (error) throw error
      
      setMedia((prev) => prev.filter((m) => m.id !== mediaToDelete.id))
      setDeleteDialogOpen(false)
      setMediaToDelete(null)
      
      if (selectedMedia?.id === mediaToDelete.id) {
        setSelectedMedia(null)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed"
      alert(message)
    } finally {
      setIsDeleting(false)
    }
  }, [mediaToDelete, selectedMedia])

  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch {
      alert("Failed to copy URL")
    }
  }, [])

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />
      case "video":
        return <FileVideo className="w-5 h-5" />
      case "audio":
        return <FileAudio className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as MediaFilter)} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="image" className="text-xs sm:text-sm">
              <ImageIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="text-xs sm:text-sm">
              <Video className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-xs sm:text-sm">
              <Music className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Files
          </Button>
        </div>
      </div>

      {uploadProgress && (
        <div className="px-4 py-3 bg-muted rounded-lg text-sm">
          {uploadProgress}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedMedia?.id === item.id
                ? "ring-2 ring-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedMedia(item)}
          >
            <div className="aspect-square bg-muted flex items-center justify-center">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.alt_text || item.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  {getMediaIcon(item.type)}
                  <span className="text-xs text-center px-2 truncate max-w-full">
                    {item.filename}
                  </span>
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs truncate">{item.filename}</p>
              </div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge variant="secondary" className="text-xs">
                {item.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No media files found</p>
          <p className="text-sm mt-1">Upload files to get started</p>
        </div>
      )}

      {selectedMedia && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:w-80 max-h-[70vh] sm:max-h-none bg-card border-t sm:border-t-0 sm:border-l shadow-xl p-4 sm:p-6 overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Media Details</h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt_text || selectedMedia.filename}
                  className="w-full h-full object-contain"
                />
              ) : selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <audio
                  src={selectedMedia.url}
                  controls
                  className="w-full px-4"
                />
              )}
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Filename</Label>
                <p className="mt-1 break-all">{selectedMedia.filename}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="mt-1 capitalize">{selectedMedia.type}</p>
              </div>

              {selectedMedia.mime_type && (
                <div>
                  <Label className="text-muted-foreground">MIME Type</Label>
                  <p className="mt-1">{selectedMedia.mime_type}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Size</Label>
                <p className="mt-1">{formatFileSize(selectedMedia.size)}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Uploaded</Label>
                <p className="mt-1">
                  {format(new Date(selectedMedia.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">URL</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    value={selectedMedia.url}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(selectedMedia.url)}
                  >
                    {copiedUrl === selectedMedia.url ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setMediaToDelete(selectedMedia)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Media
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{mediaToDelete?.filename}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
