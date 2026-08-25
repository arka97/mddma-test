alter table public.post_comments add column if not exists parent_id uuid references public.post_comments(id) on delete cascade;
create index if not exists post_comments_parent_id_idx on public.post_comments(parent_id);

create or replace function public.add_business_comment(_post_id uuid, _content text, _parent_id uuid)
returns uuid
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare new_comment_id uuid;
begin
  if not public.has_verified_business() then raise exception 'An approved, visible, verified business is required'; end if;
  if char_length(btrim(coalesce(_content, ''))) not between 1 and 1500 then raise exception 'Comment must contain between 1 and 1500 characters'; end if;
  if not exists (select 1 from public.community_posts where id = _post_id and is_hidden = false) then raise exception 'Post is unavailable'; end if;
  if _parent_id is not null and not exists (select 1 from public.post_comments where id = _parent_id and post_id = _post_id) then
    raise exception 'Parent reply is unavailable';
  end if;
  insert into public.post_comments (post_id, author_id, content, is_hidden, parent_id)
  values (_post_id, auth.uid(), btrim(_content), false, _parent_id)
  returning id into new_comment_id;
  return new_comment_id;
end; $function$;

grant execute on function public.add_business_comment(uuid, text, uuid) to authenticated;