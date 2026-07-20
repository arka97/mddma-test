-- G-BAU-G RFQ and quotation foundation
--
-- Product boundary:
-- - RFQs remain discoverable inside the authenticated network.
-- - Only approved, verified businesses may post RFQs or submit quotations.
-- - Exact quotation terms are visible only to the quoting business, the RFQ-owning
--   business, and administrators.
-- - No acceptance, purchase-order, payment, escrow, or fulfilment workflow is added.

alter table public.rfq_listings
  add column if not exists currency text not null default 'INR',
  add column if not exists packaging text,
  add column if not exists notes text,
  add column if not exists status text not null default 'open';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rfq_listings_status_check'
  ) then
    alter table public.rfq_listings
      add constraint rfq_listings_status_check
      check (status in ('open', 'closed', 'withdrawn', 'expired'));
  end if;
end $$;

create table if not exists public.rfq_quotations (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfq_listings(id) on delete cascade,
  sender_company_id uuid not null references public.companies(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  recipient_company_id uuid not null references public.companies(id) on delete cascade,
  quote_kind text not null default 'indicative',
  currency text not null default 'INR',
  quantity_min numeric(18, 3) not null,
  quantity_max numeric(18, 3) not null,
  quantity_unit text not null,
  price_min numeric(18, 4) not null,
  price_max numeric(18, 4) not null,
  price_unit text not null,
  delivery_terms text,
  payment_terms text,
  notes text,
  valid_until date not null,
  status text not null default 'sent',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rfq_quotations_kind_check
    check (quote_kind in ('indicative', 'formal')),
  constraint rfq_quotations_status_check
    check (status in ('sent', 'revised', 'withdrawn', 'rejected', 'expired')),
  constraint rfq_quotations_quantity_check
    check (quantity_min > 0 and quantity_max >= quantity_min),
  constraint rfq_quotations_price_check
    check (price_min > 0 and price_max >= price_min),
  constraint rfq_quotations_parties_check
    check (sender_company_id <> recipient_company_id)
);

create index if not exists rfq_quotations_rfq_id_idx
  on public.rfq_quotations(rfq_id, created_at desc);
create index if not exists rfq_quotations_sender_idx
  on public.rfq_quotations(sender_user_id, created_at desc);
create index if not exists rfq_quotations_recipient_idx
  on public.rfq_quotations(recipient_company_id, created_at desc);

alter table public.rfq_listings enable row level security;
alter table public.rfq_quotations enable row level security;

-- Authenticated users may discover non-hidden requirements. The UI separates
-- discovery from commercial participation and filters closed/expired records.
drop policy if exists "rfq_authenticated_network_read" on public.rfq_listings;
create policy "rfq_authenticated_network_read"
  on public.rfq_listings
  for select
  to authenticated
  using (is_hidden = false);

-- Posting requires an approved, visible and verified business owned by the user.
drop policy if exists "rfq_verified_business_insert" on public.rfq_listings;
create policy "rfq_verified_business_insert"
  on public.rfq_listings
  for insert
  to authenticated
  with check (
    posted_by = auth.uid()
    and exists (
      select 1
      from public.companies c
      where c.id = company_id
        and c.owner_id = auth.uid()
        and c.is_verified = true
        and c.is_hidden = false
        and c.review_status = 'approved'
    )
  );

drop policy if exists "rfq_owner_update" on public.rfq_listings;
create policy "rfq_owner_update"
  on public.rfq_listings
  for update
  to authenticated
  using (
    posted_by = auth.uid()
    or public.has_role(
      _role => 'admin'::public.app_role,
      _user_id => auth.uid()
    )
  )
  with check (
    posted_by = auth.uid()
    or public.has_role(
      _role => 'admin'::public.app_role,
      _user_id => auth.uid()
    )
  );

-- Quotation terms are private to the two businesses and administrators.
drop policy if exists "rfq_quotation_participant_read" on public.rfq_quotations;
create policy "rfq_quotation_participant_read"
  on public.rfq_quotations
  for select
  to authenticated
  using (
    sender_user_id = auth.uid()
    or exists (
      select 1
      from public.companies c
      where c.id = recipient_company_id
        and c.owner_id = auth.uid()
    )
    or public.has_role(
      _role => 'admin'::public.app_role,
      _user_id => auth.uid()
    )
  );

drop policy if exists "rfq_quotation_verified_sender_insert" on public.rfq_quotations;
create policy "rfq_quotation_verified_sender_insert"
  on public.rfq_quotations
  for insert
  to authenticated
  with check (
    sender_user_id = auth.uid()
    and exists (
      select 1
      from public.companies sender
      where sender.id = sender_company_id
        and sender.owner_id = auth.uid()
        and sender.is_verified = true
        and sender.is_hidden = false
        and sender.review_status = 'approved'
    )
    and exists (
      select 1
      from public.rfq_listings r
      where r.id = rfq_id
        and r.company_id = recipient_company_id
        and r.is_hidden = false
        and r.status = 'open'
        and r.valid_until >= current_date
    )
  );

-- Do not grant generic quotation updates to clients. The only client mutation in
-- this release is a narrowly scoped withdrawal function.
drop policy if exists "rfq_quotation_sender_update" on public.rfq_quotations;

create or replace function public.withdraw_my_rfq_quotation(_quotation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected_rows integer;
begin
  if auth.uid() is null then
    return false;
  end if;

  update public.rfq_quotations
  set status = 'withdrawn', updated_at = now()
  where id = _quotation_id
    and sender_user_id = auth.uid()
    and status in ('sent', 'revised')
    and valid_until >= current_date;

  get diagnostics affected_rows = row_count;
  return affected_rows > 0;
end;
$$;

grant select, insert, update on public.rfq_listings to authenticated;
grant select, insert on public.rfq_quotations to authenticated;
revoke all on public.rfq_quotations from anon;
revoke all on function public.withdraw_my_rfq_quotation(uuid) from public;
grant execute on function public.withdraw_my_rfq_quotation(uuid) to authenticated;

comment on table public.rfq_quotations is
  'Private indicative or formal quotations exchanged in response to RFQs. No acceptance or order workflow.';
