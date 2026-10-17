DO $reset$
DECLARE item record;
BEGIN
  FOR item IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'storage' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', item.policyname, item.schemaname, item.tablename);
  END LOOP;
  FOR item IN SELECT n.nspname, c.relname, c.relkind FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname IN ('public','private') AND c.relkind IN ('r','p','v','m') LOOP
    IF item.relkind='v' THEN EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE',item.nspname,item.relname);
    ELSIF item.relkind='m' THEN EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS %I.%I CASCADE',item.nspname,item.relname);
    ELSE EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE',item.nspname,item.relname);
    END IF;
  END LOOP;
  FOR item IN SELECT p.oid::regprocedure::text AS signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname IN ('public','private') AND NOT EXISTS(SELECT 1 FROM pg_depend d WHERE d.objid=p.oid AND d.deptype='e') LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || item.signature || ' CASCADE';
  END LOOP;
  FOR item IN SELECT n.nspname,t.typname FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typtype IN ('e','d') AND NOT EXISTS(SELECT 1 FROM pg_depend d WHERE d.objid=t.oid AND d.deptype='e') LOOP
    EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE',item.nspname,item.typname);
  END LOOP;
END $reset$;