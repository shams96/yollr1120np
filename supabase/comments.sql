-- -----------------------------------------------------------------------------
-- COMMENTS TABLE (Refined)
-- -----------------------------------------------------------------------------

-- Create table if it doesn't exist
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  moment_id uuid references public.moments(id),
  heist_submission_id uuid references public.heist_submissions(id),
  text text not null,
  created_at timestamptz default now(),
  check (moment_id is not null or heist_submission_id is not null)
);

-- Enable RLS
alter table public.comments enable row level security;

-- Drop existing policies to avoid conflicts if re-running
drop policy if exists "Read comments" on public.comments;
drop policy if exists "Create comment" on public.comments;
drop policy if exists "Delete own comment" on public.comments;

-- Create Policies
create policy "Read comments" on public.comments for select using (true);
create policy "Create comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Delete own comment" on public.comments for delete using (auth.uid() = user_id);

-- Indexes (IF NOT EXISTS is not standard in all Postgres versions for indexes, 
-- but typically safe to ignore 'relation already exists' error, or we can drop first)
drop index if exists idx_comments_moment;
drop index if exists idx_comments_submission;

create index idx_comments_moment on public.comments(moment_id);
create index idx_comments_submission on public.comments(heist_submission_id);
