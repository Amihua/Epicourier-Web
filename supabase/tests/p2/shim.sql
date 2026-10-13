-- Minimal stand-in for the parts of Supabase the M3 migration touches, so it can run
-- against a plain local Postgres. Test-only: never apply this to a real project.
--
-- Supabase provides: the anon/authenticated roles, auth.users, and auth.uid() reading
-- the JWT subject from a request setting. "Recipe" and "Ingredient" come from the
-- 2025-11-21 remote schema, which needs Supabase-only extensions (pg_graphql,
-- supabase_vault); they are reduced here to the columns the migrations reference.

CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;

-- As on Supabase: everything created in public is fully granted to both API roles,
-- and RLS plus each migration's own REVOKEs decide what they can really do.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;

CREATE SCHEMA auth;
CREATE TABLE auth.users (id UUID PRIMARY KEY);

CREATE FUNCTION auth.uid() RETURNS UUID
LANGUAGE sql STABLE
AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub', TRUE), '')::UUID $$;

GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;

CREATE TABLE public."Ingredient" (
    id BIGINT PRIMARY KEY,
    name TEXT,
    unit TEXT NOT NULL
);

CREATE TABLE public."Recipe" (
    id BIGINT PRIMARY KEY,
    name TEXT
);
