-- Migration: Allow NULL user_id for guest essays
-- This enables guest mode by allowing essays without a user_id

ALTER TABLE essays ALTER COLUMN user_id DROP NOT NULL;

-- Add a check constraint to ensure either user_id OR guest_fingerprint is present
ALTER TABLE essays ADD CONSTRAINT essays_user_or_guest_check
  CHECK (
    (user_id IS NOT NULL AND is_guest = FALSE) OR
    (user_id IS NULL AND is_guest = TRUE AND guest_fingerprint IS NOT NULL)
  );
