-- Quotations must remain valid on the day they are submitted.

drop policy if exists "rfq_quotation_verified_sender_insert" on public.rfq_quotations;
create policy "rfq_quotation_verified_sender_insert"
  on public.rfq_quotations
  for insert
  to authenticated
  with check (
    sender_user_id = auth.uid()
    and valid_until >= current_date
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
