'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getAdminAnalytics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw new Error('Not authorized')

  // Fetch analytics data
  const [
    { count: totalPosts },
    { count: totalUsers },
    { data: recentTrends },
    { data: settings }
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('created_at').order('created_at', { ascending: true }),
    supabase.from('app_settings').select('*').single()
  ])

  // Group trends by date (simple counts)
  const trendsByDate = recentTrends?.reduce((acc: any, post: any) => {
    const date = new Date(post.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return {
    totalPosts: totalPosts || 0,
    totalUsers: totalUsers || 0,
    trends: trendsByDate || {},
    settings: settings || { allow_video_uploads: true }
  }
}

export async function toggleVideoUploads(enabled: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw new Error('Not authorized')

  const { error } = await supabase
    .from('app_settings')
    .update({ allow_video_uploads: enabled })
    .eq('id', (await supabase.from('app_settings').select('id').single()).data?.id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/create-post')
}
