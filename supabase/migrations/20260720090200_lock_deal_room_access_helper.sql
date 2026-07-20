-- Bind participant access checks to auth.uid() so callers cannot probe whether
-- an arbitrary user belongs to a room. Administrators retain explicit read-only
-- oversight through the separate has_role policy condition.

drop policy if exists "deal_room_participant_read" on public.deal_rooms;
drop policy if exists "deal_message_participant_read" on public.deal_messages;

drop function if exists public.can_access_deal_room(uuid, uuid);

create or replace function public.can_access_deal_room(_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    auth.uid() is not null
    and exists (
      select 1
      from public.deal_rooms room
      join public.companies initiator on initiator.id = room.initiator_company_id
      join public.companies counterparty on counterparty.id = room.counterparty_company_id
      where room.id = _room_id
        and auth.uid() in (initiator.owner_id, counterparty.owner_id)
    );
$$;

create policy "deal_room_participant_read"
  on public.deal_rooms
  for select
  to authenticated
  using (
    public.can_access_deal_room(id)
    or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
  );

create policy "deal_message_participant_read"
  on public.deal_messages
  for select
  to authenticated
  using (
    public.can_access_deal_room(room_id)
    or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
  );

create index if not exists deal_messages_sender_rate_idx
  on public.deal_messages(sender_user_id, created_at desc);

revoke all on function public.can_access_deal_room(uuid) from public;
grant execute on function public.can_access_deal_room(uuid) to authenticated;