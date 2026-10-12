-- Migration: record when the user confirmed their nutrient goals (P2)
-- Owner: Andy Yu (schema). Needed by the receipt contract §6: targets are used for
-- ranking only once confirmed, and an unconfirmed goals row is ignored with a warning.
-- Nullable and additive: existing rows read as "not confirmed" until the user confirms.

ALTER TABLE public.nutrient_goals
    ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.nutrient_goals.confirmed_at IS
    'When the user last confirmed these goals; receipt-v1 ranking uses targets only when set';
