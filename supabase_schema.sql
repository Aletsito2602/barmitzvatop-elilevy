-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public User Data)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  study_plan text default 'alef',
  preferences jsonb default '{"language": "es", "notifications": true, "timezone": "America/Panama"}',
  personal_parasha jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLASSES (Course Content)
create table public.classes (
  id uuid default uuid_generate_v4() primary key,
  class_number integer not null unique,
  title text not null,
  description text,
  youtube_link text,
  video_type text default 'youtube', 
  duration integer, 
  difficulty text default 'basico', 
  category text default 'alef',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLASS COMPLETIONS (Track which classes a user has finished)
create table public.class_completions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  class_number integer not null, 
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, class_number)
);

-- USER STATS / PROGRESS (Cached metrics)
create table public.user_stats (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  lessons_completed integer default 0,
  total_lessons integer default 24,
  study_hours numeric default 0,
  current_level text default 'basico',
  current_class integer default 1,
  last_watched_class integer,
  skill_progress jsonb default '{"prayers": 0, "taamim": 0, "general": 0, "hebrew": 0}',
  current_streak integer default 0,
  last_study_date timestamp with time zone,
  achievements jsonb default '[]',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PARASHA REQUESTS (Forms submitted by users)
create table public.parasha_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  birth_date date not null,
  birth_time text,
  birth_place text,
  barmitzva_location text,
  status text default 'pendiente', 
  assigned_parasha jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  processed_at timestamp with time zone
);

-- ACTIVITIES (Activity Log)
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  description text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FORUM MESSAGES (For ComunidadPage)
create table public.forum_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text, 
  category text not null, 
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COMMUNITY POSTS (If used by communityService)
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text,
  category text,
  likes integer default 0,
  replies_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_activity timestamp with time zone default timezone('utc'::text, now())
);

-- FORMS (Contact/Checkout submissions)
create table public.forms (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text,
  message text,
  phone text,
  country text,
  type text not null, -- 'contact' or 'checkout'
  data jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CHAT MESSAGES (For chatService)
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  room_id text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text,
  user_image text,
  message text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ROW LEVEL SECURITY (RLS) POLICIES

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Classes
alter table public.classes enable row level security;
create policy "Classes are viewable by everyone" on public.classes for select using (true);

-- Class Completions
alter table public.class_completions enable row level security;
create policy "Users manage own completions" on public.class_completions for all using (auth.uid() = user_id);

-- User Stats
alter table public.user_stats enable row level security;
create policy "Users manage own stats" on public.user_stats for all using (auth.uid() = user_id);

-- Parasha Requests
alter table public.parasha_requests enable row level security;
create policy "Users manage own requests" on public.parasha_requests for all using (auth.uid() = user_id);
create policy "Users can create requests" on public.parasha_requests for insert with check (auth.uid() = user_id);

-- Activities
alter table public.activities enable row level security;
create policy "Users read own activities" on public.activities for select using (auth.uid() = user_id);
create policy "Users insert own activities" on public.activities for insert with check (auth.uid() = user_id);

-- Forum Messages
alter table public.forum_messages enable row level security;
create policy "Forum messages viewable by everyone" on public.forum_messages for select using (true);
create policy "Authenticated users can insert messages" on public.forum_messages for insert with check (auth.role() = 'authenticated');

-- Community Posts
alter table public.community_posts enable row level security;
create policy "Community posts viewable by everyone" on public.community_posts for select using (true);
create policy "Authenticated users can insert posts" on public.community_posts for insert with check (auth.role() = 'authenticated');

-- Forms
alter table public.forms enable row level security;
create policy "Public can insert forms" on public.forms for insert with check (true);
create policy "Only service role can read forms" on public.forms for select using (auth.role() = 'service_role'); 

-- Chat Messages
alter table public.chat_messages enable row level security;
create policy "Authenticated can read chat" on public.chat_messages for select using (auth.role() = 'authenticated');
create policy "Authenticated can insert chat" on public.chat_messages for insert with check (auth.role() = 'authenticated');


-- TRIGGERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  insert into public.user_stats (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
