-- Preserve a narrow administrator publishing path for association rate updates,
-- while business users continue to write only through validated RPCs.

create policy community_posts_admin_insert
  on public.community_posts
  for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
  );

grant insert on public.community_posts to authenticated;

create policy post_polls_admin_insert
  on public.post_polls
  for insert
  to authenticated
  with check (
    public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
    and exists (
      select 1
      from public.community_posts post
      where post.id = post_polls.post_id
        and post.author_id = auth.uid()
    )
  );

grant insert on public.post_polls to authenticated;

create policy post_poll_options_admin_insert
  on public.post_poll_options
  for insert
  to authenticated
  with check (
    public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
    and exists (
      select 1
      from public.post_polls poll
      join public.community_posts post on post.id = poll.post_id
      where poll.id = post_poll_options.poll_id
        and post.author_id = auth.uid()
    )
  );

grant insert on public.post_poll_options to authenticated;

create or replace function public.enforce_community_post_rate()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.has_role(_role => 'admin'::public.app_role, _user_id => new.author_id) then
    return new;
  end if;

  if (
    select count(*)
    from public.community_posts post
    where post.author_id = new.author_id
      and post.created_at >= now() - interval '1 hour'
  ) >= 10 then
    raise exception 'Community post limit reached. Try again later.';
  end if;

  return new;
end;
$$;

create or replace function public.enforce_community_comment_rate()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.has_role(_role => 'admin'::public.app_role, _user_id => new.author_id) then
    return new;
  end if;

  if (
    select count(*)
    from public.post_comments comment_row
    where comment_row.author_id = new.author_id
      and comment_row.created_at >= now() - interval '1 hour'
  ) >= 60 then
    raise exception 'Community comment limit reached. Try again later.';
  end if;

  return new;
end;
$$;

drop trigger if exists community_post_rate_guard on public.community_posts;
create trigger community_post_rate_guard
  before insert on public.community_posts
  for each row execute function public.enforce_community_post_rate();

drop trigger if exists community_comment_rate_guard on public.post_comments;
create trigger community_comment_rate_guard
  before insert on public.post_comments
  for each row execute function public.enforce_community_comment_rate();
