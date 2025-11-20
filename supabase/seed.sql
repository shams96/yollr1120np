-- Seed Data for Yollr V6

-- 1. Campuses
insert into public.campuses (name, slug, zip_code, type, is_active, location)
values 
  ('University of Texas at Austin', 'ut-austin', '78712', 'university', true, st_point(-97.74306, 30.28453)),
  ('Austin High School', 'austin-hs', '78703', 'high_school', true, st_point(-97.76883, 30.27292));

-- 2. Sponsors
insert into public.sponsors (name, zip_code, mascot_name)
values ('Joe''s Pizza', '78705', 'Pizza Goblin');

-- 3. Active Heist (for UT Austin)
with ut as (select id from public.campuses where slug = 'ut-austin'),
     sponsor as (select id from public.sponsors limit 1)
insert into public.heists (campus_id, sponsor_id, week_number, theme, description, status, starts_at, submission_ends_at, voting_ends_at, execution_ends_at)
select 
  ut.id, 
  sponsor.id,
  202542, -- Week 42
  'Library Silent Disco',
  'Turn the 3rd floor into a dance floor. Headphones only. 2PM Tuesday.',
  'voting',
  now() - interval '2 days',
  now() - interval '1 day',
  now() + interval '2 days',
  now() + interval '5 days'
from ut, sponsor;

-- 4. Polls
with ut as (select id from public.campuses where slug = 'ut-austin')
insert into public.polls (campus_id, category, question, expires_at)
select ut.id, 'career', 'Who should sponsor next week?', now() + interval '3 days'
from ut;

-- 5. Poll Options
with poll as (select id from public.polls limit 1)
insert into public.poll_options (poll_id, text, vote_count)
select poll.id, 'Local Coffee Shop', 42 from poll
union all
select poll.id, 'Campus Bookstore', 15 from poll;
