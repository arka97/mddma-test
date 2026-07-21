
-- Public team roster RPC — exposes only display fields, not the underlying join.
CREATE OR REPLACE FUNCTION public.get_company_team_public(_company_id uuid)
RETURNS TABLE (
  user_id uuid,
  role public.company_member_role,
  full_name text,
  avatar_url text,
  joined_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    m.user_id,
    m.role,
    COALESCE(p.full_name, 'Team member') AS full_name,
    p.avatar_url,
    m.created_at AS joined_at
  FROM public.company_members m
  LEFT JOIN public.profiles p ON p.id = m.user_id
  WHERE m.company_id = _company_id
  ORDER BY
    CASE m.role
      WHEN 'owner' THEN 0
      WHEN 'admin' THEN 1
      WHEN 'editor' THEN 2
      ELSE 3
    END,
    m.created_at ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_team_public(uuid) TO anon, authenticated;
