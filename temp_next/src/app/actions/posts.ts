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

  const caption  = formData.get('caption')  as string
  const location = formData.get('location') as string
  const tags     = (formData.get('tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const file = formData.get('image') as File | null
  let imageUrl: string | null = null

  if (file && file.size > 0) {
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
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}
