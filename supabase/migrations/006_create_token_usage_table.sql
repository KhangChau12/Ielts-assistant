-- Create request type enum
create type request_type as enum ('scoring', 'vocab_paraphrase', 'vocab_topic', 'summary');

-- Create token usage table
create table public.token_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  request_type request_type not null,
  input_tokens integer not null,
  output_tokens integer not null,
  model text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.token_usage enable row level security;

-- Policies
create policy "Admins can view all token usage"
  on token_usage for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "System can insert token usage"
  on token_usage for insert with check (true);
