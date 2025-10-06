-- Add UPDATE policy for guest essays
-- Allows updating guest essays (for improved_essay, guidance, etc.)

DROP POLICY IF EXISTS "Allow guest essay updates" ON essays;

CREATE POLICY "Allow guest essay updates" ON essays
  FOR UPDATE
  TO anon, authenticated
  USING (
    (is_guest = true AND guest_fingerprint IS NOT NULL) OR
    (auth.uid() = user_id)
  )
  WITH CHECK (
    (is_guest = true AND guest_fingerprint IS NOT NULL) OR
    (auth.uid() = user_id)
  );

-- Note: Guest vocabulary is stored in browser localStorage, not in database
-- vocabulary_views and vocabulary_quiz_attempts tables remain authenticated-only
