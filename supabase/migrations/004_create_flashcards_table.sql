-- Create flashcards table for spaced repetition
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vocab_id uuid references public.vocabulary(id) on delete cascade not null unique,
  next_review_date timestamp with time zone not null default now(),
  repetition_count integer default 0,
  ease_factor numeric(3,2) default 2.5,
  interval_days integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.flashcards enable row level security;

-- Policies
create policy "Users can manage own flashcards"
  on flashcards for all using (auth.uid() = user_id);
