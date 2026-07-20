-- G-BAU-G business community feed
update public.community_posts
set is_hidden = true,
    updated_at = now()
where is_anonymous = true
  and is_hidden = false;

create or replace function public.has_verified_business()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.companies company
      where company.owner_id = auth.uid()
        and company.is_verified = true
        and company.is_hidden = false
        and company.review_status = 'approved'
    );
$$;

revoke all on function public.has_verified_business() from public, anon;
grant execute on function public.has_verified_business() to authenticated;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any(array[
        'community_posts', 'post_comments', 'post_likes', 'post_views',
        'post_polls', 'post_poll_options', 'post_poll_votes', 'anonymous_identity_log'
      ])
  loop
    execute format('drop policy if exists %I on %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;

alter table public.community_posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_views enable row level security;
alter table public.post_polls enable row level security;
alter table public.post_poll_options enable row level security;
alter table public.post_poll_votes enable row level security;
alter table public.anonymous_identity_log enable row level security;

create policy community_posts_public_read on public.community_posts for select to anon, authenticated
  using (is_hidden = false or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

create policy community_posts_admin_update on public.community_posts for update to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()))
  with check (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

create policy community_posts_owner_or_admin_delete on public.community_posts for delete to authenticated
  using (author_id = auth.uid() or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

create policy post_comments_public_read on public.post_comments for select to anon, authenticated
  using ((is_hidden = false and exists (select 1 from public.community_posts post where post.id = post_comments.post_id and post.is_hidden = false))
    or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

create policy post_comments_owner_or_admin_delete on public.post_comments for delete to authenticated
  using (author_id = auth.uid() or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

create policy post_polls_public_read on public.post_polls for select to anon, authenticated
  using (exists (select 1 from public.community_posts post where post.id = post_polls.post_id and (post.is_hidden = false or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()))));

create policy post_poll_options_public_read on public.post_poll_options for select to anon, authenticated
  using (exists (select 1 from public.post_polls poll join public.community_posts post on post.id = poll.post_id where poll.id = post_poll_options.poll_id and (post.is_hidden = false or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()))));

create policy anonymous_identity_log_admin_read on public.anonymous_identity_log for select to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

create or replace function public.create_business_post(
  _post_type text, _content text default '', _structured_data jsonb default null
) returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare new_post_id uuid; normalised_topic text;
begin
  if not public.has_verified_business() then raise exception 'An approved, visible, verified business is required'; end if;
  if _post_type not in ('general', 'price_signal', 'market_alert', 'member_news') then raise exception 'Unsupported community post type'; end if;
  if char_length(btrim(coalesce(_content, ''))) > 5000 then raise exception 'Post content cannot exceed 5000 characters'; end if;
  if btrim(coalesce(_content, '')) = '' and _structured_data is null then raise exception 'Post content is required'; end if;
  normalised_topic := case _post_type
    when 'price_signal' then 'price_signals'
    when 'market_alert' then 'market_alerts'
    when 'member_news' then 'member_news'
    else null end;
  insert into public.community_posts (author_id, post_type, content, structured_data, topic_tag, is_anonymous, is_hidden)
  values (auth.uid(), _post_type, btrim(coalesce(_content, '')), _structured_data, normalised_topic, false, false)
  returning id into new_post_id;
  return new_post_id;
end; $$;

create or replace function public.create_business_poll_post(
  _question text, _options text[], _duration_days integer default 3, _content text default '', _structured_data jsonb default null
) returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare new_post_id uuid; new_poll_id uuid; option_count integer; distinct_option_count integer;
begin
  if not public.has_verified_business() then raise exception 'An approved, visible, verified business is required'; end if;
  if char_length(btrim(coalesce(_question, ''))) not between 3 and 240 then raise exception 'Poll question must contain between 3 and 240 characters'; end if;
  select count(*), count(distinct lower(btrim(option_value))) into option_count, distinct_option_count
    from unnest(coalesce(_options, array[]::text[])) as option_value where btrim(option_value) <> '';
  if option_count not between 2 and 4 or distinct_option_count <> option_count then raise exception 'Polls require 2 to 4 unique options'; end if;
  if _duration_days not between 1 and 14 then raise exception 'Poll duration must be between 1 and 14 days'; end if;
  if char_length(btrim(coalesce(_content, ''))) > 5000 then raise exception 'Post content cannot exceed 5000 characters'; end if;
  insert into public.community_posts (author_id, post_type, content, structured_data, topic_tag, is_anonymous, is_hidden)
  values (auth.uid(), 'poll', btrim(coalesce(_content, '')), _structured_data, 'polls', false, false)
  returning id into new_post_id;
  insert into public.post_polls (post_id, question, closes_at)
  values (new_post_id, btrim(_question), now() + make_interval(days => _duration_days))
  returning id into new_poll_id;
  insert into public.post_poll_options (poll_id, idx, label)
  select new_poll_id, option_order - 1, btrim(option_value)
  from unnest(_options) with ordinality as options(option_value, option_order)
  where btrim(option_value) <> ''
  order by option_order;
  return new_post_id;
end; $$;

create or replace function public.add_business_comment(_post_id uuid, _content text)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare new_comment_id uuid;
begin
  if not public.has_verified_business() then raise exception 'An approved, visible, verified business is required'; end if;
  if char_length(btrim(coalesce(_content, ''))) not between 1 and 1500 then raise exception 'Comment must contain between 1 and 1500 characters'; end if;
  if not exists (select 1 from public.community_posts where id = _post_id and is_hidden = false) then raise exception 'Post is unavailable'; end if;
  insert into public.post_comments (post_id, author_id, content, is_hidden)
  values (_post_id, auth.uid(), btrim(_content), false)
  returning id into new_comment_id;
  return new_comment_id;
end; $$;

create or replace function public.set_business_post_like(_post_id uuid, _liked boolean)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.has_verified_business() then raise exception 'An approved, visible, verified business is required'; end if;
  if not exists (select 1 from public.community_posts where id = _post_id and is_hidden = false) then raise exception 'Post is unavailable'; end if;
  if _liked then
    insert into public.post_likes (post_id, user_id) values (_post_id, auth.uid()) on conflict do nothing;
  else
    delete from public.post_likes where post_id = _post_id and user_id = auth.uid();
  end if;
  return _liked;
end; $$;

create or replace function public.record_business_post_view(_post_id uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then return; end if;
  if not exists (select 1 from public.community_posts where id = _post_id and is_hidden = false) then return; end if;
  insert into public.post_views (post_id, user_id) values (_post_id, auth.uid()) on conflict do nothing;
end; $$;

create or replace function public.cast_business_poll_vote(_poll_id uuid, _option_id uuid)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.has_verified_business() then raise exception 'An approved, visible, verified business is required'; end if;
  if not exists (
    select 1 from public.post_polls poll
    join public.community_posts post on post.id = poll.post_id
    join public.post_poll_options option_row on option_row.poll_id = poll.id
    where poll.id = _poll_id and option_row.id = _option_id and poll.closes_at > now() and post.is_hidden = false
  ) then raise exception 'Poll option is unavailable'; end if;
  delete from public.post_poll_votes where poll_id = _poll_id and voter_id = auth.uid();
  insert into public.post_poll_votes (poll_id, option_id, voter_id) values (_poll_id, _option_id, auth.uid());
  return _option_id;
end; $$;

create or replace function public.get_business_poll(_post_id uuid)
returns table (poll_id uuid, post_id uuid, question text, closes_at timestamptz, option_id uuid, option_index integer, option_label text, vote_count bigint, voted boolean)
language sql stable security definer set search_path = public, pg_temp as $$
  select poll.id, poll.post_id, poll.question, poll.closes_at,
    option_row.id, option_row.idx, option_row.label,
    count(vote.option_id)::bigint,
    coalesce(bool_or(vote.voter_id = auth.uid()), false)
  from public.post_polls poll
  join public.community_posts post on post.id = poll.post_id
  join public.post_poll_options option_row on option_row.poll_id = poll.id
  left join public.post_poll_votes vote on vote.option_id = option_row.id
  where poll.post_id = _post_id
    and (post.is_hidden = false or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()))
  group by poll.id, poll.post_id, poll.question, poll.closes_at, option_row.id, option_row.idx, option_row.label
  order by option_row.idx;
$$;

create or replace function public.get_business_post_engagement(_ids uuid[])
returns table (post_id uuid, like_count bigint, comment_count bigint, view_count bigint, liked boolean)
language sql stable security definer set search_path = public, pg_temp as $$
  select post.id,
    (select count(*) from public.post_likes like_row where like_row.post_id = post.id),
    (select count(*) from public.post_comments comment_row where comment_row.post_id = post.id and comment_row.is_hidden = false),
    (select count(*) from public.post_views view_row where view_row.post_id = post.id),
    auth.uid() is not null and exists (select 1 from public.post_likes mine where mine.post_id = post.id and mine.user_id = auth.uid())
  from public.community_posts post
  where post.id = any(coalesce(_ids, array[]::uuid[]))
    and (post.is_hidden = false or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));
$$;

revoke all on function public.create_business_post(text, text, jsonb) from public, anon;
revoke all on function public.create_business_poll_post(text, text[], integer, text, jsonb) from public, anon;
revoke all on function public.add_business_comment(uuid, text) from public, anon;
revoke all on function public.set_business_post_like(uuid, boolean) from public, anon;
revoke all on function public.record_business_post_view(uuid) from public, anon;
revoke all on function public.cast_business_poll_vote(uuid, uuid) from public, anon;
revoke all on function public.get_business_poll(uuid) from public;
revoke all on function public.get_business_post_engagement(uuid[]) from public;

grant execute on function public.create_business_post(text, text, jsonb) to authenticated;
grant execute on function public.create_business_poll_post(text, text[], integer, text, jsonb) to authenticated;
grant execute on function public.add_business_comment(uuid, text) to authenticated;
grant execute on function public.set_business_post_like(uuid, boolean) to authenticated;
grant execute on function public.record_business_post_view(uuid) to authenticated;
grant execute on function public.cast_business_poll_vote(uuid, uuid) to authenticated;
grant execute on function public.get_business_poll(uuid) to anon, authenticated;
grant execute on function public.get_business_post_engagement(uuid[]) to anon, authenticated;

revoke insert, update on public.community_posts from anon, authenticated;
revoke insert, update on public.post_comments from anon, authenticated;
revoke insert, update, delete on public.post_likes from anon, authenticated;
revoke insert, update, delete on public.post_views from anon, authenticated;
revoke insert, update, delete on public.post_polls from anon, authenticated;
revoke insert, update, delete on public.post_poll_options from anon, authenticated;
revoke insert, update, delete on public.post_poll_votes from anon, authenticated;

grant select on public.community_posts to anon, authenticated;
grant delete, update on public.community_posts to authenticated;
grant select on public.post_comments to anon, authenticated;
grant delete on public.post_comments to authenticated;
grant select on public.post_polls to anon, authenticated;
grant select on public.post_poll_options to anon, authenticated;

drop policy if exists community_media_public_read on storage.objects;
create policy community_media_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'community-media');

drop policy if exists community_media_verified_upload on storage.objects;
create policy community_media_verified_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'community-media' and (storage.foldername(name))[1] = 'posts' and (storage.foldername(name))[2] = auth.uid()::text and public.has_verified_business());

drop policy if exists community_media_owner_delete on storage.objects;
create policy community_media_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'community-media' and (storage.foldername(name))[1] = 'posts' and (storage.foldername(name))[2] = auth.uid()::text);

-- Migration 2: lock community read and storage
drop policy if exists community_posts_public_read on public.community_posts;
drop policy if exists community_posts_admin_read on public.community_posts;
create policy community_posts_public_read on public.community_posts for select to anon, authenticated using (is_hidden = false);
create policy community_posts_admin_read on public.community_posts for select to authenticated using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

drop policy if exists post_comments_public_read on public.post_comments;
drop policy if exists post_comments_admin_read on public.post_comments;
create policy post_comments_public_read on public.post_comments for select to anon, authenticated
  using (is_hidden = false and exists (select 1 from public.community_posts post where post.id = post_comments.post_id and post.is_hidden = false));
create policy post_comments_admin_read on public.post_comments for select to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

drop policy if exists post_polls_public_read on public.post_polls;
drop policy if exists post_polls_admin_read on public.post_polls;
create policy post_polls_public_read on public.post_polls for select to anon, authenticated
  using (exists (select 1 from public.community_posts post where post.id = post_polls.post_id and post.is_hidden = false));
create policy post_polls_admin_read on public.post_polls for select to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

drop policy if exists post_poll_options_public_read on public.post_poll_options;
drop policy if exists post_poll_options_admin_read on public.post_poll_options;
create policy post_poll_options_public_read on public.post_poll_options for select to anon, authenticated
  using (exists (select 1 from public.post_polls poll join public.community_posts post on post.id = poll.post_id where poll.id = post_poll_options.poll_id and post.is_hidden = false));
create policy post_poll_options_admin_read on public.post_poll_options for select to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

do $$
declare policy_row record;
begin
  for policy_row in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (policyname ilike '%community%' or coalesce(qual, '') ilike '%community-media%' or coalesce(with_check, '') ilike '%community-media%')
  loop
    execute format('drop policy if exists %I on storage.objects', policy_row.policyname);
  end loop;
end;
$$;

create policy community_media_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'community-media');
create policy community_media_verified_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'community-media' and (storage.foldername(name))[1] = 'posts' and (storage.foldername(name))[2] = auth.uid()::text and public.has_verified_business());
create policy community_media_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'community-media' and (storage.foldername(name))[1] = 'posts' and (storage.foldername(name))[2] = auth.uid()::text);

-- Migration 3: admin & rate guards
create policy community_posts_admin_insert on public.community_posts for insert to authenticated
  with check (author_id = auth.uid() and public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));
grant insert on public.community_posts to authenticated;

create policy post_polls_admin_insert on public.post_polls for insert to authenticated
  with check (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
    and exists (select 1 from public.community_posts post where post.id = post_polls.post_id and post.author_id = auth.uid()));
grant insert on public.post_polls to authenticated;

create policy post_poll_options_admin_insert on public.post_poll_options for insert to authenticated
  with check (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
    and exists (select 1 from public.post_polls poll join public.community_posts post on post.id = poll.post_id where poll.id = post_poll_options.poll_id and post.author_id = auth.uid()));
grant insert on public.post_poll_options to authenticated;

create or replace function public.enforce_community_post_rate()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  new.is_anonymous := false;
  new.anonymous_expires_at := null;
  if public.has_role(_role => 'admin'::public.app_role, _user_id => new.author_id) then return new; end if;
  if (select count(*) from public.community_posts post where post.author_id = new.author_id and post.created_at >= now() - interval '1 hour') >= 10 then
    raise exception 'Community post limit reached. Try again later.';
  end if;
  return new;
end; $$;

create or replace function public.enforce_community_comment_rate()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if public.has_role(_role => 'admin'::public.app_role, _user_id => new.author_id) then return new; end if;
  if (select count(*) from public.post_comments comment_row where comment_row.author_id = new.author_id and comment_row.created_at >= now() - interval '1 hour') >= 60 then
    raise exception 'Community comment limit reached. Try again later.';
  end if;
  return new;
end; $$;

drop trigger if exists community_post_rate_guard on public.community_posts;
create trigger community_post_rate_guard before insert on public.community_posts for each row execute function public.enforce_community_post_rate();

drop trigger if exists community_comment_rate_guard on public.post_comments;
create trigger community_comment_rate_guard before insert on public.post_comments for each row execute function public.enforce_community_comment_rate();