-- -----------------------------------------------------------------------------
-- MASTER FIX SCRIPT: ROBUST VERSION
-- -----------------------------------------------------------------------------

-- 1. CAMPUSES
create table if not exists public.campuses (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  zip_code text not null,
  location geography(point),
  type text check (type in ('university', 'high_school')),
  member_count integer default 0,
  is_active boolean default false,
  created_at timestamptz default now()
);

-- 2. SQUADS
create table if not exists public.squads (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  name text not null,
  avatar_url text,
  type text check (type in ('dorm', 'major', 'club', 'greek', 'friend_group')),
  xp_total bigint default 0,
  created_at timestamptz default now()
);

-- Ensure 'created_by' column exists in squads
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'squads' and column_name = 'created_by') then
    alter table public.squads add column created_by uuid;
  end if;
end $$;

-- 3. USERS
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  phone_number text,
  class_year integer,
  campus_id uuid references public.campuses(id),
  squad_id uuid references public.squads(id),
  xp_total bigint default 0,
  current_streak integer default 0,
  last_streak_update timestamptz,
  heist_pass_xp integer default 0,
  created_at timestamptz default now()
);

-- Add circular FK for squads.created_by
do $$
begin
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'fk_squads_creator') then
    alter table public.squads add constraint fk_squads_creator foreign key (created_by) references public.users(id);
  end if;
end $$;

-- 4. SPONSORS
create table if not exists public.sponsors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo_url text,
  zip_code text,
  mascot_name text,
  mascot_metadata jsonb,
  created_at timestamptz default now()
);

-- 5. HEISTS
create table if not exists public.heists (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  sponsor_id uuid references public.sponsors(id),
  week_number integer not null,
  theme text not null,
  description text,
  status text check (status in ('reveal', 'submission', 'voting', 'execution', 'completed')) default 'reveal',
  starts_at timestamptz not null,
  submission_ends_at timestamptz not null,
  voting_ends_at timestamptz not null,
  execution_ends_at timestamptz not null,
  created_at timestamptz default now()
);

-- Ensure 'winner_submission_id' column exists in heists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'heists' and column_name = 'winner_submission_id') then
    alter table public.heists add column winner_submission_id uuid;
  end if;
end $$;

-- 6. HEIST SUBMISSIONS
create table if not exists public.heist_submissions (
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

-- Add circular FK for heists.winner_submission_id
do $$
begin
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'fk_heist_winner') then
    alter table public.heists add constraint fk_heist_winner foreign key (winner_submission_id) references public.heist_submissions(id);
  end if;
end $$;

-- 7. POLLS
create table if not exists public.polls (
  id uuid default uuid_generate_v4() primary key,
  campus_id uuid references public.campuses(id) not null,
  category text check (category in ('career', 'academic', 'trend', 'community')),
  question text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- 8. POLL OPTIONS
create table if not exists public.poll_options (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) not null,
  text text not null,
  vote_count integer default 0
);

-- 9. MOMENTS
create table if not exists public.moments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  campus_id uuid references public.campuses(id) not null,
  heist_id uuid references public.heists(id),
  video_url text not null,
  thumbnail_url text,
  caption text,
  type text check (type in ('daily', 'heist')),
  expires_at timestamptz not null,
  is_flagged boolean default false,
  created_at timestamptz default now()
);

-- 10. POLL VOTES
create table if not exists public.poll_votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) not null,
  option_id uuid references public.poll_options(id) not null,
  user_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  unique(poll_id, user_id)
);

-- 11. HEIST VOTES
create table if not exists public.heist_votes (
  id uuid default uuid_generate_v4() primary key,
  heist_id uuid references public.heists(id) not null,
  submission_id uuid references public.heist_submissions(id) not null,
  user_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  unique(heist_id, user_id)
);

-- 12. REACTIONS
create table if not exists public.reactions (
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

-- 13. COMMENTS
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  moment_id uuid references public.moments(id),
  heist_submission_id uuid references public.heist_submissions(id),
  text text not null,
  created_at timestamptz default now(),
  check (moment_id is not null or heist_submission_id is not null)
);

-- -----------------------------------------------------------------------------
-- ENABLE RLS & APPLY POLICIES
-- -----------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.campuses enable row level security;
alter table public.squads enable row level security;
alter table public.heists enable row level security;
alter table public.heist_submissions enable row level security;
alter table public.polls enable row level security;
alter table public.moments enable row level security;
alter table public.reactions enable row level security;
alter table public.poll_votes enable row level security;
alter table public.heist_votes enable row level security;
alter table public.comments enable row level security;

-- Helper function
create or replace function get_auth_campus_id()
returns uuid as $$
  select campus_id from public.users where id = auth.uid()
$$ language sql security definer;

-- Policies (Drop first to ensure clean state)
drop policy if exists "Public profiles" on public.users;
create policy "Public profiles" on public.users for select using (true);
drop policy if exists "Update own profile" on public.users;
create policy "Update own profile" on public.users for update using (auth.uid() = id);

drop policy if exists "Read campuses" on public.campuses;
create policy "Read campuses" on public.campuses for select using (true);

drop policy if exists "Read heists by campus" on public.heists;
create policy "Read heists by campus" on public.heists for select using (campus_id = get_auth_campus_id());

drop policy if exists "Read submissions by campus" on public.heist_submissions;
create policy "Read submissions by campus" on public.heist_submissions for select using (
  exists (select 1 from public.heists h where h.id = heist_id and h.campus_id = get_auth_campus_id())
);
drop policy if exists "Create submission" on public.heist_submissions;
create policy "Create submission" on public.heist_submissions for insert with check (auth.uid() = user_id);

drop policy if exists "Read moments by campus" on public.moments;
create policy "Read moments by campus" on public.moments for select using (campus_id = get_auth_campus_id());
drop policy if exists "Create moment" on public.moments;
create policy "Create moment" on public.moments for insert with check (auth.uid() = user_id);

drop policy if exists "Read polls by campus" on public.polls;
create policy "Read polls by campus" on public.polls for select using (campus_id = get_auth_campus_id());

drop policy if exists "Read reactions" on public.reactions;
create policy "Read reactions" on public.reactions for select using (true);
drop policy if exists "Create reaction" on public.reactions;
create policy "Create reaction" on public.reactions for insert with check (auth.uid() = user_id);

drop policy if exists "Read comments" on public.comments;
create policy "Read comments" on public.comments for select using (true);
drop policy if exists "Create comment" on public.comments;
create policy "Create comment" on public.comments for insert with check (auth.uid() = user_id);
drop policy if exists "Delete own comment" on public.comments;
create policy "Delete own comment" on public.comments for delete using (auth.uid() = user_id);

drop policy if exists "Read poll votes" on public.poll_votes;
create policy "Read poll votes" on public.poll_votes for select using (true);
drop policy if exists "Create poll vote" on public.poll_votes;
create policy "Create poll vote" on public.poll_votes for insert with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- APPLY GAMIFICATION TRIGGERS
-- -----------------------------------------------------------------------------
create or replace function award_xp(user_id uuid, amount int)
returns void as $$
begin
  update public.users
  set xp_total = coalesce(xp_total, 0) + amount
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Poll Vote
create or replace function on_poll_vote()
returns trigger as $$
begin
  perform award_xp(new.user_id, 10);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_poll_vote_xp on public.poll_votes;
create trigger tr_poll_vote_xp
after insert on public.poll_votes
for each row execute function on_poll_vote();

-- Moment Post
create or replace function on_moment_post()
returns trigger as $$
begin
  perform award_xp(new.user_id, 50);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_moment_post_xp on public.moments;
create trigger tr_moment_post_xp
after insert on public.moments
for each row execute function on_moment_post();

-- Heist Submit
create or replace function on_heist_submit()
returns trigger as $$
begin
  perform award_xp(new.user_id, 100);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_heist_submit_xp on public.heist_submissions;
create trigger tr_heist_submit_xp
after insert on public.heist_submissions
for each row execute function on_heist_submit();
