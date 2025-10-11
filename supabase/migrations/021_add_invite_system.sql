-- Add invite system columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS invite_code VARCHAR(8) UNIQUE,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS invite_bonus_essays INTEGER DEFAULT 0;

-- Create invites tracking table
CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bonus_applied BOOLEAN DEFAULT false,
  UNIQUE(inviter_id, invited_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON profiles(invite_code);
CREATE INDEX IF NOT EXISTS idx_profiles_invited_by ON profiles(invited_by);
CREATE INDEX IF NOT EXISTS idx_invites_inviter_id ON invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_invited_id ON invites(invited_id);

-- Add RLS policies for invites table
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Users can see their own invites (both sent and received)
CREATE POLICY "Users can view their own invites" ON invites
  FOR SELECT
  USING (auth.uid() = inviter_id OR auth.uid() = invited_id);

-- Only system can insert invites (via service role)
CREATE POLICY "Service role can manage invites" ON invites
  FOR ALL
  USING (auth.role() = 'service_role');

-- Generate invite codes for existing users
DO $$
DECLARE
  user_record RECORD;
  new_code VARCHAR(8);
  attempts INTEGER;
BEGIN
  FOR user_record IN SELECT id FROM profiles WHERE invite_code IS NULL
  LOOP
    attempts := 0;
    LOOP
      -- Generate random 8-character code (uppercase letters and numbers)
      new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

      -- Try to update, exit loop if successful
      BEGIN
        UPDATE profiles SET invite_code = new_code WHERE id = user_record.id;
        EXIT;
      EXCEPTION
        WHEN unique_violation THEN
          -- Code already exists, try again
          attempts := attempts + 1;
          IF attempts > 10 THEN
            -- Use UUID fallback after 10 attempts
            new_code := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 8));
            UPDATE profiles SET invite_code = new_code WHERE id = user_record.id;
            EXIT;
          END IF;
      END;
    END LOOP;
  END LOOP;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN profiles.invite_code IS 'Unique invite code for this user to share with others';
COMMENT ON COLUMN profiles.invited_by IS 'User ID of who invited this user (if applicable)';
COMMENT ON COLUMN profiles.invite_bonus_essays IS 'Total number of bonus essays earned from successful invites';
COMMENT ON TABLE invites IS 'Tracks all successful invitations between users';