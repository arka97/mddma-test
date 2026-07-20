-- G-BAU-G private deal rooms
--
-- Product boundary:
-- - A room belongs to exactly two verified businesses.
-- - Rooms may reference one RFQ, quotation, or product as context.
-- - Only participant business owners and authorised administrators may read rooms/messages.
-- - Clients cannot insert directly; validated SECURITY DEFINER RPCs create rooms and messages.
-- - No attachments, read receipts, orders, acceptance, payment, escrow, fulfilment, or dispute outcome.

create table if not exists public.deal_rooms (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete restrict,
  initiator_company_id uuid not null references public.companies(id) on delete restrict,
  counterparty_company_id uuid not null references public.companies(id) on delete restrict,
  subject text not null,
  context_type text not null default 'general',
  rfq_id uuid references public.rfq_listings(id) on delete set null,
  quotation_id uuid references public.rfq_quotations(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  status text not null default 'open',
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deal_rooms_distinct_companies_check
    check (initiator_company_id <> counterparty_company_id),
  constraint deal_rooms_subject_check
    check (char_length(btrim(subject)) between 3 and 160),
  constraint deal_rooms_context_type_check
    check (context_type in ('general', 'rfq', 'quotation', 'product')),
  constraint deal_rooms_status_check
    check (status in ('open', 'archived')),
  constraint deal_rooms_single_context_check
    check (num_nonnulls(rfq_id, quotation_id, product_id) <= 1),
  constraint deal_rooms_context_value_check
    check (
      (context_type = 'general' and rfq_id is null and quotation_id is null and product_id is null)
      or (context_type = 'rfq' and rfq_id is not null and quotation_id is null and product_id is null)
      or (context_type = 'quotation' and quotation_id is not null and rfq_id is null and product_id is null)
      or (context_type = 'product' and product_id is not null and rfq_id is null and quotation_id is null)
    )
);

create table if not exists public.deal_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.deal_rooms(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete restrict,
  sender_company_id uuid not null references public.companies(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  constraint deal_messages_body_check
    check (char_length(btrim(body)) between 1 and 4000)
);

create index if not exists deal_rooms_initiator_activity_idx
  on public.deal_rooms(initiator_company_id, last_message_at desc);
create index if not exists deal_rooms_counterparty_activity_idx
  on public.deal_rooms(counterparty_company_id, last_message_at desc);
create index if not exists deal_messages_room_created_idx
  on public.deal_messages(room_id, created_at asc);

create unique index if not exists deal_rooms_general_pair_unique
  on public.deal_rooms(
    least(initiator_company_id, counterparty_company_id),
    greatest(initiator_company_id, counterparty_company_id)
  )
  where status = 'open' and context_type = 'general';

create unique index if not exists deal_rooms_rfq_pair_unique
  on public.deal_rooms(
    rfq_id,
    least(initiator_company_id, counterparty_company_id),
    greatest(initiator_company_id, counterparty_company_id)
  )
  where status = 'open' and context_type = 'rfq';

create unique index if not exists deal_rooms_quotation_unique
  on public.deal_rooms(quotation_id)
  where status = 'open' and context_type = 'quotation';

create unique index if not exists deal_rooms_product_pair_unique
  on public.deal_rooms(
    product_id,
    least(initiator_company_id, counterparty_company_id),
    greatest(initiator_company_id, counterparty_company_id)
  )
  where status = 'open' and context_type = 'product';

alter table public.deal_rooms enable row level security;
alter table public.deal_messages enable row level security;

create or replace function public.can_access_deal_room(
  _room_id uuid,
  _user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    _user_id is not null
    and exists (
      select 1
      from public.deal_rooms room
      join public.companies initiator on initiator.id = room.initiator_company_id
      join public.companies counterparty on counterparty.id = room.counterparty_company_id
      where room.id = _room_id
        and (_user_id = initiator.owner_id or _user_id = counterparty.owner_id)
    );
$$;

create or replace function public.start_deal_room(
  _counterparty_company_id uuid,
  _subject text,
  _context_type text default 'general',
  _rfq_id uuid default null,
  _quotation_id uuid default null,
  _product_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  my_company public.companies%rowtype;
  other_company public.companies%rowtype;
  existing_room_id uuid;
  new_room_id uuid;
  rfq_company_id uuid;
  quote_sender_id uuid;
  quote_recipient_id uuid;
  product_company_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into my_company
  from public.companies
  where owner_id = auth.uid()
    and is_verified = true
    and is_hidden = false
    and review_status = 'approved'
  limit 1;

  if my_company.id is null then
    raise exception 'An approved, verified business is required';
  end if;

  select * into other_company
  from public.companies
  where id = _counterparty_company_id
    and is_verified = true
    and is_hidden = false
    and review_status = 'approved';

  if other_company.id is null then
    raise exception 'The counterparty business is not available for private messaging';
  end if;

  if my_company.id = other_company.id then
    raise exception 'A business cannot create a deal room with itself';
  end if;

  if char_length(btrim(coalesce(_subject, ''))) not between 3 and 160 then
    raise exception 'Room subject must contain between 3 and 160 characters';
  end if;

  if _context_type not in ('general', 'rfq', 'quotation', 'product') then
    raise exception 'Unsupported deal room context';
  end if;

  if _context_type = 'general' then
    if _rfq_id is not null or _quotation_id is not null or _product_id is not null then
      raise exception 'General rooms cannot include a trade context';
    end if;
  elsif _context_type = 'rfq' then
    if _rfq_id is null or _quotation_id is not null or _product_id is not null then
      raise exception 'RFQ context is invalid';
    end if;
    select company_id into rfq_company_id
    from public.rfq_listings
    where id = _rfq_id and is_hidden = false;
    if rfq_company_id is null or rfq_company_id not in (my_company.id, other_company.id) then
      raise exception 'The selected RFQ does not belong to either participant';
    end if;
  elsif _context_type = 'quotation' then
    if _quotation_id is null or _rfq_id is not null or _product_id is not null then
      raise exception 'Quotation context is invalid';
    end if;
    select sender_company_id, recipient_company_id
      into quote_sender_id, quote_recipient_id
    from public.rfq_quotations
    where id = _quotation_id;
    if quote_sender_id is null
      or not (
        quote_sender_id in (my_company.id, other_company.id)
        and quote_recipient_id in (my_company.id, other_company.id)
        and quote_sender_id <> quote_recipient_id
      ) then
      raise exception 'The selected quotation does not belong to these participants';
    end if;
  elsif _context_type = 'product' then
    if _product_id is null or _rfq_id is not null or _quotation_id is not null then
      raise exception 'Product context is invalid';
    end if;
    select company_id into product_company_id
    from public.products
    where id = _product_id and is_hidden = false;
    if product_company_id is null or product_company_id not in (my_company.id, other_company.id) then
      raise exception 'The selected product does not belong to either participant';
    end if;
  end if;

  select id into existing_room_id
  from public.deal_rooms
  where status = 'open'
    and least(initiator_company_id, counterparty_company_id) = least(my_company.id, other_company.id)
    and greatest(initiator_company_id, counterparty_company_id) = greatest(my_company.id, other_company.id)
    and context_type = _context_type
    and rfq_id is not distinct from _rfq_id
    and quotation_id is not distinct from _quotation_id
    and product_id is not distinct from _product_id
  limit 1;

  if existing_room_id is not null then
    return existing_room_id;
  end if;

  begin
    insert into public.deal_rooms (
      created_by,
      initiator_company_id,
      counterparty_company_id,
      subject,
      context_type,
      rfq_id,
      quotation_id,
      product_id
    ) values (
      auth.uid(),
      my_company.id,
      other_company.id,
      btrim(_subject),
      _context_type,
      _rfq_id,
      _quotation_id,
      _product_id
    )
    returning id into new_room_id;
  exception when unique_violation then
    select id into new_room_id
    from public.deal_rooms
    where status = 'open'
      and least(initiator_company_id, counterparty_company_id) = least(my_company.id, other_company.id)
      and greatest(initiator_company_id, counterparty_company_id) = greatest(my_company.id, other_company.id)
      and context_type = _context_type
      and rfq_id is not distinct from _rfq_id
      and quotation_id is not distinct from _quotation_id
      and product_id is not distinct from _product_id
    limit 1;
  end;

  return new_room_id;
end;
$$;

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

drop policy if exists "deal_room_participant_read" on public.deal_rooms;
create policy "deal_room_participant_read"
  on public.deal_rooms
  for select
  to authenticated
  using (
    public.can_access_deal_room(id, auth.uid())
    or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
  );

drop policy if exists "deal_message_participant_read" on public.deal_messages;
create policy "deal_message_participant_read"
  on public.deal_messages
  for select
  to authenticated
  using (
    public.can_access_deal_room(room_id, auth.uid())
    or public.has_role(_role => 'admin'::public.app_role, _user_id => auth.uid())
  );

revoke all on public.deal_rooms from anon;
revoke all on public.deal_messages from anon;
revoke all on public.deal_rooms from authenticated;
revoke all on public.deal_messages from authenticated;
grant select on public.deal_rooms to authenticated;
grant select on public.deal_messages to authenticated;

revoke all on function public.can_access_deal_room(uuid, uuid) from public;
revoke all on function public.start_deal_room(uuid, text, text, uuid, uuid, uuid) from public;
revoke all on function public.send_deal_message(uuid, text) from public;
grant execute on function public.can_access_deal_room(uuid, uuid) to authenticated;
grant execute on function public.start_deal_room(uuid, text, text, uuid, uuid, uuid) to authenticated;
grant execute on function public.send_deal_message(uuid, text) to authenticated;

comment on table public.deal_rooms is
  'Private two-business conversation rooms with optional RFQ, quotation, or product context.';
comment on table public.deal_messages is
  'Participant-only text messages within a private deal room.';