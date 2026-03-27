import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types'
import Link from 'next/link'

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
    <div className="feed-layout" style={{ maxWidth: '1000px' }}>
      <p className="feed-header">Popular Today</p>

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
        <div className="explore-grid">
          {posts.map((post: Post) => {
            const hasLiked = false // You would determine this from post.likes and currentUser
            const hasSaved = false

            return (
              <Link href={`/#post-${post.id}`} key={post.id} className="explore-card">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.caption || 'Post image'} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-surface)' }} />
                )}
                
                <div className="explore-overlay">
                  <div className="explore-author">
                    {post.creator?.avatar_url ? (
                      <img src={post.creator.avatar_url} alt="" className="post-avatar" />
                    ) : (
                      <div className="post-avatar-placeholder">
                        {post.creator?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="explore-author-name">{post.creator?.name || post.creator?.username}</span>
                  </div>
                  
                  <div className="explore-stats">
                    <span className={`explore-stat-btn ${hasLiked ? 'active' : ''}`}>
                      <svg viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"/>
                      </svg>
                      {post.likes?.length || 0}
                    </span>
                    <span className={`explore-stat-btn ${hasSaved ? 'active' : ''}`}>
                      <svg viewBox="0 0 24 24" fill={hasSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

