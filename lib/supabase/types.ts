export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: Json
          content_plain: string | null
          cover_type: "image" | "video" | "audio"
          cover_url: string | null
          cover_thumbnail: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          read_time: number | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          og_image: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: Json
          content_plain?: string | null
          cover_type?: "image" | "video" | "audio"
          cover_url?: string | null
          cover_thumbnail?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          read_time?: number | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: Json
          content_plain?: string | null
          cover_type?: "image" | "video" | "audio"
          cover_url?: string | null
          cover_thumbnail?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          read_time?: number | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
        }
      }
      media: {
        Row: {
          id: string
          type: "image" | "video" | "audio"
          filename: string
          url: string
          thumbnail_url: string | null
          size: number | null
          width: number | null
          height: number | null
          duration: number | null
          mime_type: string | null
          alt_text: string | null
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: "image" | "video" | "audio"
          filename: string
          url: string
          thumbnail_url?: string | null
          size?: number | null
          width?: number | null
          height?: number | null
          duration?: number | null
          mime_type?: string | null
          alt_text?: string | null
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: "image" | "video" | "audio"
          filename?: string
          url?: string
          thumbnail_url?: string | null
          size?: number | null
          width?: number | null
          height?: number | null
          duration?: number | null
          mime_type?: string | null
          alt_text?: string | null
          caption?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Post = Database["public"]["Tables"]["posts"]["Row"]
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"]
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"]
export type Media = Database["public"]["Tables"]["media"]["Row"]
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"]
