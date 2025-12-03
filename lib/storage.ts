import { createClient } from "@/lib/supabase/client"
import { nanoid } from "nanoid"

export type MediaType = "image" | "video" | "audio"

export interface UploadResult {
  url: string
  path: string
  filename: string
  size: number
  type: MediaType
  mimeType: string
}

const BUCKET_NAME = "blog-media"

const ALLOWED_TYPES: Record<MediaType, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
}

const MAX_FILE_SIZES: Record<MediaType, number> = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
}

export function getMediaType(mimeType: string): MediaType | null {
  for (const [type, mimeTypes] of Object.entries(ALLOWED_TYPES)) {
    if (mimeTypes.includes(mimeType)) {
      return type as MediaType
    }
  }
  return null
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const mediaType = getMediaType(file.type)
  
  if (!mediaType) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported`,
    }
  }
  
  const maxSize = MAX_FILE_SIZES[mediaType]
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSize / (1024 * 1024)}MB for ${mediaType} files`,
    }
  }
  
  return { valid: true }
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  
  const mediaType = getMediaType(file.type)!
  const ext = file.name.split(".").pop() || ""
  const filename = `${nanoid()}.${ext}`
  const path = `${mediaType}s/${filename}`
  
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
  
  return {
    url: urlData.publicUrl,
    path,
    filename: file.name,
    size: file.size,
    type: mediaType,
    mimeType: file.type,
  }
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])
  
  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

export function getPublicUrl(path: string): string {
  const supabase = createClient()
  
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
  
  return data.publicUrl
}
