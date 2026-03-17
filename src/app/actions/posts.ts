'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getCurrentUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, userId: user?.id }
}

export async function likePost(postId: string) {
  const { supabase, userId } = await getCurrentUserId()
  if (!userId) return
  await supabase.from('likes').insert({ post_id: postId, user_id: userId })
  revalidatePath('/')
}

export async function unlikePost(postId: string) {
  const { supabase, userId } = await getCurrentUserId()
  if (!userId) return
  await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId)
  revalidatePath('/')
}

export async function savePost(postId: string) {
  const { supabase, userId } = await getCurrentUserId()
  if (!userId) return
  await supabase.from('saves').insert({ post_id: postId, user_id: userId })
  revalidatePath('/saved')
}

export async function unsavePost(postId: string) {
  const { supabase, userId } = await getCurrentUserId()
  if (!userId) return
  await supabase.from('saves').delete().eq('post_id', postId).eq('user_id', userId)
  revalidatePath('/saved')
}

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check if video uploads are allowed
  const { data: settings } = await supabase
    .from('app_settings')
    .select('allow_video_uploads')
    .single()

  const caption  = formData.get('caption')  as string
  const location = formData.get('location') as string
  const tags     = (formData.get('tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const file = formData.get('image') as File | null // This could be image or video
  let imageUrl: string | null = null
  let mediaType: 'image' | 'video' = 'image'

  if (file && file.size > 0) {
    const isVideo = file.type.startsWith('video/')
    if (isVideo && settings && !settings.allow_video_uploads) {
      return { error: 'Video uploads are currently disabled by the administrator.' }
    }
    
    mediaType = isVideo ? 'video' : 'image'
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    
    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(path, file, { upsert: false })

    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage.from('posts').getPublicUrl(path)
    imageUrl = urlData.publicUrl
  }

  const { error } = await supabase.from('posts').insert({
    creator_id: user.id,
    caption,
    location,
    tags,
    image_url: imageUrl,
    media_type: mediaType,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function getPosts(limit: number = 10, offset: number = 0) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      creator:profiles(*),
      likes(*),
      saves(*),
      comments(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return { error: error.message, data: [] }
  }

  return { data: data || [] }
}
