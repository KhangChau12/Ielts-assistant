-- Add daily quota tracking columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS daily_essays_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS total_essays_count INTEGER DEFAULT 0;

-- Add index for faster queries on reset date
CREATE INDEX IF NOT EXISTS idx_profiles_last_reset_date
ON profiles(last_reset_date);

-- Add comment for documentation
COMMENT ON COLUMN profiles.daily_essays_count IS 'Number of essays submitted today. Resets daily based on last_reset_date.';
COMMENT ON COLUMN profiles.last_reset_date IS 'Date when daily_essays_count was last reset. Used to reset quota at midnight.';
COMMENT ON COLUMN profiles.total_essays_count IS 'Total number of essays ever submitted by this user. Used for free tier limit (9 essays max).';
