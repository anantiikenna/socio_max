'use client'

import { useEffect, useState } from 'react'
import { getAdminAnalytics, toggleVideoUploads } from '@/app/actions/admin'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

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

  if (loading) return <div className="feed-layout"><div className="skeleton" style={{ height: 400 }}></div></div>

  const trendEntries = Object.entries(data?.trends || {}).sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
  const maxTrend = Math.max(...trendEntries.map((e: any) => e[1] as number), 1)

  return (
    <div className="feed-layout">
      <p className="feed-header">Admin Dashboard</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
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
        <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '0 1rem' }}>
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
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', transform: 'rotate(-45deg)', marginTop: '0.5rem' }}>
                  {date.split('/')[1]}/{date.split('/')[0]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings section */}
      <div className="post-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>App Configuration</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Allow Video Uploads</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Enable or disable video attachments for new posts</p>
          </div>
          <button 
            onClick={() => handleToggleVideo(!data?.settings?.allow_video_uploads)}
            disabled={toggling}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: data?.settings?.allow_video_uploads ? 'var(--danger)' : 'var(--accent)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {toggling ? 'Updating...' : data?.settings?.allow_video_uploads ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  )
}
