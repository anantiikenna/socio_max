# Socio Max: Next.js & Supabase Rewrite

Welcome to the newly migrated Socio Max! This version has been rebuilt from the ground up using **Next.js 16** and **Supabase** for a faster, more scalable, and premium experience.

## Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: Vanilla CSS with a premium dark theme
- **Icons**: [Lucide React](https://lucide.dev/) (referenced in components)

## Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### 2. Environment Setup
Create a `.env.local` file in the root directory (one should already be there if you're using the provided files) and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Schema setup
To set up your database tables, security policies, and storage buckets:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** for your project.
3. Copy the contents of [`supabase/schema.sql`](./supabase/schema.sql) and run it.
4. Verify that the `profiles`, `posts`, `likes`, `saves`, and `follows` tables were created.
5. Verify that the `avatars` and `posts` storage buckets are created and set to **Public**.

### 4. Installation
Install the dependencies:
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## Key Features
- **Feed**: High-performance post feed with server-side rendering.
- **Explore**: Search and discover new content.
- **Post Creation**: Easy image uploading to Supabase Storage.
- **Optimistic UI**: Instant feedback on likes and saves.
- **Profile Management**: Customizable user profiles.

## Migration Notes
- Legacy Appwrite code has been removed.
- All core logic now resides in `src/app/actions` (Server Actions) and `lib/supabase`.
- Authentication is handled via Supabase SSR utilities.

