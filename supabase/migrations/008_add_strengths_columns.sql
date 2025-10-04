-- Add strengths columns to essays table
-- Each criterion will have both errors (weaknesses) and strengths

ALTER TABLE public.essays
ADD COLUMN IF NOT EXISTS task_response_strengths text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS coherence_cohesion_strengths text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS lexical_resource_strengths text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS grammatical_accuracy_strengths text[] DEFAULT '{}';

-- Add comment to document the structure
COMMENT ON COLUMN public.essays.task_response_strengths IS 'Positive aspects with specific examples quoted from the essay';
COMMENT ON COLUMN public.essays.coherence_cohesion_strengths IS 'Good organization points with specific examples quoted from the essay';
COMMENT ON COLUMN public.essays.lexical_resource_strengths IS 'Advanced vocabulary usage with specific examples quoted from the essay';
COMMENT ON COLUMN public.essays.grammatical_accuracy_strengths IS 'Strong grammatical structures with specific examples quoted from the essay';
