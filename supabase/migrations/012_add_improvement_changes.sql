-- Add improvement_changes column to essays table
-- This stores the detailed change information (original -> improved with reasons)

ALTER TABLE public.essays
ADD COLUMN IF NOT EXISTS improvement_changes jsonb DEFAULT NULL;

-- Add comment to document the field
COMMENT ON COLUMN public.essays.improvement_changes IS 'JSONB array storing detailed changes made during essay improvement. Each item contains: {original, improved, reason}. NULL for essays that have not been improved or were improved before this feature.';

-- Create index for JSONB queries (optional, for future analytics)
CREATE INDEX IF NOT EXISTS idx_essays_improvement_changes ON public.essays USING gin (improvement_changes);
