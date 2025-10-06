-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Allow guest essay creation" ON essays;
DROP POLICY IF EXISTS "Allow guest essay reading" ON essays;
DROP POLICY IF EXISTS "Allow public to manage guest fingerprints" ON guest_fingerprints;

-- Ensure columns exist (will skip if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='essays' AND column_name='is_guest') THEN
    ALTER TABLE essays ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='essays' AND column_name='guest_fingerprint') THEN
    ALTER TABLE essays ADD COLUMN guest_fingerprint TEXT;
  END IF;
END $$;

-- Create guest_fingerprints table if not exists
CREATE TABLE IF NOT EXISTS guest_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE,
  essay_id UUID REFERENCES essays(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_essays_guest_fingerprint ON essays(guest_fingerprint, created_at) WHERE guest_fingerprint IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fingerprint_lookup ON guest_fingerprints(fingerprint);

-- Enable RLS
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_fingerprints ENABLE ROW LEVEL SECURITY;

-- Create new policies for guest essay creation
-- Allow inserting guest essays without authentication
CREATE POLICY "Allow guest essay creation" ON essays
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (is_guest = true AND guest_fingerprint IS NOT NULL) OR
    (auth.uid() = user_id)
  );

-- Allow reading guest essays by fingerprint OR own essays by user_id
CREATE POLICY "Allow guest essay reading" ON essays
  FOR SELECT
  TO anon, authenticated
  USING (
    (is_guest = true AND guest_fingerprint IS NOT NULL) OR
    (auth.uid() = user_id)
  );

-- Keep existing policies for authenticated users (update, delete)
-- These should already exist from previous migrations

-- Allow public access to guest_fingerprints table
CREATE POLICY "Allow public to manage guest fingerprints" ON guest_fingerprints
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
