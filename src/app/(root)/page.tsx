import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types'
import InfiniteFeed from '@/components/shared/InfiniteFeed'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      creator:profiles(*),
      likes(*),
      saves(*),
      comments(*)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return (
      <div className="feed-layout">
        <div className="empty-state">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="feed-layout">
      <p className="feed-header">Home Feed</p>

      {(!posts || posts.length === 0) ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Follow people or create your first post to see it here.</p>
        </div>
      ) : (
        <InfiniteFeed initialPosts={posts as Post[]} currentUserId={user?.id} />
      )}
    </div>
  )
}
