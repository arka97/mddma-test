-- Preserve business conversation records when an individual auth account is removed,
-- and add a basic abuse throttle to the message RPC.

alter table public.deal_rooms
  drop constraint if exists deal_rooms_created_by_fkey;
alter table public.deal_rooms
  alter column created_by drop not null;
alter table public.deal_rooms
  add constraint deal_rooms_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

alter table public.deal_messages
  drop constraint if exists deal_messages_sender_user_id_fkey;
alter table public.deal_messages
  alter column sender_user_id drop not null;
alter table public.deal_messages
  add constraint deal_messages_sender_user_id_fkey
  foreign key (sender_user_id) references auth.users(id) on delete set null;

create or replace function public.send_deal_message(
  _room_id uuid,
  _body text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  room_row public.deal_rooms%rowtype;
  sender_company public.companies%rowtype;
  new_message_id uuid;
  messages_last_minute integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if char_length(btrim(coalesce(_body, ''))) not between 1 and 4000 then
    raise exception 'Message must contain between 1 and 4000 characters';
  end if;

  select * into room_row
  from public.deal_rooms
  where id = _room_id and status = 'open';

  if room_row.id is null then
    raise exception 'Deal room is unavailable';
  end if;

  select * into sender_company
  from public.companies
  where owner_id = auth.uid()
    and id in (room_row.initiator_company_id, room_row.counterparty_company_id)
    and is_verified = true
    and is_hidden = false
    and review_status = 'approved'
  limit 1;

  if sender_company.id is null then
    raise exception 'You cannot send messages in this room';
  end if;

  if exists (
    select 1
    from public.deal_messages
    where sender_user_id = auth.uid()
      and created_at > now() - interval '1 second'
  ) then
    raise exception 'Please wait before sending another message';
  end if;

  select count(*) into messages_last_minute
  from public.deal_messages
  where sender_user_id = auth.uid()
    and created_at > now() - interval '1 minute';

  if messages_last_minute >= 60 then
    raise exception 'Message rate limit reached. Please try again shortly';
  end if;

  insert into public.deal_messages (
    room_id,
    sender_user_id,
    sender_company_id,
    body
  ) values (
    room_row.id,
    auth.uid(),
    sender_company.id,
    btrim(_body)
  )
  returning id into new_message_id;

  update public.deal_rooms
  set last_message_at = now(), updated_at = now()
  where id = room_row.id;

  return new_message_id;
end;
$$;

revoke all on function public.send_deal_message(uuid, text) from public;
grant execute on function public.send_deal_message(uuid, text) to authenticated;