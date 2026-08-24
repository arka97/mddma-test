revoke execute on function public.get_followed_author_ids() from public, anon;
revoke execute on function public.list_suggested_follows(integer) from public, anon;
grant execute on function public.get_followed_author_ids() to authenticated;
grant execute on function public.list_suggested_follows(integer) to authenticated;