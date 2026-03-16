import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types'
import PostCard from '@/components/shared/PostCard'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: posts } = await supabase
    .from('posts')
    .select(`*, creator:profiles(*), likes(*), saves(*)`)
    .eq('creator_id', user!.id)
    .order('created_at', { ascending: false })

  const initials = profile?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="feed-layout">
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
      }}>
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={profile.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 700, color: '#fff',
          }}>
            {initials}
          </div>
        )}
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.2rem' }}>{profile?.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.4rem' }}>@{profile?.username}</p>
          {profile?.bio && <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{profile.bio}</p>}
          <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {posts?.length ?? 0} posts
          </p>
        </div>
      </div>

      <p className="feed-header">Posts</p>

      {(!posts || posts.length === 0) ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Share your first moment!</p>
        </div>
      ) : (
        posts.map((post: Post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
