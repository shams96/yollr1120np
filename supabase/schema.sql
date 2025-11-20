-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- -----------------------------------------------------------------------------
-- 1. CAMPUSES & GEO
-- -----------------------------------------------------------------------------
create table public.campuses (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  zip_code text not null,
  location geography(point),
  type text check (type in ('university', 'high_school')),
  member_count integer default 0,
  is_active boolean default false, -- Unlocks at threshold (25 HS / 50 Uni)
  created_at timestamptz default now()
);

create table public.campus_weekly_stats (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  week_number integer not null, -- YYYYWW
  heist_submissions_count integer default 0,
  heist_votes_count integer default 0,
  moments_count integer default 0,
  bell_participation_rate float default 0,
  squad_xp_earned bigint default 0,
  mystery_boxes_opened integer default 0,
  created_at timestamptz default now(),
  unique(campus_id, week_number)
);

create table public.campus_legacy_stats (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null unique,
  total_heist_wins integer default 0,
  total_submissions bigint default 0,
  total_moments bigint default 0,
  total_reactions bigint default 0,
  total_sponsor_redemptions bigint default 0,
  total_kindness_completions bigint default 0,
  updated_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 2. SQUADS
-- -----------------------------------------------------------------------------
create table public.squads (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  name text not null,
  avatar_url text,
  type text check (type in ('dorm', 'major', 'club', 'greek', 'friend_group')),
  xp_total bigint default 0,
  created_by uuid, -- Circular ref handled later or allowed null
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 3. USERS & PROFILES
-- -----------------------------------------------------------------------------
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique, -- Can be null initially
  full_name text,
  avatar_url text,
  phone_number text, -- Synced from auth
  class_year integer, -- 2025, 2026, etc.
  campus_id uuid references public.campuses(id),
  squad_id uuid references public.squads(id),
  xp_total bigint default 0,
  current_streak integer default 0,
  last_streak_update timestamptz,
  heist_pass_xp integer default 0,
  created_at timestamptz default now()
);

-- Backfill created_by in squads
alter table public.squads add constraint fk_squads_creator foreign key (created_by) references public.users(id);

create table public.squad_members (
  id uuid default uuid_generate_v4() primary key,
  squad_id uuid references public.squads(id) not null,
  user_id uuid references public.users(id) not null,
  role text check (role in ('leader', 'member')) default 'member',
  joined_at timestamptz default now(),
  unique(squad_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 4. SPONSORS
-- -----------------------------------------------------------------------------
create table public.sponsors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo_url text,
  zip_code text,
  mascot_name text,
  mascot_metadata jsonb, -- { "icon": "pizza_goblin", "color": "#FF0000" }
  created_at timestamptz default now()
);

create table public.sponsor_offers (
  id uuid default uuid_generate_v4() primary key,
  sponsor_id uuid references public.sponsors(id) not null,
  title text not null,
  description text,
  type text check (type in ('discount', 'free_item', 'voucher', 'qr_hunt')),
  redemption_metadata jsonb, -- { "code": "YOLLR25", "qr_payload": "..." }
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 5. HEISTS (Weekly Cycle)
-- -----------------------------------------------------------------------------
create table public.heists (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  sponsor_id uuid references public.sponsors(id),
  week_number integer not null,
  theme text not null,
  description text,
  status text check (status in ('reveal', 'submission', 'voting', 'execution', 'completed')) default 'reveal',
  winner_submission_id uuid, -- FK added later
  starts_at timestamptz not null, -- Mon 09:00
  submission_ends_at timestamptz not null, -- Wed 23:59
  voting_ends_at timestamptz not null, -- Sun 23:59
  execution_ends_at timestamptz not null, -- Next Sun 23:59
  created_at timestamptz default now()
);

create table public.heist_submissions (
  id uuid default uuid_generate_v4() primary key,
  heist_id uuid references public.heists(id) not null,
  user_id uuid references public.users(id) not null,
  video_url text not null,
  thumbnail_url text,
  pitch_text text,
  guardrails_checked boolean default false,
  moderation_status text check (moderation_status in ('pending', 'approved', 'rejected', 'flagged')) default 'pending',
  vote_count integer default 0,
  created_at timestamptz default now()
);

alter table public.heists add constraint fk_heist_winner foreign key (winner_submission_id) references public.heist_submissions(id);

create table public.heist_votes (
  id uuid default uuid_generate_v4() primary key,
  heist_id uuid references public.heists(id) not null,
  submission_id uuid references public.heist_submissions(id) not null,
  user_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  unique(heist_id, user_id) -- One official vote per heist
);

-- -----------------------------------------------------------------------------
-- 6. POLLS
-- -----------------------------------------------------------------------------
create table public.polls (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  category text check (category in ('career', 'academic', 'trend', 'community')),
  question text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table public.poll_options (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) not null,
  text text not null,
  vote_count integer default 0
);

create table public.poll_votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) not null,
  option_id uuid references public.poll_options(id) not null,
  user_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  unique(poll_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 7. MOMENTS
-- -----------------------------------------------------------------------------
create table public.moments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  campus_id uuid references public.campuses(id) not null,
  heist_id uuid references public.heists(id), -- Optional, if Heist Moment
  video_url text not null,
  thumbnail_url text,
  caption text,
  type text check (type in ('daily', 'heist')),
  expires_at timestamptz not null, -- 24h
  is_flagged boolean default false,
  created_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- 8. REACTIONS
-- -----------------------------------------------------------------------------
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  moment_id uuid references public.moments(id),
  heist_submission_id uuid references public.heist_submissions(id),
  type text check (type in ('fire', 'funny', 'genius', 'star')) not null,
  campus_id uuid references public.campuses(id),
  squad_id uuid references public.squads(id),
  created_at timestamptz default now(),
  check (moment_id is not null or heist_submission_id is not null)
);

-- -----------------------------------------------------------------------------
-- 9. GAMIFICATION (Mystery Boxes, Rewards)
-- -----------------------------------------------------------------------------
create table public.mystery_boxes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  trigger_reason text, -- 'login', 'vote', 'streak'
  status text check (status in ('locked', 'ready', 'opened')) default 'locked',
  reward_type text, -- 'xp', 'cosmetic', 'perk'
  reward_payload jsonb, -- { "xp": 500 } or { "skin": "neon_border" }
  opened_at timestamptz,
  created_at timestamptz default now()
);

create table public.user_rewards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  reward_type text not null,
  metadata jsonb,
  acquired_at timestamptz default now()
);

-- -----------------------------------------------------------------------------
-- RLS POLICIES
-- -----------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.campuses enable row level security;
alter table public.squads enable row level security;
alter table public.heists enable row level security;
alter table public.heist_submissions enable row level security;
alter table public.polls enable row level security;
alter table public.moments enable row level security;
alter table public.reactions enable row level security;

-- Helper: Get current user's campus
create or replace function get_auth_campus_id()
returns uuid as $$
  select campus_id from public.users where id = auth.uid()
$$ language sql security definer;

-- USERS
create policy "Public profiles" on public.users for select using (true);
create policy "Update own profile" on public.users for update using (auth.uid() = id);

-- CAMPUSES
create policy "Read campuses" on public.campuses for select using (true);

-- HEISTS
create policy "Read heists by campus" on public.heists 
  for select using (campus_id = get_auth_campus_id());

-- SUBMISSIONS
create policy "Read submissions by campus" on public.heist_submissions
  for select using (
    exists (select 1 from public.heists h where h.id = heist_id and h.campus_id = get_auth_campus_id())
  );
create policy "Create submission" on public.heist_submissions
  for insert with check (auth.uid() = user_id);

-- MOMENTS
create policy "Read moments by campus" on public.moments
  for select using (campus_id = get_auth_campus_id());
create policy "Create moment" on public.moments
  for insert with check (auth.uid() = user_id);

-- POLLS
create policy "Read polls by campus" on public.polls
  for select using (campus_id = get_auth_campus_id());

-- REACTIONS
create policy "Read reactions" on public.reactions for select using (true);
create policy "Create reaction" on public.reactions for insert with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
create index idx_users_campus on public.users(campus_id);
create index idx_moments_campus_expires on public.moments(campus_id, expires_at);
create index idx_heists_campus_status on public.heists(campus_id, status);
create index idx_submissions_heist_votes on public.heist_submissions(heist_id, vote_count desc);
create index idx_reactions_moment on public.reactions(moment_id);
create index idx_reactions_submission on public.reactions(heist_submission_id);
