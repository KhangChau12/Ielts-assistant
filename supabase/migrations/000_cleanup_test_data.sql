-- Migration: Cleanup vocabulary test data only (KEEP essays!)
-- This will delete all vocabulary-related data so you can regenerate vocab without re-scoring essays

-- Delete all quiz results (depends on vocabulary)
DELETE FROM quiz_results;

-- Delete all vocabulary quiz attempts (if exists)
DELETE FROM vocabulary_quiz_attempts;

-- Delete all vocabulary views tracking (if exists)
DELETE FROM vocabulary_views;

-- Delete all flashcards (depends on vocabulary)
DELETE FROM flashcards;

-- Delete all vocabulary items (paraphrase + topic vocab)
DELETE FROM vocabulary;

-- Verify cleanup (essays should remain, vocab should be 0)
SELECT
  'essays' as table_name, COUNT(*) as remaining_rows FROM essays
UNION ALL
SELECT 'vocabulary (should be 0)', COUNT(*) FROM vocabulary
UNION ALL
SELECT 'quiz_results (should be 0)', COUNT(*) FROM quiz_results
UNION ALL
SELECT 'flashcards (should be 0)', COUNT(*) FROM flashcards
UNION ALL
SELECT 'vocabulary_views (should be 0)', COUNT(*) FROM vocabulary_views
UNION ALL
SELECT 'vocabulary_quiz_attempts (should be 0)', COUNT(*) FROM vocabulary_quiz_attempts;
