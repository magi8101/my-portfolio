"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video,
  Music,
  Youtube as YoutubeIcon,
  X,
  Save,
  Eye,
  Loader2,
} from "lucide-react"
import type { Post } from "@/lib/supabase/types"
import { uploadFile, type UploadResult } from "@/lib/storage"
import { createClient } from "@/lib/supabase/client"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function extractPlainText(content: unknown): string {
  if (typeof content === "string") {
    return content.replace(/<[^>]*>/g, "")
  }
  
  if (typeof content === "object" && content !== null) {
    return JSON.stringify(content)
      .replace(/<[^>]*>/g, "")
      .replace(/[{}"[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }
  
  return ""
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

interface PostEditorProps {
  post?: Post
}

type CoverType = "image" | "video" | "audio"

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [coverType, setCoverType] = useState<CoverType>(post?.cover_type || "image")
  const [coverUrl, setCoverUrl] = useState(post?.cover_url || "")
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || "")
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || "")
  
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [mediaDialogType, setMediaDialogType] = useState<"image" | "video" | "audio" | "youtube">("image")
  const [mediaUrl, setMediaUrl] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
        HTMLAttributes: {
          class: "rounded-lg overflow-hidden",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    content: post?.content ? (post.content as object) : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[400px] focus:outline-none",
      },
    },
  })

  useEffect(() => {
    if (title && !post) {
      setSlug(generateSlug(title))
    }
  }, [title, post])

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }, [tags])

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }, [handleAddTag])

  const handleFileUpload = useCallback(async (file: File, insertInEditor: boolean = true) => {
    setIsUploading(true)
    setUploadProgress(`Uploading ${file.name}...`)
    
    try {
      const result: UploadResult = await uploadFile(file)
      
      if (insertInEditor && editor) {
        if (result.type === "image") {
          editor.chain().focus().setImage({ src: result.url }).run()
        }
      }
      
      setUploadProgress("")
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed"
      setUploadProgress(`Error: ${message}`)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [editor])

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const result = await handleFileUpload(file, false)
      setCoverUrl(result.url)
      setCoverType(result.type)
    } catch {
      // Error already displayed in uploadProgress
    }
    
    if (coverInputRef.current) {
      coverInputRef.current.value = ""
    }
  }, [handleFileUpload])

  const handleEditorFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      await handleFileUpload(file, true)
    } catch {
      // Error already displayed
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [handleFileUpload])

  const openMediaDialog = useCallback((type: "image" | "video" | "audio" | "youtube") => {
    setMediaDialogType(type)
    setMediaUrl("")
    setMediaDialogOpen(true)
  }, [])

  const insertMediaFromUrl = useCallback(() => {
    if (!editor || !mediaUrl) return
    
    if (mediaDialogType === "youtube") {
      editor.chain().focus().setYoutubeVideo({ src: mediaUrl }).run()
    } else if (mediaDialogType === "image") {
      editor.chain().focus().setImage({ src: mediaUrl }).run()
    }
    
    setMediaDialogOpen(false)
    setMediaUrl("")
  }, [editor, mediaUrl, mediaDialogType])

  const setLink = useCallback(() => {
    if (!editor) return
    
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
    
    setLinkDialogOpen(false)
    setLinkUrl("")
  }, [editor, linkUrl])

  const openLinkDialog = useCallback(() => {
    if (!editor) return
    
    const previousUrl = editor.getAttributes("link").href || ""
    setLinkUrl(previousUrl)
    setLinkDialogOpen(true)
  }, [editor])

  const savePost = useCallback(async (publish: boolean = false) => {
    if (!editor) return
    
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }
    
    if (!slug.trim()) {
      alert("Please enter a slug")
      return
    }
    
    const saving = publish ? setIsPublishing : setIsSaving
    saving(true)
    
    try {
      const supabase = createClient()
      const content = editor.getJSON()
      const plainText = extractPlainText(content)
      const readTime = calculateReadTime(plainText)
      
      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content,
        content_plain: plainText,
        cover_type: coverType,
        cover_url: coverUrl || null,
        read_time: readTime,
        tags: tags.length > 0 ? tags : null,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        published: publish ? true : (post?.published || false),
        published_at: publish ? new Date().toISOString() : (post?.published_at || null),
      }
      
      if (post?.id) {
        const { error } = await supabase
          .from("posts")
          .update({ ...postData, updated_at: new Date().toISOString() })
          .eq("id", post.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("posts")
          .insert(postData)
        
        if (error) throw error
      }
      
      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save post"
      alert(message)
    } finally {
      saving(false)
    }
  }, [editor, title, slug, excerpt, coverType, coverUrl, tags, metaTitle, metaDescription, post, router])

  if (!editor) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="cover">Cover Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-url-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of the post"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <div className="border rounded-lg overflow-hidden">
              <div className="flex gap-1 p-2 border-b bg-muted/50 overflow-x-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-accent" : ""}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-accent" : ""}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive("strike") ? "bg-accent" : ""}
                >
                  <Strikethrough className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={editor.isActive("code") ? "bg-accent" : ""}
                >
                  <Code className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
                >
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
                >
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
                >
                  <Heading3 className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive("bulletList") ? "bg-accent" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive("orderedList") ? "bg-accent" : ""}
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive("blockquote") ? "bg-accent" : ""}
                >
                  <Quote className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={openLinkDialog}
                  className={editor.isActive("link") ? "bg-accent" : ""}
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
                {editor.isActive("link") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                  >
                    <Unlink className="w-4 h-4" />
                  </Button>
                )}
                
                <div className="w-px h-6 bg-border mx-1" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openMediaDialog("image")}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => openMediaDialog("youtube")}
                >
                  <YoutubeIcon className="w-4 h-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleEditorFileUpload}
                className="hidden"
              />
              
              {uploadProgress && (
                <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                  {uploadProgress}
                </div>
              )}
              
              <div className="p-4">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cover" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={coverType === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoverType("image")}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant={coverType === "video" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoverType("video")}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button
                  type="button"
                  variant={coverType === "audio" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoverType("audio")}
                >
                  <Music className="w-4 h-4 mr-2" />
                  Audio
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Cover Media</Label>
              <input
                ref={coverInputRef}
                type="file"
                accept={
                  coverType === "image"
                    ? "image/*"
                    : coverType === "video"
                    ? "video/*"
                    : "audio/*"
                }
                onChange={handleCoverUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4 mr-2" />
                  )}
                  Upload {coverType}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverUrl">Or enter URL</Label>
              <Input
                id="coverUrl"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder={`Enter ${coverType} URL`}
              />
            </div>

            {coverUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg overflow-hidden max-w-xl">
                  {coverType === "image" && (
                    <img
                      src={coverUrl}
                      alt="Cover preview"
                      className="w-full h-auto"
                    />
                  )}
                  {coverType === "video" && (
                    <video
                      src={coverUrl}
                      controls
                      className="w-full h-auto"
                    />
                  )}
                  {coverType === "audio" && (
                    <audio
                      src={coverUrl}
                      controls
                      className="w-full"
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCoverUrl("")}
                  className="text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove cover
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO title (defaults to post title)"
            />
            <p className="text-xs text-muted-foreground">
              {metaTitle.length}/60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO description (defaults to excerpt)"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {metaDescription.length}/160 characters
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => savePost(false)}
          disabled={isSaving || isPublishing}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Draft
        </Button>
        
        {!post?.published && (
          <Button
            type="button"
            onClick={() => savePost(true)}
            disabled={isSaving || isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            Publish
          </Button>
        )}
        
        {post?.published && (
          <Button
            type="button"
            onClick={() => savePost(false)}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Update
          </Button>
        )}
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/posts")}
        >
          Cancel
        </Button>
      </div>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={setLink}>
              {linkUrl ? "Apply" : "Remove Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Insert {mediaDialogType === "youtube" ? "YouTube Video" : mediaDialogType}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mediaUrl">
                {mediaDialogType === "youtube" ? "YouTube URL" : "Media URL"}
              </Label>
              <Input
                id="mediaUrl"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={
                  mediaDialogType === "youtube"
                    ? "https://www.youtube.com/watch?v=..."
                    : "https://example.com/media.jpg"
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMediaDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertMediaFromUrl} disabled={!mediaUrl}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
