# Magi Sharma - Portfolio Website

A modern, minimalist portfolio website built with Next.js 16, featuring a full-featured blog system powered by Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)

## Features

### Portfolio
- **Hero Section** - Dynamic intro with live local time
- **Projects Showcase** - Horizontal scroll gallery with drag interaction
- **About Section** - Stats and expertise highlights
- **Skills Section** - Technology stack display
- **Contact Form** - EmailJS integration for direct messaging
- **Responsive Design** - Optimized for all devices

### Blog System
- **Rich Text Editor** - Tiptap-powered editor with formatting tools
- **Media Support** - Images, videos, audio, and YouTube embeds
- **SEO Optimized** - Meta titles, descriptions, and Open Graph tags
- **Admin Dashboard** - Full CRUD operations for posts
- **Media Library** - Upload and manage media files
- **Tags and Categories** - Organize content effectively

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Editor:** Tiptap
- **Email:** EmailJS
- **Deployment:** Vercel (Serverless)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/magi8101/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # EmailJS
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Create a storage bucket named `blog-media` (public)
   - Create an admin user via Supabase Auth

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
portfolio-website/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   ├── blog/           # Public blog pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/
│   ├── admin/          # Admin components
│   ├── blog/           # Blog components
│   ├── ui/             # UI components (shadcn)
│   └── *.tsx           # Section components
├── lib/
│   ├── supabase/       # Supabase clients and types
│   ├── blog.ts         # Blog helper functions
│   ├── storage.ts      # Storage utilities
│   └── utils.ts        # Utility functions
├── public/             # Static assets
└── supabase/
    └── schema.sql      # Database schema
```

## Admin Access

Access the admin panel at `/admin`. Login at `/auth/login` with your Supabase Auth credentials.

### Admin Features
- **Dashboard** - Overview of posts and stats
- **Posts** - Create, edit, publish, and delete blog posts
- **Media Library** - Upload and manage media files

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The application is fully serverless and works natively with Vercel infrastructure.

## Blog Setup

For detailed blog setup instructions, see [BLOG_SETUP.md](./BLOG_SETUP.md).

## Customization

### Colors
Edit CSS variables in `app/globals.css` to customize the color scheme.

### Content
- Update project data in `components/projects-section.tsx`
- Modify personal info in `components/hero-section.tsx` and `components/about-section.tsx`
- Edit social links in `components/contact-section.tsx`

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Magi Sharma**
- GitHub: [@magi8101](https://github.com/magi8101)
- LinkedIn: [Magi Sharma](https://www.linkedin.com/in/magi-sharma/)
- Email: sharmamagi0@gmail.com
