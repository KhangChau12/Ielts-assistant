-- Add improved_essay column to essays table
-- This stores the AI-generated improved version of the student's essay

ALTER TABLE public.essays
ADD COLUMN IF NOT EXISTS improved_essay text DEFAULT NULL;

-- Add comment to document the field
COMMENT ON COLUMN public.essays.improved_essay IS 'AI-generated improved version of the original essay with corrections and enhancements. NULL for old essays that have not been regenerated.';
