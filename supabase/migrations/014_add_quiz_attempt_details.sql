-- Add missing columns to vocabulary_quiz_attempts table
-- These columns store detailed quiz results for review

ALTER TABLE public.vocabulary_quiz_attempts
ADD COLUMN IF NOT EXISTS correct_answers text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS incorrect_answers text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_type text DEFAULT NULL;

-- Add comments
COMMENT ON COLUMN public.vocabulary_quiz_attempts.correct_answers IS 'Array of correct answers given by the user';
COMMENT ON COLUMN public.vocabulary_quiz_attempts.incorrect_answers IS 'Array of incorrect answers with expected answers';
COMMENT ON COLUMN public.vocabulary_quiz_attempts.quiz_type IS 'Type of quiz taken: multiple_choice or fill_in';
