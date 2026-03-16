export type User = {
  id: string
  email: string
  name: string
  username: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export type Post = {
  id: string
  creator_id: string
  caption: string | null
  image_url: string | null
  location: string | null
  tags: string[]
  created_at: string
  creator?: User
  likes?: Like[]
  saves?: Save[]
}

export type Like = {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export type Save = {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export type Follow = {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}
