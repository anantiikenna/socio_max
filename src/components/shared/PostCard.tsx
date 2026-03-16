'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Post } from '@/types'
import { likePost, unlikePost, savePost, unsavePost } from '@/app/actions/posts'

type Props = { post: Post }

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function PostCard({ post }: Props) {
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

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

  const creator = post.creator
  const initials = creator?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-card-header">
        {creator?.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.name}
            width={40}
            height={40}
            className="post-avatar"
          />
        ) : (
          <div className="post-avatar-placeholder">{initials}</div>
        )}
        <div className="post-meta">
          <p className="post-creator">{creator?.name ?? 'Unknown'}</p>
          {post.location && <p className="post-location">{post.location}</p>}
        </div>
      </div>

      {/* Image */}
      {post.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image_url} alt={post.caption ?? 'Post'} className="post-image" />
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
    </article>
  )
}
