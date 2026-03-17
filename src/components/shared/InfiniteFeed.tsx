'use client'

import { useState, useEffect, useRef } from 'react'
import type { Post } from '@/types'
import PostCard from './PostCard'
import { getPosts } from '@/app/actions/posts'

type Props = {
  initialPosts: Post[]
  currentUserId?: string
}

export default function InfiniteFeed({ initialPosts, currentUserId }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [offset, setOffset] = useState(initialPosts.length)
  const [hasMore, setHasMore] = useState(initialPosts.length >= 10)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true)
          const currentOffset = offset
          const res = await getPosts(10, currentOffset)
          
          if (res.data && res.data.length > 0) {
            setPosts((prev) => [...prev, ...(res.data as Post[])])
            setOffset((prev) => prev + res.data.length)
            if (res.data.length < 10) setHasMore(false)
          } else {
            setHasMore(false)
          }
          setLoading(false)
        }
      },
      { threshold: 0.1 }
    )

    const currentLoader = loaderRef.current
    if (currentLoader) {
      observer.observe(currentLoader)
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader)
    }
  }, [hasMore, loading, offset])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
      
      {hasMore && (
        <div ref={loaderRef} style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
          <div className="skeleton" style={{ height: 100, width: '100%', borderRadius: 'var(--radius)' }}></div>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0', fontSize: '0.9rem' }}>
          You&apos;ve reached the end of the feed!
        </p>
      )}
    </div>
  )
}
