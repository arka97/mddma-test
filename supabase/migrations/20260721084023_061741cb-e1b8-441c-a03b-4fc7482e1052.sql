
DO $$
DECLARE
  v_company_id uuid;
  v_owner_id uuid;
  v_stranger_id uuid := gen_random_uuid();
  v_count int;
BEGIN
  SELECT p.id INTO v_owner_id
  FROM public.profiles p
  LEFT JOIN public.companies c ON c.owner_id = p.id
  WHERE c.id IS NULL
  LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE NOTICE 'No unattached profile — skipping RLS smoke checks';
    RETURN;
  END IF;

  INSERT INTO public.companies (owner_id, slug, name, review_status, is_verified, is_hidden)
  VALUES (v_owner_id, 'rls-smoke-' || substr(gen_random_uuid()::text, 1, 8), 'RLS Smoke', 'approved', true, false)
  RETURNING id INTO v_company_id;

  INSERT INTO public.company_members (company_id, user_id, role)
  VALUES (v_company_id, v_owner_id, 'owner')
  ON CONFLICT (company_id, user_id) DO NOTHING;

  SET LOCAL ROLE anon;
  SELECT count(*) INTO v_count FROM public.company_members WHERE company_id = v_company_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'RLS FAIL: anon read visible (%)', v_count; END IF;
  RESET ROLE;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_stranger_id::text, 'role', 'authenticated')::text, true);
  SELECT count(*) INTO v_count FROM public.company_members WHERE company_id = v_company_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'RLS FAIL: stranger read visible (%)', v_count; END IF;

  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_owner_id::text, 'role', 'authenticated')::text, true);
  SELECT count(*) INTO v_count FROM public.company_members WHERE company_id = v_company_id;
  IF v_count <> 1 THEN RAISE EXCEPTION 'RLS FAIL: owner cannot read team (%)', v_count; END IF;

  BEGIN
    INSERT INTO public.company_members (company_id, user_id, role)
    VALUES (v_company_id, v_stranger_id, 'owner');
    RAISE EXCEPTION 'RLS FAIL: owner-role insert was allowed';
  EXCEPTION
    WHEN insufficient_privilege OR check_violation OR unique_violation THEN NULL;
  END;

  INSERT INTO public.company_members (company_id, user_id, role)
  VALUES (v_company_id, v_stranger_id, 'viewer');

  RESET ROLE;
  DELETE FROM public.companies WHERE id = v_company_id;
  RAISE NOTICE 'company_members RLS smoke checks passed';
END $$;
