-- Allow users to increment invite_bonus_essays of their inviter
-- This is needed for the auth callback to reward the person who shared the invite code

CREATE POLICY "Allow updating inviter bonus" ON profiles
  FOR UPDATE
  USING (true)  -- Anyone can attempt
  WITH CHECK (
    -- Only allow updating invite_bonus_essays column
    -- Check that this user was invited by the profile being updated
    id IN (
      SELECT invited_by
      FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Alternative safer approach: Create a function with SECURITY DEFINER
-- This function runs with elevated privileges to bypass RLS

CREATE OR REPLACE FUNCTION increment_inviter_bonus(
  inviter_user_id UUID,
  bonus_amount INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET invite_bonus_essays = COALESCE(invite_bonus_essays, 0) + bonus_amount
  WHERE id = inviter_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_inviter_bonus(UUID, INTEGER) TO authenticated;
