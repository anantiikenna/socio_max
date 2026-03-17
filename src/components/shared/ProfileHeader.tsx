'use client'

import { useState } from 'react'
import Image from 'next/image'
import { followUser, unfollowUser } from '@/app/actions/follows'
import type { Profile } from '@/types'

type Props = {
  profile: Profile
  isFollowingInitial: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  isOwnProfile: boolean
}

export default function ProfileHeader({
  profile,
  isFollowingInitial,
  followersCount: initialFollowers,
  followingCount,
  postsCount,
  isOwnProfile
}: Props) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
  const [followers, setFollowers] = useState(initialFollowers)
  const [loading, setLoading] = useState(false)

  const initials = profile.name?.[0]?.toUpperCase() ?? '?'

  const handleFollowToggle = async () => {
    if (loading) return
    setLoading(true)

    // Optimistic UI update
    const newFollowingState = !isFollowing
    setIsFollowing(newFollowingState)
    setFollowers(prev => newFollowingState ? prev + 1 : prev - 1)

    const res = newFollowingState 
      ? await followUser(profile.id)
      : await unfollowUser(profile.id)

    if (res.error) {
      // Rollback on error
      setIsFollowing(!newFollowingState)
      setFollowers(prev => !newFollowingState ? prev + 1 : prev - 1)
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="profile-header" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginBottom: '2rem',
      padding: '2rem',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {profile.avatar_url ? (
          <Image 
            src={profile.avatar_url} 
            alt={profile.name} 
            width={120} 
            height={120} 
            style={{ borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent)' }} 
          />
        ) : (
          <div style={{
            width: 120, height: 120, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', fontWeight: 700, color: '#fff',
            border: '4px solid var(--accent)',
          }}>
            {initials}
          </div>
        )}

        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.name}</h1>
            
            {!isOwnProfile ? (
              <button 
                onClick={handleFollowToggle}
                disabled={loading}
                className={isFollowing ? 'auth-btn-secondary' : 'auth-btn'}
                style={{ 
                  width: 'auto', 
                  padding: '0.5rem 1.5rem', 
                  fontSize: '0.9rem',
                  borderRadius: '20px',
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              <button 
                className="auth-btn-secondary"
                style={{ 
                  width: 'auto', 
                  padding: '0.5rem 1.5rem', 
                  fontSize: '0.9rem',
                  borderRadius: '20px',
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.8rem' }}>@{profile.username}</p>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            <div><strong style={{ fontSize: '1.1rem' }}>{postsCount}</strong> <span style={{ color: 'var(--text-muted)' }}>posts</span></div>
            <div><strong style={{ fontSize: '1.1rem' }}>{followers}</strong> <span style={{ color: 'var(--text-muted)' }}>followers</span></div>
            <div><strong style={{ fontSize: '1.1rem' }}>{followingCount}</strong> <span style={{ color: 'var(--text-muted)' }}>following</span></div>
          </div>

          {profile.bio && <p style={{ fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '500px' }}>{profile.bio}</p>}
        </div>
      </div>
    </div>
  )
}
