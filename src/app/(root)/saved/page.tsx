import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types'
import PostCard from '@/components/shared/PostCard'

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: saves } = await supabase
    .from('saves')
    .select(`post:posts(*, creator:profiles(*), likes(*), saves(*))`)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const posts = saves?.map((s: any) => Array.isArray(s.post) ? s.post[0] : s.post).filter(Boolean) as Post[] ?? []

  return (
    <div className="feed-layout">
      <p className="feed-header">Saved Posts</p>
      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>No saved posts</h2>
          <p>Tap the bookmark icon on any post to save it here.</p>
        </div>
      ) : (
        posts.map((post: Post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
