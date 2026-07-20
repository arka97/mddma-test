-- Prevent an RFQ owner from reassigning a requirement to a business they do not own.

drop policy if exists "rfq_owner_update" on public.rfq_listings;
create policy "rfq_owner_update"
  on public.rfq_listings
  for update
  to authenticated
  using (
    posted_by = auth.uid()
    or public.has_role(auth.uid(), 'admin'::public.app_role)
  )
  with check (
    (
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
    or public.has_role(auth.uid(), 'admin'::public.app_role)
  );
