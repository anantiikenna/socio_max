import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Post } from '@/types'
import PostCard from '@/components/shared/PostCard'
import ProfileHeader from '@/components/shared/ProfileHeader'
import { getFollowStats, isFollowing } from '@/app/actions/follows'

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: targetUserId } = await params
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) return null

  // Fetch the target user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  if (!profile) {
    return notFound()
  }

  // Fetch target user's posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`*, creator:profiles(*), likes(*), saves(*), comments(*)`)
    .eq('creator_id', targetUserId)
    .order('created_at', { ascending: false })

  // Fetch follow stats and relationship
  const stats = await getFollowStats(targetUserId)
  const followingState = await isFollowing(targetUserId)
  
  const isOwnProfile = authUser.id === targetUserId

  return (
    <div className="feed-layout">
      <ProfileHeader 
        profile={profile}
        isFollowingInitial={followingState}
        followersCount={stats.followers}
        followingCount={stats.following}
        postsCount={posts?.length ?? 0}
        isOwnProfile={isOwnProfile}
      />

      <p className="feed-header">Posts</p>

      {(!posts || posts.length === 0) ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>{isOwnProfile ? 'Share your first moment!' : 'This user hasn\'t posted anything yet.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} currentUserId={authUser.id} />
          ))}
        </div>
      )}
    </div>
  )
}
