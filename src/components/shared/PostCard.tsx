'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Post, Profile } from '@/types'
import { likePost, unlikePost, savePost, unsavePost } from '@/app/actions/posts'
import CommentSection from './CommentSection'

type Props = { 
  post: Post
  currentUserId?: string
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function PostCard({ post, currentUserId }: Props) {
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0)
  const isLiked = post.likes?.some(l => l.user_id === currentUserId)
  const isSaved = post.saves?.some(s => s.user_id === currentUserId)
  const [liked, setLiked] = useState(isLiked)
  const [saved, setSaved] = useState(isSaved)
  const [showComments, setShowComments] = useState(false)

  async function handleLike() {
    if (liked) {
      setLiked(false)
      setLikeCount((c) => c - 1)
      await unlikePost(post.id)
    } else {
      setLiked(true)
      setLikeCount((c) => c + 1)
      await likePost(post.id)
    }
  }

  async function handleSave() {
    if (saved) {
      setSaved(false)
      await unsavePost(post.id)
    } else {
      setSaved(true)
      await savePost(post.id)
    }
  }

  const creator = post.creator as Profile
  const initials = creator?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-card-header">
        <Link href={`/profile/${creator?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          {creator?.avatar_url ? (
            <Image src={creator.avatar_url} alt={creator.name || 'avatar'} width={40} height={40} className="avatar shadow-sm" />
          ) : (
            <div className="avatar-placeholder">{initials}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-bold text-sm">{creator?.name ?? 'Unknown'}</span>
            {post.location && <span className="text-xs text-muted">{post.location}</span>}
          </div>
        </Link>
      </div>

      {/* Image or Video */}
      {post.image_url && (
        post.media_type === 'video' ? (
          <video 
            src={post.image_url} 
            controls 
            className="post-image"
            style={{ backgroundColor: '#000' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image_url} alt={post.caption ?? 'Post'} className="post-image" />
        )
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          id={`like-btn-${post.id}`}
          className={`post-action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {likeCount}
        </button>

        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-14h.1c.1 0 .2 0 .3 0z"/>
            <path d="M7 11h.01M12 11h.01M17 11h.01"/>
          </svg>
          {post.comments?.length || 0}
        </button>

        <button
          id={`save-btn-${post.id}`}
          className={`post-action-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          Save
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="post-caption">
          <strong>{creator?.username ?? creator?.name}</strong>
          {post.caption}
        </p>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <p className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-tag">#{tag}</span>
          ))}
        </p>
      )}

      <p className="post-time">{timeAgo(post.created_at)}</p>

      {showComments && (
        <CommentSection postId={post.id} currentUserId={currentUserId} />
      )}
    </article>
  )
}
