'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Comment } from '@/types'
import { addComment, getComments, deleteComment } from '@/app/actions/comments'

type Props = {
  postId: string
  currentUserId?: string
}

export default function CommentSection({ postId, currentUserId }: Props) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  // Query for comments
  const { data: comments = [], isLoading: fetching } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await getComments(postId)
      return res.data || []
    },
  })

  // Mutation for adding a comment
  const addMutation = useMutation({
    mutationFn: (text: string) => addComment(postId, text),
    onMutate: async (newText) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      const previousComments = queryClient.getQueryData(['comments', postId])

      // Optimistic update
      queryClient.setQueryData(['comments', postId], (old: any) => [
        ...(old || []),
        {
          id: 'temp-' + Date.now(),
          content: newText,
          post_id: postId,
          user_id: currentUserId,
          created_at: new Date().toISOString(),
          user: { id: currentUserId, username: 'You', name: 'You', avatar_url: null }
        }
      ])

      return { previousComments }
    },
    onError: (err, newText, context) => {
      queryClient.setQueryData(['comments', postId], context?.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setContent('')
    },
  })

  // Mutation for deleting a comment
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      const previousComments = queryClient.getQueryData(['comments', postId])

      queryClient.setQueryData(['comments', postId], (old: any) => 
        old?.filter((c: any) => c.id !== commentId)
      )

      return { previousComments }
    },
    onError: (err, commentId, context) => {
      queryClient.setQueryData(['comments', postId], context?.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || addMutation.isPending) return
    addMutation.mutate(content)
  }

  async function handleDelete(commentId: string) {
    if (!confirm('Are you sure?')) return
    deleteMutation.mutate(commentId)
  }

  return (
    <div className="comment-section" style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.75rem 0' }}>Comments</p>
      
      {fetching && comments.length === 0 ? (
        <div className="skeleton" style={{ height: 40, marginBottom: '0.5rem' }}></div>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No comments yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ display: 'flex', gap: '0.75rem', opacity: comment.id.toString().startsWith('temp-') ? 0.6 : 1 }}>
              <Link href={`/profile/${comment.user_id}`} style={{ flexShrink: 0 }}>
                {comment.user?.avatar_url ? (
                   <Image src={comment.user.avatar_url} alt={comment.user.name || 'User'} width={24} height={24} style={{ borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff' }}>
                    {comment.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </Link>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8rem' }}>
                  <Link href={`/profile/${comment.user_id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, marginRight: '0.4rem' }}>
                     {comment.user?.username || comment.user?.name}
                  </Link>
                  {comment.content}
                </p>
                {currentUserId === comment.user_id && !comment.id.toString().startsWith('temp-') && (
                  <button 
                    onClick={() => handleDelete(comment.id)} 
                    disabled={deleteMutation.isPending}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.7rem', cursor: 'pointer', padding: 0, marginTop: '2px', opacity: deleteMutation.isPending ? 0.5 : 1 }}
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
        <button type="submit" className="auth-btn" disabled={addMutation.isPending} style={{ width: 'auto', padding: '0 1rem', fontSize: '0.85rem' }}>
          {addMutation.isPending ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  )
}

