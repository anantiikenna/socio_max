import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types'
import PostCard from '@/components/shared/PostCard'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(`*, creator:profiles(*), likes(*), saves(*)`)
    .order('created_at', { ascending: false })
    .limit(30)

  if (q) {
    query = query.or(`caption.ilike.%${q}%,location.ilike.%${q}%`)
  }

  const { data: posts } = await query

  return (
    <div className="feed-layout">
      <p className="feed-header">Explore</p>

      <form method="GET" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search posts, locations…"
          className="auth-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="auth-btn" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          Search
        </button>
      </form>

      {(!posts || posts.length === 0) ? (
        <div className="empty-state">
          <h2>{q ? `No results for "${q}"` : 'Nothing here yet'}</h2>
          <p>Try a different search term.</p>
        </div>
      ) : (
        posts.map((post: Post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
