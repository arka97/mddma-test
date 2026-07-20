-- Replace legacy RFQ policies so business verification, not paid membership,
-- is the authoritative commercial-access rule.

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'rfq_listings'
  loop
    execute format(
      'drop policy if exists %I on public.rfq_listings',
      existing_policy.policyname
    );
  end loop;
end $$;

create policy "rfq_authenticated_network_read"
  on public.rfq_listings
  for select
  to authenticated
  using (
    is_hidden = false
    or public.has_role(
      _role => 'admin'::public.app_role,
      _user_id => auth.uid()
    )
  );

create policy "rfq_verified_business_insert"
  on public.rfq_listings
  for insert
  to authenticated
  with check (
    public.has_role(
      _role => 'admin'::public.app_role,
      _user_id => auth.uid()
    )
    or (
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
    )
  );

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
    public.has_role(
      _role => 'admin'::public.app_role,
      _user_id => auth.uid()
    )
    or (
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
    )
  );
