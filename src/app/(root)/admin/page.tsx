'use client'

import { useEffect, useState } from 'react'
import { getAdminAnalytics, toggleVideoUploads, deletePostByAdmin } from '@/app/actions/admin'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await getAdminAnalytics()
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleVideo(enabled: boolean) {
    setToggling(true)
    try {
      await toggleVideoUploads(enabled)
      fetchData()
    } catch (err) {
      alert('Failed to update settings')
    } finally {
      setToggling(false)
    }
  }

  async function handleDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    setDeletingId(postId)
    try {
      await deletePostByAdmin(postId)
      fetchData()
    } catch (err) {
      alert('Failed to delete post')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return (
    <div className="dashboard-layout">
      <div className="feed-column">
        <div className="skeleton" style={{ height: 400 }}></div>
      </div>
    </div>
  )

  const trendEntries = Object.entries(data?.trends || {}).sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
  const maxTrend = Math.max(...trendEntries.map((e: any) => e[1] as number), 1)

  return (
    <div className="dashboard-layout">
      <div className="feed-column">
        <p className="feed-header">Admin Dashboard</p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="post-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Posts</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{data?.totalPosts}</h2>
          </div>
          <div className="post-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Total Users</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{data?.totalUsers}</h2>
          </div>
        </div>

        {/* Analytics Graph */}
        <div className="post-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Post Activity (Last 30 Days)</h3>
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '0 0.5rem' }}>
            {trendEntries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent activity data</p>
            ) : (
              trendEntries.map(([date, count]: any) => (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${(count / maxTrend) * 100}%`, 
                    background: 'linear-gradient(to top, var(--accent), var(--accent-2))', 
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                    transition: 'height 0.5s ease'
                  }}></div>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', transform: 'rotate(-45deg)', marginTop: '0.5rem' }}>
                    {date.split('/')[1]}/{date.split('/')[0]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Moderation: Recent Posts */}
        <div className="post-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Recent Posts Moderation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data?.recentPosts?.map((post: any) => (
              <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <img 
                  src={post.image_url || '/placeholder-post.png'} 
                  alt="" 
                  style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{post.caption?.substring(0, 40) || 'No caption'}...</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {post.creator?.name || post.creator?.username}</p>
                </div>
                <button 
                  className="auth-btn" 
                  onClick={() => handleDeletePost(post.id)}
                  disabled={deletingId === post.id}
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--danger)' }}
                >
                  {deletingId === post.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* App Configuration */}
        <div className="post-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Global Configuration</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Allow Video Uploads</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Enable or disable video attachments for new posts</p>
            </div>
            <button 
              onClick={() => handleToggleVideo(!data?.settings?.allow_video_uploads)}
              disabled={toggling}
              className="auth-btn"
              style={{
                width: 'auto',
                padding: '0.5rem 1.25rem',
                background: data?.settings?.allow_video_uploads ? 'var(--danger)' : 'var(--accent)',
              }}
            >
              {toggling ? 'Updating...' : data?.settings?.allow_video_uploads ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      <div className="right-sidebar">
        <h3 className="creators-header">Recently Joined Users</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data?.recentUsers?.map((u: any) => (
            <div key={u.id} className="post-card" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="post-avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                {u.name?.[0] || u.username?.[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name || u.username}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>@{u.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

