-- Create essays table
create table public.essays (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt text not null,
  essay_content text not null,
  overall_score numeric(3,1),
  task_response_score integer,
  coherence_cohesion_score integer,
  lexical_resource_score integer,
  grammatical_accuracy_score integer,
  task_response_comment text,
  coherence_cohesion_comment text,
  lexical_resource_comment text,
  grammatical_accuracy_comment text,
  task_response_errors jsonb,
  coherence_cohesion_errors jsonb,
  lexical_resource_errors jsonb,
  grammatical_accuracy_errors jsonb,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.essays enable row level security;

-- Policies
create policy "Users can view own essays"
  on essays for select using (auth.uid() = user_id);

create policy "Users can insert own essays"
  on essays for insert with check (auth.uid() = user_id);

create policy "Admins can view all essays"
  on essays for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
