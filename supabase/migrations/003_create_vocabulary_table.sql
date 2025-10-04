-- Create vocabulary type enum
create type vocab_type as enum ('paraphrase', 'topic');

-- Create vocabulary table
create table public.vocabulary (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  essay_id uuid references public.essays(id) on delete cascade not null,
  vocab_type vocab_type not null,
  original_word text,
  suggested_word text not null,
  definition text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.vocabulary enable row level security;

-- Policies
create policy "Users can view own vocabulary"
  on vocabulary for select using (auth.uid() = user_id);

create policy "Users can insert own vocabulary"
  on vocabulary for insert with check (auth.uid() = user_id);

create policy "Users can delete own vocabulary"
  on vocabulary for delete using (auth.uid() = user_id);
