-- Migration: Receipt shopping delta — preview, confirm, idempotency (P2 M3)
-- Owner: Andy Yu
-- Contract: p2/contracts/receipt-v1.md §7
--
-- Two tables and one function:
--
--   shopping_delta_previews       what the user was shown, and the snapshot it came from
--   shopping_delta_confirmations  one row per applied confirm; request_id is the primary key
--   apply_receipt_shopping_delta  writes the preview's lines and the confirmation in one
--                                 transaction, so a failure leaves nothing behind
--
-- Idempotency lives in the database, not in memory: request_id is a PRIMARY KEY and
-- preview_id is UNIQUE, and the function takes a row lock on the preview before it
-- checks either. Two concurrent confirms of one preview therefore serialise; the
-- second sees the first one's confirmation and replays it instead of writing again.

-- ============================================================================
-- TABLE: shopping_delta_previews
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shopping_delta_previews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
    recipe_id BIGINT NOT NULL REFERENCES public."Recipe"(id) ON DELETE CASCADE,
    servings INTEGER NOT NULL DEFAULT 1 CHECK (servings >= 1),
    as_of_date DATE NOT NULL,
    rule_version TEXT NOT NULL DEFAULT 'receipt-v1',
    snapshot_id TEXT NOT NULL,
    deltas JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(deltas) = 'array'),
    unresolved JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(unresolved) = 'array'),
    applied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shopping_delta_previews_user
    ON public.shopping_delta_previews(user_id, created_at DESC);

-- ============================================================================
-- TABLE: shopping_delta_confirmations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shopping_delta_confirmations (
    request_id UUID PRIMARY KEY,
    preview_id UUID NOT NULL UNIQUE
        REFERENCES public.shopping_delta_previews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status = 'applied'),
    written JSONB NOT NULL DEFAULT '[]'::jsonb,
    skipped JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.shopping_delta_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_delta_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own delta previews"
    ON public.shopping_delta_previews FOR SELECT
    USING (auth.uid() = user_id);

-- A preview may only point at a list the same user owns.
CREATE POLICY "Users can create own delta previews"
    ON public.shopping_delta_previews FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.shopping_lists sl
            WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can mark own delta previews applied"
    ON public.shopping_delta_previews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own delta confirmations"
    ON public.shopping_delta_confirmations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own delta confirmations"
    ON public.shopping_delta_confirmations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: apply_receipt_shopping_delta
-- ============================================================================
-- SECURITY INVOKER: every statement runs under the caller's RLS policies, so the
-- function cannot write to a list the caller could not write to directly.
--
-- Returns {status, written, skipped, replayed}:
--   applied + replayed=false   lines were written now
--   applied + replayed=true    this request_id was already applied; nothing new written
--   stale                      this preview was already applied by another request
-- Raises (and so rolls back everything) on: no session, unknown preview, a request_id
-- reused for a different preview, or a list that is no longer the caller's.

CREATE OR REPLACE FUNCTION public.apply_receipt_shopping_delta(
    p_preview_id UUID,
    p_request_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_preview public.shopping_delta_previews%ROWTYPE;
    v_existing public.shopping_delta_confirmations%ROWTYPE;
    v_written JSONB := '[]'::jsonb;
    v_position INTEGER;
    v_line JSONB;
    v_ingredient_id BIGINT;
    v_item_id UUID;
    v_quantity NUMERIC;
    v_unit TEXT;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '28000';
    END IF;

    -- Lock first: concurrent confirms of the same preview queue up here.
    SELECT * INTO v_preview
      FROM public.shopping_delta_previews
     WHERE id = p_preview_id AND user_id = v_uid
       FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'preview_not_found' USING ERRCODE = 'P0002';
    END IF;

    SELECT * INTO v_existing
      FROM public.shopping_delta_confirmations
     WHERE request_id = p_request_id;
    IF FOUND THEN
        IF v_existing.preview_id <> p_preview_id OR v_existing.user_id <> v_uid THEN
            RAISE EXCEPTION 'request_id_reused' USING ERRCODE = '23505';
        END IF;
        RETURN jsonb_build_object(
            'status', v_existing.status,
            'written', v_existing.written,
            'skipped', v_existing.skipped,
            'replayed', TRUE
        );
    END IF;

    IF v_preview.applied_at IS NOT NULL THEN
        RETURN jsonb_build_object(
            'status', 'stale',
            'written', '[]'::jsonb,
            'skipped', '[]'::jsonb,
            'replayed', FALSE
        );
    END IF;

    PERFORM 1
       FROM public.shopping_lists
      WHERE id = v_preview.shopping_list_id AND user_id = v_uid;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'list_not_found' USING ERRCODE = 'P0002';
    END IF;

    SELECT COALESCE(MAX(position), -1) + 1 INTO v_position
      FROM public.shopping_list_items
     WHERE shopping_list_id = v_preview.shopping_list_id;

    FOR v_line IN
        SELECT value
          FROM jsonb_array_elements(v_preview.deltas)
         ORDER BY (value ->> 'ingredient_id')::BIGINT
    LOOP
        v_ingredient_id := (v_line ->> 'ingredient_id')::BIGINT;

        INSERT INTO public.shopping_list_items (
            shopping_list_id, ingredient_id, item_name, quantity, unit,
            category, is_checked, position, notes
        )
        VALUES (
            v_preview.shopping_list_id,
            v_ingredient_id,
            COALESCE(
                (SELECT i.name FROM public."Ingredient" i WHERE i.id = v_ingredient_id),
                'Ingredient #' || v_ingredient_id
            ),
            (v_line ->> 'missing_qty')::NUMERIC,
            v_line ->> 'unit',
            'Other',
            FALSE,
            v_position,
            'Shortfall for recipe #' || v_preview.recipe_id || ' (receipt-v1)'
        )
        RETURNING id, quantity, unit INTO v_item_id, v_quantity, v_unit;

        v_written := v_written || jsonb_build_array(jsonb_build_object(
            'item_id', v_item_id,
            'ingredient_id', v_ingredient_id,
            'quantity', v_quantity,
            'unit', v_unit
        ));
        v_position := v_position + 1;
    END LOOP;

    INSERT INTO public.shopping_delta_confirmations (
        request_id, preview_id, user_id, status, written, skipped
    )
    VALUES (p_request_id, p_preview_id, v_uid, 'applied', v_written, v_preview.unresolved);

    UPDATE public.shopping_delta_previews
       SET applied_at = NOW()
     WHERE id = p_preview_id;

    RETURN jsonb_build_object(
        'status', 'applied',
        'written', v_written,
        'skipped', v_preview.unresolved,
        'replayed', FALSE
    );
END;
$$;

REVOKE ALL ON FUNCTION public.apply_receipt_shopping_delta(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.apply_receipt_shopping_delta(UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.apply_receipt_shopping_delta(UUID, UUID) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.shopping_delta_previews IS
    'P2 M3: a computed pantry delta shown to the user; nothing reaches a list until confirmed';
COMMENT ON COLUMN public.shopping_delta_previews.snapshot_id IS
    'Fingerprint of requirements and relevant inventory; confirm compares it to detect a stale preview';
COMMENT ON COLUMN public.shopping_delta_previews.applied_at IS
    'Set once, by apply_receipt_shopping_delta; a preview is applied at most once';
COMMENT ON TABLE public.shopping_delta_confirmations IS
    'P2 M3: one row per applied confirm. request_id PK and preview_id UNIQUE enforce idempotency';
COMMENT ON FUNCTION public.apply_receipt_shopping_delta(UUID, UUID) IS
    'P2 M3: atomically writes a preview''s deltas to its list and records the confirmation';
