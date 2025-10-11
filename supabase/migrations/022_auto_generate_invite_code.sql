-- Drop old trigger if exists
DROP TRIGGER IF EXISTS trigger_generate_invite_code ON profiles;
DROP FUNCTION IF EXISTS generate_invite_code();

-- Simple function to generate invite code without querying table
CREATE OR REPLACE FUNCTION generate_unique_invite_code()
RETURNS VARCHAR(8) AS $$
BEGIN
  -- Generate random 8-character code using both MD5 and UUID for better randomness
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT || clock_timestamp()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Set default value for invite_code column
ALTER TABLE profiles
ALTER COLUMN invite_code SET DEFAULT generate_unique_invite_code();

COMMENT ON FUNCTION generate_unique_invite_code() IS 'Generates a random 8-character invite code for new users. Uniqueness is enforced by UNIQUE constraint on the column.';
