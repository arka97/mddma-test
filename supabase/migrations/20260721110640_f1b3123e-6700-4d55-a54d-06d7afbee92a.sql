
-- 1. Seed the new flag
INSERT INTO public.app_settings (key, value)
VALUES ('verification_open_to_all', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Helper to read the flag
CREATE OR REPLACE FUNCTION public.is_verification_open()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT value = 'true'::jsonb FROM public.app_settings WHERE key = 'verification_open_to_all'),
    false
  );
$$;

-- 3. Relax has_verified_business when the toggle is ON
CREATE OR REPLACE FUNCTION public.has_verified_business()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  select auth.uid() is not null
    and (
      public.is_verification_open()
      or exists (
        select 1
        from public.companies company
        where company.is_verified = true
          and company.is_hidden = false
          and company.review_status = 'approved'
          and (
            company.owner_id = auth.uid()
            or exists (
              select 1
              from public.company_members member
              where member.company_id = company.id
                and member.user_id = auth.uid()
                and member.role in ('owner','admin','editor')
            )
          )
      )
    );
$$;

-- 4. start_deal_room: allow any company the user belongs to when verification is open
CREATE OR REPLACE FUNCTION public.start_deal_room(_counterparty_company_id uuid, _subject text, _context_type text DEFAULT 'general'::text, _rfq_id uuid DEFAULT NULL::uuid, _quotation_id uuid DEFAULT NULL::uuid, _product_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  my_company public.companies%rowtype;
  other_company public.companies%rowtype;
  existing_room_id uuid;
  new_room_id uuid;
  rfq_company_id uuid;
  quote_sender_id uuid;
  quote_recipient_id uuid;
  product_company_id uuid;
  verification_open boolean;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  verification_open := public.is_verification_open();

  select c.* into my_company
  from public.companies c
  where (verification_open OR (c.is_verified = true AND c.is_hidden = false AND c.review_status = 'approved'))
    and (
      c.owner_id = auth.uid()
      or exists (
        select 1 from public.company_members m
        where m.company_id = c.id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin','editor')
      )
    )
  limit 1;

  if my_company.id is null then
    raise exception 'You need a business profile before starting a deal room';
  end if;

  select * into other_company
  from public.companies
  where id = _counterparty_company_id
    and (verification_open OR (is_verified = true AND is_hidden = false AND review_status = 'approved'));

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
      created_by, initiator_company_id, counterparty_company_id,
      subject, context_type, rfq_id, quotation_id, product_id
    ) values (
      auth.uid(), my_company.id, other_company.id,
      btrim(_subject), _context_type, _rfq_id, _quotation_id, _product_id
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
$function$;

-- 5. send_deal_message: same relaxation
CREATE OR REPLACE FUNCTION public.send_deal_message(_room_id uuid, _body text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  room_row public.deal_rooms%rowtype;
  sender_company public.companies%rowtype;
  new_message_id uuid;
  messages_last_minute integer;
  verification_open boolean;
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

  verification_open := public.is_verification_open();

  select c.* into sender_company
  from public.companies c
  where c.id in (room_row.initiator_company_id, room_row.counterparty_company_id)
    and (verification_open OR (c.is_verified = true AND c.is_hidden = false AND c.review_status = 'approved'))
    and (
      c.owner_id = auth.uid()
      or exists (
        select 1 from public.company_members m
        where m.company_id = c.id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin','editor')
      )
    )
  limit 1;

  if sender_company.id is null then
    raise exception 'You cannot send messages in this room';
  end if;

  if exists (
    select 1 from public.deal_messages
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
    room_id, sender_user_id, sender_company_id, body
  ) values (
    room_row.id, auth.uid(), sender_company.id, btrim(_body)
  )
  returning id into new_message_id;

  update public.deal_rooms
  set last_message_at = now(), updated_at = now()
  where id = room_row.id;

  return new_message_id;
end;
$function$;
