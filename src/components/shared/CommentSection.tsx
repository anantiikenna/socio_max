'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Comment } from '@/types'
import { addComment, getComments, deleteComment } from '@/app/actions/comments'

type Props = {
  postId: string
  currentUserId?: string
}

export default function CommentSection({ postId, currentUserId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function loadComments() {
      const res = await getComments(postId)
      if (res.data) setComments(res.data)
      setFetching(false)
    }
    loadComments()
  }, [postId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || loading) return

    setLoading(true)
    const res = await addComment(postId, content)
    
    if (res.success) {
      setContent('')
      // Reload comments
      const updated = await getComments(postId)
      if (updated.data) setComments(updated.data)
    } else {
      alert(res.error || 'Failed to post comment')
    }
    setLoading(false)
  }

  async function handleDelete(commentId: string) {
    if (!confirm('Are you sure?')) return
    const res = await deleteComment(commentId)
    if (res.success) {
      setComments(comments.filter(c => c.id !== commentId))
    }
  }

  return (
    <div className="comment-section" style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.75rem 0' }}>Comments</p>
      
      {fetching ? (
        <div className="skeleton" style={{ height: 40, marginBottom: '0.5rem' }}></div>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No comments yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ display: 'flex', gap: '0.75rem' }}>
              {comment.user?.avatar_url ? (
                <Image src={comment.user.avatar_url} alt={comment.user.name} width={24} height={24} style={{ borderRadius: '50%', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyItems: 'center', fontSize: '0.6rem', color: '#fff', flexShrink: 0, justifyContent: 'center' }}>
                  {comment.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8rem' }}>
                  <strong style={{ marginRight: '0.4rem' }}>{comment.user?.username || comment.user?.name}</strong>
                  {comment.content}
                </p>
                {currentUserId === comment.user_id && (
                  <button 
                    onClick={() => handleDelete(comment.id)} 
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.7rem', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="auth-input"
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
        />
        <button type="submit" className="auth-btn" disabled={loading} style={{ width: 'auto', padding: '0 1rem', fontSize: '0.85rem' }}>
          Post
        </button>
      </form>
    </div>
  )
}
