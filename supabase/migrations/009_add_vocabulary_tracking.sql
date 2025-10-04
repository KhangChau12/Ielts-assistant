-- Add vocabulary tracking features

-- Table to track when user views vocabulary
CREATE TABLE IF NOT EXISTS public.vocabulary_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  essay_id uuid REFERENCES public.essays(id) ON DELETE CASCADE NOT NULL,
  vocab_type text NOT NULL CHECK (vocab_type IN ('paraphrase', 'topic')),
  viewed_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, essay_id, vocab_type)
);

-- Table to track quiz attempts and scores
CREATE TABLE IF NOT EXISTS public.vocabulary_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  essay_id uuid REFERENCES public.essays(id) ON DELETE CASCADE NOT NULL,
  vocab_type text NOT NULL CHECK (vocab_type IN ('paraphrase', 'topic')),
  score integer NOT NULL CHECK (score >= 0 AND score <= 20),
  total_questions integer NOT NULL DEFAULT 20,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_views_user_essay ON public.vocabulary_views(user_id, essay_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_quiz_attempts_user_essay ON public.vocabulary_quiz_attempts(user_id, essay_id);

-- Enable RLS
ALTER TABLE public.vocabulary_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vocabulary_views
CREATE POLICY "Users can view their own vocabulary views"
  ON public.vocabulary_views
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary views"
  ON public.vocabulary_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for vocabulary_quiz_attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON public.vocabulary_quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.vocabulary_quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.vocabulary_views IS 'Tracks when users view vocabulary for each essay';
COMMENT ON TABLE public.vocabulary_quiz_attempts IS 'Tracks quiz attempts and scores for vocabulary learning';
