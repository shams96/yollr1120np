-- -----------------------------------------------------------------------------
-- GAMIFICATION TRIGGERS (Refined)
-- -----------------------------------------------------------------------------

-- 1. Function to award XP
create or replace function award_xp(user_id uuid, amount int)
returns void as $$
begin
  update public.users
  set xp_total = coalesce(xp_total, 0) + amount
  where id = user_id;
end;
$$ language plpgsql security definer;

-- 2. Trigger: Vote on Poll (+10 XP)
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

-- 3. Trigger: Post Moment (+50 XP)
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

-- 4. Trigger: Submit Heist (+100 XP)
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
