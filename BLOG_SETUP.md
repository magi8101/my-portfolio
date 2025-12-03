# Blog System Setup Guide

This guide will help you set up the blog system with Supabase.

## Prerequisites

- A Supabase account (free tier works)
- Node.js 18+ installed
- pnpm installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New project"
3. Enter a project name and database password
4. Select a region close to your users
5. Click "Create new project"
6. Wait for the project to be created (takes about 2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Set Environment Variables

Create or update your `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/schema.sql` and paste it
4. Click "Run" to execute the SQL

This creates:

- `posts` table for blog posts
- `media` table for uploaded files
- Indexes for performance
- Row Level Security policies

## Step 5: Set Up Storage Bucket

1. In your Supabase project, go to **Storage**
2. Click "New bucket"
3. Enter bucket name: `blog-media`
4. Check "Public bucket" to make it public
5. Click "Create bucket"

Then run the storage policies:

1. Go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/storage.sql` and paste it
4. Click "Run" to execute the SQL

## Step 6: Create Admin User

1. In your Supabase project, go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter email and password for your admin account
4. Click "Create user"

This user can now log in at `/admin/login` to manage the blog.

## Step 7: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

## Usage

### Public Pages

- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog post

### Admin Pages

- `/admin/login` - Admin login
- `/admin` - Dashboard
- `/admin/posts` - Manage posts
- `/admin/posts/new` - Create new post
- `/admin/posts/[id]/edit` - Edit existing post
- `/admin/media` - Media library

## Features

### Rich Text Editor

The post editor supports:

- **Text formatting**: Bold, italic, strikethrough, code
- **Headings**: H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Block elements**: Blockquotes, horizontal rules
- **Links**: Auto-linking and manual link insertion
- **Media**: Image upload/URL, YouTube embeds

### Media Support

Supported file types:

- **Images**: JPEG, PNG, WebP, GIF, SVG (max 10MB)
- **Videos**: MP4, WebM, QuickTime (max 100MB)
- **Audio**: MP3, WAV, OGG, M4A (max 50MB)

### SEO

Each post supports:

- Custom meta title
- Custom meta description
- Open Graph image
- Auto-generated read time

## Troubleshooting

### "Permission denied" errors

Make sure you:

1. Created the admin user in Supabase Authentication
2. Ran the RLS policies from `supabase/schema.sql`
3. Are logged in at `/admin/login`

### Images not uploading

Make sure you:

1. Created the `blog-media` storage bucket
2. Made it a public bucket
3. Ran the storage policies from `supabase/storage.sql`

### Posts not showing on public blog

Make sure the post:

1. Has `published` set to `true`
2. Has a valid `slug`
3. Has content in the editor

## File Structure

```
app/
  blog/
    page.tsx           # Blog listing
    [slug]/
      page.tsx         # Individual post
  admin/
    layout.tsx         # Protected admin layout
    page.tsx           # Dashboard
    login/
      page.tsx         # Login form
    posts/
      page.tsx         # Posts list
      new/
        page.tsx       # New post
      [id]/
        edit/
          page.tsx     # Edit post
    media/
      page.tsx         # Media library

components/
  admin/
    admin-nav.tsx      # Admin navigation
    post-editor.tsx    # Tiptap editor
    post-actions.tsx   # Publish/delete actions
    media-library.tsx  # Media management
  blog/
    post-content.tsx   # Render post content
    blocks/
      image-block.tsx  # Image with lightbox
      video-block.tsx  # Video player
      audio-block.tsx  # Audio player
      code-block.tsx   # Code with copy

lib/
  blog.ts              # Blog CRUD helpers
  storage.ts           # Media upload helpers
  supabase/
    client.ts          # Browser client
    server.ts          # Server client
    middleware.ts      # Auth middleware
    types.ts           # TypeScript types

supabase/
  schema.sql           # Database schema
  storage.sql          # Storage policies
```
