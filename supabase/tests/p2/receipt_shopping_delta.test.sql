-- Database round-trip tests for 20261012000000_receipt_shopping_delta.sql (P2 M3).
-- Run by scripts/p2/db-roundtrip.sh after shim.sql and the migrations.
-- Every check raises on failure, and psql runs with ON_ERROR_STOP, so any failure
-- stops the run with a non-zero exit.
--
-- Users:   A aaaaaaaa-…  owns list 1111…   B bbbbbbbb-…  owns list 2222…
-- Data:    ingredient 11 "Chicken breast" (100g), 12 "Rice" (1 cup); recipe 101.

\set ON_ERROR_STOP on

-- Supabase grants table access to `authenticated` by default; RLS does the rest.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

INSERT INTO auth.users (id) VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
INSERT INTO public."Ingredient" (id, name, unit) VALUES
    (11, 'Chicken breast', '100g'),
    (12, 'Rice', '1 cup');
INSERT INTO public."Recipe" (id, name) VALUES (101, 'Chicken rice');
INSERT INTO public.shopping_lists (id, user_id, name) VALUES
    ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'A weekly'),
    ('22222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'B weekly');
-- A already has one item on the list, so new lines must be appended after it.
INSERT INTO public.shopping_list_items (shopping_list_id, item_name, position)
VALUES ('11111111-1111-4111-8111-111111111111', 'Milk', 0);

-- ---------------------------------------------------------------------------
\echo '1. a user can save a preview for their own list'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
INSERT INTO public.shopping_delta_previews
    (id, user_id, shopping_list_id, recipe_id, servings, as_of_date, snapshot_id, deltas, unresolved)
VALUES
    ('a1000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
     '11111111-1111-4111-8111-111111111111', 101, 1, '2026-10-10', 'snap_1',
     '[{"ingredient_id": 11, "missing_qty": 300, "unit": "g"},
       {"ingredient_id": 12, "missing_qty": 0.5, "unit": "cup"}]',
     '[{"ingredient_id": 14, "reason": "unknown_requirement"}]'),
    ('a1000000-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
     '11111111-1111-4111-8111-111111111111', 101, 1, '2026-10-10', 'snap_2',
     '[{"ingredient_id": 11, "missing_qty": 50, "unit": "g"}]', '[]'),
    -- The second line has a quantity that cannot be cast: the insert fails half-way.
    ('a1000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
     '11111111-1111-4111-8111-111111111111', 101, 1, '2026-10-10', 'snap_3',
     '[{"ingredient_id": 11, "missing_qty": 10, "unit": "g"},
       {"ingredient_id": 12, "missing_qty": "lots", "unit": "cup"}]', '[]'),
    ('a1000000-0000-4000-8000-000000000004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
     '11111111-1111-4111-8111-111111111111', 101, 1, '2026-10-10', 'snap_4',
     '[{"ingredient_id": 12, "missing_qty": 2, "unit": "cup"}]', '[]');
COMMIT;

-- ---------------------------------------------------------------------------
\echo '2. a user cannot save a preview against someone else''s list'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
DO $$
BEGIN
    INSERT INTO public.shopping_delta_previews
        (user_id, shopping_list_id, recipe_id, as_of_date, snapshot_id)
    VALUES ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222',
            101, '2026-10-10', 'snap_x');
    RAISE EXCEPTION 'FAIL: preview against B''s list was accepted';
EXCEPTION WHEN insufficient_privilege THEN
    NULL; -- RLS rejected it, as required
END $$;
COMMIT;

-- ---------------------------------------------------------------------------
\echo '3. confirm writes exactly the previewed lines, after the existing item'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
DO $$
DECLARE r JSONB;
BEGIN
    r := public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001');
    IF r ->> 'status' <> 'applied' OR (r ->> 'replayed')::BOOLEAN THEN
        RAISE EXCEPTION 'FAIL: expected a fresh apply, got %', r;
    END IF;
    IF jsonb_array_length(r -> 'written') <> 2 THEN
        RAISE EXCEPTION 'FAIL: expected 2 written lines, got %', r -> 'written';
    END IF;
    IF r -> 'skipped' <> '[{"ingredient_id": 14, "reason": "unknown_requirement"}]'::JSONB THEN
        RAISE EXCEPTION 'FAIL: unresolved lines should be reported as skipped, got %', r -> 'skipped';
    END IF;
END $$;
COMMIT;

DO $$
DECLARE n INTEGER; q NUMERIC; u TEXT; nm TEXT; pos INTEGER;
BEGIN
    SELECT count(*) INTO n FROM public.shopping_list_items
     WHERE shopping_list_id = '11111111-1111-4111-8111-111111111111';
    IF n <> 3 THEN RAISE EXCEPTION 'FAIL: list should hold Milk + 2 lines, holds %', n; END IF;

    SELECT quantity, unit, item_name, position INTO q, u, nm, pos
      FROM public.shopping_list_items WHERE ingredient_id = 11;
    IF q <> 300 OR u <> 'g' OR nm <> 'Chicken breast' OR pos <> 1 THEN
        RAISE EXCEPTION 'FAIL: chicken line is % % "%" at %', q, u, nm, pos;
    END IF;

    IF (SELECT applied_at FROM public.shopping_delta_previews
         WHERE id = 'a1000000-0000-4000-8000-000000000001') IS NULL THEN
        RAISE EXCEPTION 'FAIL: preview not marked applied';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
\echo '4. the same request_id again replays the stored result and writes nothing'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
DO $$
DECLARE r JSONB;
BEGIN
    r := public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001');
    IF r ->> 'status' <> 'applied' OR NOT (r ->> 'replayed')::BOOLEAN THEN
        RAISE EXCEPTION 'FAIL: expected a replay, got %', r;
    END IF;
    IF jsonb_array_length(r -> 'written') <> 2 THEN
        RAISE EXCEPTION 'FAIL: replay should return the original written lines, got %', r;
    END IF;
END $$;
COMMIT;

DO $$
BEGIN
    IF (SELECT count(*) FROM public.shopping_list_items
         WHERE shopping_list_id = '11111111-1111-4111-8111-111111111111') <> 3 THEN
        RAISE EXCEPTION 'FAIL: a replay wrote new items';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
\echo '5. a second request for an applied preview is stale and writes nothing'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
DO $$
DECLARE r JSONB;
BEGIN
    r := public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000002');
    IF r ->> 'status' <> 'stale' OR jsonb_array_length(r -> 'written') <> 0 THEN
        RAISE EXCEPTION 'FAIL: expected stale with nothing written, got %', r;
    END IF;
END $$;
COMMIT;

-- ---------------------------------------------------------------------------
\echo '6. another user cannot apply the preview'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
SET LOCAL ROLE authenticated;
DO $$
BEGIN
    PERFORM public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000003');
    RAISE EXCEPTION 'FAIL: B applied A''s preview';
EXCEPTION WHEN no_data_found THEN
    IF SQLERRM <> 'preview_not_found' THEN RAISE; END IF;
END $$;
COMMIT;

-- ---------------------------------------------------------------------------
\echo '7. reusing a request_id for a different preview is rejected, and writes nothing'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
DO $$
BEGIN
    PERFORM public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000001');
    RAISE EXCEPTION 'FAIL: request_id reuse accepted';
EXCEPTION WHEN unique_violation THEN
    IF SQLERRM <> 'request_id_reused' THEN RAISE; END IF;
END $$;
COMMIT;

DO $$
BEGIN
    IF (SELECT applied_at FROM public.shopping_delta_previews
         WHERE id = 'a1000000-0000-4000-8000-000000000002') IS NOT NULL THEN
        RAISE EXCEPTION 'FAIL: preview 2 marked applied after a rejected confirm';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
\echo '8. a failure half-way through rolls back every line (no partial write)'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
DO $$
BEGIN
    PERFORM public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000004');
    RAISE EXCEPTION 'FAIL: a corrupt preview was applied';
EXCEPTION WHEN invalid_text_representation THEN
    NULL; -- the cast of "lots" failed on the second line
END $$;
COMMIT;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.shopping_list_items WHERE quantity = 10) THEN
        RAISE EXCEPTION 'FAIL: the first line of a failed confirm was left behind';
    END IF;
    IF EXISTS (SELECT 1 FROM public.shopping_delta_confirmations
                WHERE request_id = 'c1000000-0000-4000-8000-000000000004') THEN
        RAISE EXCEPTION 'FAIL: a failed confirm was recorded';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
\echo '9. without a session the function refuses to run'
BEGIN;
SET LOCAL request.jwt.claim.sub = '';
SET LOCAL ROLE authenticated;
DO $$
BEGIN
    PERFORM public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000005');
    RAISE EXCEPTION 'FAIL: ran without a user';
EXCEPTION WHEN invalid_authorization_specification THEN
    NULL;
END $$;
COMMIT;

-- ---------------------------------------------------------------------------
\echo '10. the anon role cannot call the function at all'
BEGIN;
SET LOCAL ROLE anon;
DO $$
BEGIN
    PERFORM public.apply_receipt_shopping_delta(
        'a1000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000006');
    RAISE EXCEPTION 'FAIL: anon executed the function';
EXCEPTION WHEN insufficient_privilege THEN
    NULL;
END $$;
COMMIT;

-- ---------------------------------------------------------------------------
\echo '11. B cannot read A''s previews or confirmations'
BEGIN;
SET LOCAL request.jwt.claim.sub = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
SET LOCAL ROLE authenticated;
DO $$
BEGIN
    IF (SELECT count(*) FROM public.shopping_delta_previews) <> 0
       OR (SELECT count(*) FROM public.shopping_delta_confirmations) <> 0 THEN
        RAISE EXCEPTION 'FAIL: B can see A''s rows';
    END IF;
END $$;
COMMIT;

\echo 'sequential checks: PASS'
