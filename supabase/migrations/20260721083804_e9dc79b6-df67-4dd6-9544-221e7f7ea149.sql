
-- 1. Role enum
DO $$ BEGIN
  CREATE TYPE public.company_member_role AS ENUM ('owner', 'admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Table
CREATE TABLE IF NOT EXISTS public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.company_member_role NOT NULL DEFAULT 'viewer',
  invited_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);

CREATE INDEX IF NOT EXISTS company_members_user_idx ON public.company_members(user_id);
CREATE INDEX IF NOT EXISTS company_members_company_idx ON public.company_members(company_id);

-- Only one owner per company
CREATE UNIQUE INDEX IF NOT EXISTS company_members_one_owner
  ON public.company_members(company_id) WHERE role = 'owner';

-- 3. Grants (auth-only; no anon read of who works where)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_members TO authenticated;
GRANT ALL ON public.company_members TO service_role;

-- 4. RLS
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- Helper: is current user a member of the company with at least one of the given roles?
CREATE OR REPLACE FUNCTION public.has_company_role(_company_id uuid, VARIADIC _roles public.company_member_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.company_members
    WHERE company_id = _company_id
      AND user_id = auth.uid()
      AND role = ANY(_roles)
  );
$$;

-- Read: any member of the same company can see the membership list
CREATE POLICY "members can read peers"
  ON public.company_members FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_company_role(company_id, 'owner', 'admin', 'editor', 'viewer')
  );

-- Insert: owners/admins add non-owner members; site admins do anything
CREATE POLICY "owners admins add members"
  ON public.company_members FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR (
      public.has_company_role(company_id, 'owner', 'admin')
      AND role <> 'owner'
    )
  );

-- Update: same rule; can't upgrade someone to owner
CREATE POLICY "owners admins update members"
  ON public.company_members FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_company_role(company_id, 'owner', 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR (
      public.has_company_role(company_id, 'owner', 'admin')
      AND role <> 'owner'
    )
  );

-- Delete: same rule; can't delete the owner row (owner transfer is a separate flow)
CREATE POLICY "owners admins delete members"
  ON public.company_members FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR (
      public.has_company_role(company_id, 'owner', 'admin')
      AND role <> 'owner'
    )
  );

-- 5. updated_at trigger
DROP TRIGGER IF EXISTS company_members_set_updated_at ON public.company_members;
CREATE TRIGGER company_members_set_updated_at
  BEFORE UPDATE ON public.company_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Backfill from existing companies.owner_id
INSERT INTO public.company_members (company_id, user_id, role)
SELECT c.id, c.owner_id, 'owner'::public.company_member_role
FROM public.companies c
WHERE c.owner_id IS NOT NULL
ON CONFLICT (company_id, user_id) DO NOTHING;
