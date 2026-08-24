DROP POLICY IF EXISTS "owners admins update members" ON public.company_members;
CREATE POLICY "owners admins update members"
ON public.company_members
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    has_company_role(company_id, VARIADIC ARRAY['owner'::company_member_role,'admin'::company_member_role])
    AND (
      role <> 'owner'::company_member_role
      OR user_id = auth.uid()
    )
  )
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    has_company_role(company_id, VARIADIC ARRAY['owner'::company_member_role,'admin'::company_member_role])
    AND (
      role <> 'owner'::company_member_role
      OR user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "owners admins delete members" ON public.company_members;
CREATE POLICY "owners admins delete members"
ON public.company_members
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    has_company_role(company_id, VARIADIC ARRAY['owner'::company_member_role,'admin'::company_member_role])
    AND (
      role <> 'owner'::company_member_role
      OR user_id = auth.uid()
    )
  )
);