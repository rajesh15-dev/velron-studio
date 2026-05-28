create extension if not exists "pgcrypto";



create table if not exists reels (

  id uuid primary key default gen_random_uuid(),

  slug text unique not null,

  instagram_url text not null,

  reel_image text,

  created_at timestamptz default now()

);



create table if not exists products (

  id uuid primary key default gen_random_uuid(),

  reel_id uuid references reels(id) on delete cascade,

  title text,

  image text,

  affiliate_url text,

  created_at timestamptz default now()

);