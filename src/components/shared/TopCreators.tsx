import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TopCreators() {
  const supabase = await createClient()

  // Fetch users, optionally sorting by follower count if we had it, but for now just recent or random
  const { data: creators } = await supabase
    .from('profiles')
    .select('*')
    .limit(6)

  if (!creators || creators.length === 0) return null

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // Helper for random background color from a set of nice colors
  const bgColors = [
    'linear-gradient(135deg, #14b8a6, #0f766e)', // Teal
    'linear-gradient(135deg, #a855f7, #7e22ce)', // Purple
    'linear-gradient(135deg, #f97316, #c2410c)', // Orange
    'linear-gradient(135deg, #ef4444, #b91c1c)', // Red
    'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
  ]

  return (
    <div className="right-sidebar">
      <h2 className="creators-header">Top Creators</h2>
      <div className="creators-grid">
        {creators.map((creator, i) => {
          const initials = getInitials(creator.name || creator.username || 'U')
          const bg = bgColors[i % bgColors.length]

          return (
            <Link href={`/profile/${creator.id}`} key={creator.id} className="creator-card">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.username}
                  className="creator-avatar-lg"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="creator-avatar-lg" style={{ background: bg }}>
                  {initials}
                </div>
              )}
              <div className="creator-name">{creator.name || creator.username}</div>
              <div className="creator-handle">@{creator.username}</div>
              
              <button 
                className="follow-btn-small" 
                onClick={(e) => {
                  e.preventDefault()
                  // In a real app, this would trigger a follow action
                }}
              >
                Follow
              </button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
