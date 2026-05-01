-- 1. Trigger: whenever paid_member or broker is granted, remove free_member.
--    This keeps the invariant "a user is either Free or Paid, never both"
--    regardless of which code path grants the upgraded role.
CREATE OR REPLACE FUNCTION public.remove_free_when_upgraded()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IN ('paid_member', 'broker') THEN
    DELETE FROM public.user_roles
     WHERE user_id = NEW.user_id
       AND role = 'free_member';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_remove_free_when_upgraded ON public.user_roles;
CREATE TRIGGER trg_remove_free_when_upgraded
AFTER INSERT ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.remove_free_when_upgraded();

-- 2. downgrade_to_free helper for cancel/expire flows
CREATE OR REPLACE FUNCTION public.downgrade_to_free(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_roles
   WHERE user_id = _user_id AND role IN ('paid_member', 'broker');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'free_member')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.downgrade_to_free(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.downgrade_to_free(uuid) TO service_role;

-- 3. Backfill: any user who currently holds both free + paid loses the free row
DELETE FROM public.user_roles
 WHERE role = 'free_member'
   AND user_id IN (
     SELECT user_id FROM public.user_roles WHERE role IN ('paid_member', 'broker')
   );