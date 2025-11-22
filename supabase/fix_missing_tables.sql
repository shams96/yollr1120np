-- -----------------------------------------------------------------------------
-- FIX MISSING TABLES & RE-APPLY TRIGGERS
-- -----------------------------------------------------------------------------

-- 1. Ensure POLL VOTES exists
create table if not exists public.poll_votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) not null,
  option_id uuid references public.poll_options(id) not null,
  user_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  unique(poll_id, user_id)
);

-- 2. Ensure HEIST VOTES exists
create table if not exists public.heist_votes (
  id uuid default uuid_generate_v4() primary key,
  heist_id uuid references public.heists(id) not null,
  submission_id uuid references public.heist_submissions(id) not null,
  user_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  unique(heist_id, user_id)
);

-- 3. Ensure REACTIONS exists
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

-- 4. Ensure COMMENTS exists
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  moment_id uuid references public.moments(id),
  heist_submission_id uuid references public.heist_submissions(id),
  text text not null,
  created_at timestamptz default now(),
  check (moment_id is not null or heist_submission_id is not null)
);

-- 5. Enable RLS on these tables
alter table public.poll_votes enable row level security;
alter table public.heist_votes enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;

-- 6. Re-apply Policies (Drop first to be safe)
drop policy if exists "Read poll votes" on public.poll_votes;
create policy "Read poll votes" on public.poll_votes for select using (true);
create policy "Create poll vote" on public.poll_votes for insert with check (auth.uid() = user_id);

drop policy if exists "Read heist votes" on public.heist_votes;
create policy "Read heist votes" on public.heist_votes for select using (true);
create policy "Create heist vote" on public.heist_votes for insert with check (auth.uid() = user_id);

drop policy if exists "Read reactions" on public.reactions;
create policy "Read reactions" on public.reactions for select using (true);
create policy "Create reaction" on public.reactions for insert with check (auth.uid() = user_id);

drop policy if exists "Read comments" on public.comments;
create policy "Read comments" on public.comments for select using (true);
create policy "Create comment" on public.comments for insert with check (auth.uid() = user_id);

-- 7. Re-apply Triggers (Gamification)
-- (Copying the safe trigger logic here for convenience)

-- Function to award XP
create or replace function award_xp(user_id uuid, amount int)
returns void as $$
begin
  update public.users
  set xp_total = coalesce(xp_total, 0) + amount
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Poll Vote Trigger
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

-- Moment Post Trigger
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

-- Heist Submit Trigger
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
