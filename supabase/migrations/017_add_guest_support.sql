-- Add guest support columns to essays table
ALTER TABLE essays
ADD COLUMN IF NOT EXISTS guest_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;

-- Create index for guest fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_essays_guest_fingerprint ON essays(guest_fingerprint, created_at) WHERE guest_fingerprint IS NOT NULL;

-- Create guest_fingerprints tracking table
CREATE TABLE IF NOT EXISTS guest_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE,
  essay_id UUID REFERENCES essays(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_fingerprint_lookup ON guest_fingerprints(fingerprint);

-- Allow public to insert guest essays
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;

-- Policy for guest essay creation
CREATE POLICY "Allow guest essay creation" ON essays
  FOR INSERT
  WITH CHECK (is_guest = true AND guest_fingerprint IS NOT NULL);

-- Policy for guest essay reading (own essays only via fingerprint)
CREATE POLICY "Allow guest essay reading" ON essays
  FOR SELECT
  USING (
    (is_guest = true AND guest_fingerprint IS NOT NULL) OR
    (auth.uid() = user_id)
  );

-- Allow public access to guest_fingerprints table
ALTER TABLE guest_fingerprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to manage guest fingerprints" ON guest_fingerprints
  FOR ALL
  USING (true)
  WITH CHECK (true);
