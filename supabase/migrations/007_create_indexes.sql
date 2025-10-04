-- Performance indexes for essays
create index idx_essays_user_id on public.essays(user_id);
create index idx_essays_created_at on public.essays(created_at desc);

-- Performance indexes for vocabulary
create index idx_vocabulary_user_id on public.vocabulary(user_id);
create index idx_vocabulary_essay_id on public.vocabulary(essay_id);
create index idx_vocabulary_user_essay on public.vocabulary(user_id, essay_id);

-- Performance indexes for flashcards
create index idx_flashcards_user_id on public.flashcards(user_id);
create index idx_flashcards_next_review on public.flashcards(next_review_date);
create index idx_flashcards_vocab_id on public.flashcards(vocab_id);

-- Performance indexes for quiz results
create index idx_quiz_results_user_id on public.quiz_results(user_id);
create index idx_quiz_results_essay_id on public.quiz_results(essay_id);
create index idx_quiz_results_created_at on public.quiz_results(created_at desc);

-- Performance indexes for token usage
create index idx_token_usage_created_at on public.token_usage(created_at desc);
create index idx_token_usage_user_id on public.token_usage(user_id);
create index idx_token_usage_request_type on public.token_usage(request_type);
