-- Membership-aware policies for products, product_variants, and brands.

-- ============ PRODUCTS ============
drop policy if exists "Company owners can insert products" on public.products;
drop policy if exists "Company owners and admins can update products" on public.products;
drop policy if exists "Company owners and admins can delete products" on public.products;

create policy "Company members can insert products"
  on public.products for insert to authenticated
  with check (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.companies c
      where c.id = company_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin','editor')
          )
        )
    )
  );

create policy "Company members and admins can update products"
  on public.products for update to authenticated
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.companies c
      where c.id = company_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin','editor')
          )
        )
    )
  );

create policy "Company members and admins can delete products"
  on public.products for delete to authenticated
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.companies c
      where c.id = company_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin')
          )
        )
    )
  );

-- ============ PRODUCT VARIANTS ============
drop policy if exists "Sellers can insert variants" on public.product_variants;
drop policy if exists "Sellers and admins can update variants" on public.product_variants;
drop policy if exists "Sellers and admins can delete variants" on public.product_variants;

create policy "Members can insert variants"
  on public.product_variants for insert to authenticated
  with check (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.products p
      join public.companies c on c.id = p.company_id
      where p.id = product_variants.product_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin','editor')
          )
        )
    )
  );

create policy "Members and admins can update variants"
  on public.product_variants for update to authenticated
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.products p
      join public.companies c on c.id = p.company_id
      where p.id = product_variants.product_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin','editor')
          )
        )
    )
  );

create policy "Members and admins can delete variants"
  on public.product_variants for delete to authenticated
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.products p
      join public.companies c on c.id = p.company_id
      where p.id = product_variants.product_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin')
          )
        )
    )
  );

-- ============ BRANDS ============
drop policy if exists "Owners and admins can insert brands" on public.brands;
drop policy if exists "Owners and admins can update brands" on public.brands;
drop policy if exists "Owners and admins can delete brands" on public.brands;

create policy "Members and admins can insert brands"
  on public.brands for insert to authenticated
  with check (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.companies c
      where c.id = brands.company_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin','editor')
          )
        )
    )
  );

create policy "Members and admins can update brands"
  on public.brands for update to authenticated
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.companies c
      where c.id = brands.company_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin','editor')
          )
        )
    )
  );

create policy "Members and admins can delete brands"
  on public.brands for delete to authenticated
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
    or exists (
      select 1 from public.companies c
      where c.id = brands.company_id
        and (
          c.owner_id = auth.uid()
          or exists (
            select 1 from public.company_members m
            where m.company_id = c.id and m.user_id = auth.uid()
              and m.role in ('owner','admin')
          )
        )
    )
  );
