-- Harden public community reads and replace any legacy community-media storage rules.

-- Public visibility and administrator oversight are separate policies so anon
-- requests never need to execute role-check helpers.
drop policy if exists community_posts_public_read on public.community_posts;
drop policy if exists community_posts_admin_read on public.community_posts;
create policy community_posts_public_read
  on public.community_posts
  for select
  to anon, authenticated
  using (is_hidden = false);
create policy community_posts_admin_read
  on public.community_posts
  for select
  to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

drop policy if exists post_comments_public_read on public.post_comments;
drop policy if exists post_comments_admin_read on public.post_comments;
create policy post_comments_public_read
  on public.post_comments
  for select
  to anon, authenticated
  using (
    is_hidden = false
    and exists (
      select 1
      from public.community_posts post
      where post.id = post_comments.post_id
        and post.is_hidden = false
    )
  );
create policy post_comments_admin_read
  on public.post_comments
  for select
  to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

drop policy if exists post_polls_public_read on public.post_polls;
drop policy if exists post_polls_admin_read on public.post_polls;
create policy post_polls_public_read
  on public.post_polls
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.community_posts post
      where post.id = post_polls.post_id
        and post.is_hidden = false
    )
  );
create policy post_polls_admin_read
  on public.post_polls
  for select
  to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

drop policy if exists post_poll_options_public_read on public.post_poll_options;
drop policy if exists post_poll_options_admin_read on public.post_poll_options;
create policy post_poll_options_public_read
  on public.post_poll_options
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.post_polls poll
      join public.community_posts post on post.id = poll.post_id
      where poll.id = post_poll_options.poll_id
        and post.is_hidden = false
    )
  );
create policy post_poll_options_admin_read
  on public.post_poll_options
  for select
  to authenticated
  using (public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid()));

-- PostgreSQL permissive policies combine with OR, so merely adding a stricter
-- policy would not neutralise an older paid/trial uploader policy. Remove every
-- storage.objects policy that names this bucket before installing the final set.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (
        policyname ilike '%community%'
        or coalesce(qual, '') ilike '%community-media%'
        or coalesce(with_check, '') ilike '%community-media%'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', policy_row.policyname);
  end loop;
end;
$$;

create policy community_media_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'community-media');

create policy community_media_verified_upload
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'community-media'
    and (storage.foldername(name))[1] = 'posts'
    and (storage.foldername(name))[2] = auth.uid()::text
    and public.has_verified_business()
  );

create policy community_media_owner_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'community-media'
    and (storage.foldername(name))[1] = 'posts'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
