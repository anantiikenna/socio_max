'use client'

import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { Post } from '@/types'
import PostCard from './PostCard'
import { getPosts } from '@/app/actions/posts'

type Props = {
  initialPosts: Post[]
  currentUserId?: string
}

export default function InfiniteFeed({ initialPosts, currentUserId }: Props) {
  const loaderRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = initialPosts.length }) => {
      const res = await getPosts(10, pageParam as number)
      return (res.data as Post[]) || []
    },
    initialPageParam: initialPosts.length,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined
      const totalLoaded = initialPosts.length + allPages.reduce((acc, page) => acc + page.length, 0)
      return totalLoaded
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [0]
    }
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allPosts = data?.pages.flat() || initialPosts

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
      
      {hasNextPage && (
        <div ref={loaderRef} style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
          <div className="skeleton" style={{ height: 100, width: '100%', borderRadius: 'var(--radius)' }}></div>
        </div>
      )}
      
      {!hasNextPage && allPosts.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0', fontSize: '0.9rem' }}>
          You&apos;ve reached the end of the feed!
        </p>
      )}
    </div>
  )
}
