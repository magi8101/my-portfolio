-- Storage Bucket Setup for Supabase
-- Run this SQL in your Supabase SQL Editor after creating the bucket in the Dashboard

-- First, create the storage bucket via Supabase Dashboard:
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name it "blog-media"
-- 4. Make it PUBLIC (check "Public bucket")
-- 5. Click "Create bucket"

-- Then run these policies:

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-media');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-media');

-- Allow public access to view/download files
CREATE POLICY "Public can view media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-media');
