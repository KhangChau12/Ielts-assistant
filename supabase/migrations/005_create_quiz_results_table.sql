-- Create quiz type enum
create type quiz_type as enum ('multiple_choice', 'fill_in');

-- Create quiz results table
create table public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  essay_id uuid references public.essays(id) on delete cascade not null,
  quiz_type quiz_type not null,
  score integer not null,
  total_questions integer not null,
  correct_answers jsonb,
  incorrect_answers jsonb,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.quiz_results enable row level security;

-- Policies
create policy "Users can view own quiz results"
  on quiz_results for select using (auth.uid() = user_id);

create policy "Users can insert own quiz results"
  on quiz_results for insert with check (auth.uid() = user_id);
