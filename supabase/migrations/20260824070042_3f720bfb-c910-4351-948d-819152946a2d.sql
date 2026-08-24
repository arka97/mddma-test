alter table public.follows
  alter column followed_company_id drop not null,
  add column if not exists followed_user_id uuid references auth.users(id) on delete cascade;

alter table public.follows drop constraint if exists follows_follower_user_id_followed_company_id_key;

alter table public.follows
  add constraint follows_exactly_one_target
  check (num_nonnulls(followed_company_id, followed_user_id) = 1);

alter table public.follows
  add constraint follows_no_self_follow
  check (followed_user_id is null or followed_user_id <> follower_user_id);

create unique index if not exists follows_unique_company
  on public.follows (follower_user_id, followed_company_id)
  where followed_company_id is not null;

create unique index if not exists follows_unique_user
  on public.follows (follower_user_id, followed_user_id)
  where followed_user_id is not null;

grant select, insert, delete on public.follows to authenticated;

create or replace function public.get_followed_author_ids()
returns setof uuid
language sql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
  select distinct author_id from (
    select c.owner_id as author_id
    from public.follows f
    join public.companies c on c.id = f.followed_company_id
    where f.follower_user_id = auth.uid()
    union
    select m.user_id
    from public.follows f
    join public.company_members m on m.company_id = f.followed_company_id
    where f.follower_user_id = auth.uid()
    union
    select f.followed_user_id
    from public.follows f
    where f.follower_user_id = auth.uid()
      and f.followed_user_id is not null
  ) t
  where author_id is not null;
$$;

grant execute on function public.get_followed_author_ids() to authenticated;

create or replace function public.list_suggested_follows(_limit integer default 8)
returns table(user_id uuid, full_name text, avatar_url text, company_id uuid, company_name text, company_slug text)
language sql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
  with recent as (
    select p.author_id, max(p.created_at) as last_post
    from public.community_posts p
    where p.is_hidden = false
      and p.is_anonymous = false
      and p.author_id is distinct from auth.uid()
    group by p.author_id
  )
  select r.author_id,
         coalesce(pr.full_name, 'Member'),
         pr.avatar_url,
         c.id,
         coalesce(c.name, pr.company_name),
         c.slug
  from recent r
  left join public.profiles pr on pr.id = r.author_id
  left join lateral (
    select c1.id, c1.name, c1.slug
    from public.companies c1
    where c1.owner_id = r.author_id
    order by c1.created_at asc
    limit 1
  ) c on true
  where not exists (
    select 1 from public.follows f
    where f.follower_user_id = auth.uid()
      and (f.followed_user_id = r.author_id or (c.id is not null and f.followed_company_id = c.id))
  )
  order by r.last_post desc
  limit greatest(1, least(coalesce(_limit, 8), 25));
$$;

grant execute on function public.list_suggested_follows(integer) to authenticated;