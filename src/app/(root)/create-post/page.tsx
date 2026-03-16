'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions/posts'

export default function CreatePostPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createPost(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="feed-layout">
      <p className="feed-header">Create Post</p>

      <div className="post-card" style={{ padding: '1.5rem' }}>
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Image Upload */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Photo</span>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="post-image" style={{ borderRadius: 'var(--radius-sm)' }} />
            ) : (
              <div style={{
                height: 200,
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '2px dashed var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}>
                Click to select image
              </div>
            )}
            <input name="image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>

          <textarea
            name="caption"
            placeholder="Write a caption…"
            rows={3}
            className="auth-input"
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
          <input name="location" type="text" placeholder="Add location" className="auth-input" />
          <input name="tags" type="text" placeholder="Tags (comma separated)" className="auth-input" />

          {error && <p className="auth-error">{error}</p>}

          <button id="create-post-btn" type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sharing…' : 'Share Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
