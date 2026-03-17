'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function followUser(targetUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }
  if (user.id === targetUserId) return { error: 'You cannot follow yourself' }

  const { error } = await supabase.from('follows').insert({
    follower_id: user.id,
    following_id: targetUserId
  })

  if (error) return { error: error.message }

  revalidatePath(`/profile/${targetUserId}`)
  revalidatePath(`/profile`)
  return { success: true }
}

export async function unfollowUser(targetUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)

  if (error) return { error: error.message }

  revalidatePath(`/profile/${targetUserId}`)
  revalidatePath(`/profile`)
  return { success: true }
}

export async function getFollowStats(userId: string) {
  const supabase = await createClient()

  const { count: followersCount, error: followersError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)

  const { count: followingCount, error: followingError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)

  if (followersError || followingError) {
    return { 
      error: followersError?.message || followingError?.message, 
      followers: 0, 
      following: 0 
    }
  }

  return { 
    followers: followersCount || 0, 
    following: followingCount || 0 
  }
}

export async function isFollowing(targetUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single()

  return !!data && !error
}
