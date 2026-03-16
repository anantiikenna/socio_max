-- ============================================================
-- Socio Max: Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  name       text not null,
  username   text not null unique,
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- POSTS
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  caption    text,
  image_url  text,
  location   text,
  tags       text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- LIKES
create table if not exists public.likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- SAVES
create table if not exists public.saves (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- FOLLOWS
create table if not exists public.follows (
  id           uuid primary key default gen_random_uuid(),
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique(follower_id, following_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts    enable row level security;
alter table public.likes    enable row level security;
alter table public.saves    enable row level security;
alter table public.follows  enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Public profiles are viewable" on public.profiles for select using (true);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);

-- Posts: anyone can read, only owner can insert/update/delete
create policy "Public posts are viewable"   on public.posts for select using (true);
create policy "Authenticated users can create posts" on public.posts for insert with check (auth.uid() = creator_id);
create policy "Owners can update posts"     on public.posts for update using (auth.uid() = creator_id);
create policy "Owners can delete posts"     on public.posts for delete using (auth.uid() = creator_id);

-- Likes
create policy "Public likes viewable"  on public.likes for select using (true);
create policy "Auth users can like"    on public.likes for insert with check (auth.uid() = user_id);
create policy "Auth users can unlike"  on public.likes for delete using (auth.uid() = user_id);

-- Saves
create policy "Public saves viewable"  on public.saves for select using (true);
create policy "Auth users can save"    on public.saves for insert with check (auth.uid() = user_id);
create policy "Auth users can unsave"  on public.saves for delete using (auth.uid() = user_id);

-- Follows
create policy "Public follows viewable"  on public.follows for select using (true);
create policy "Auth users can follow"    on public.follows for insert with check (auth.uid() = follower_id);
create policy "Auth users can unfollow"  on public.follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'username', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE: create buckets for avatars and post images
-- ============================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('posts',   'posts',   true) on conflict do nothing;
