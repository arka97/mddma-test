create or replace function public.get_company_whatsapp(_company_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select c.phone
  from public.companies c
  where c.id = _company_id
    and (
      public.has_role(auth.uid(), 'paid_member'::app_role)
      or public.has_role(auth.uid(), 'broker'::app_role)
      or public.has_role(auth.uid(), 'admin'::app_role)
    );
$$;

grant execute on function public.get_company_whatsapp(uuid) to authenticated;