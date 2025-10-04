# Project Structure & Tech Stack

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **Icons**: Lucide React
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Zustand (for global state)
- **HTTP Client**: Native fetch with custom hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API Routes**: Next.js API Routes
- **AI Integration**: OpenAI API (GPT-4 or GPT-4-turbo)
- **Environment**: Node.js runtime

### Development Tools
- **Package Manager**: npm or pnpm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky (optional)

---

## Project Directory Structure

```
ielts-assistant/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth group layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/              # Protected routes group
│   │   │   ├── layout.tsx            # Dashboard layout with nav
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Student dashboard
│   │   │   ├── write/
│   │   │   │   ├── page.tsx          # Essay submission
│   │   │   │   └── [essayId]/
│   │   │   │       └── page.tsx      # Essay results
│   │   │   ├── vocabulary/
│   │   │   │   ├── page.tsx          # Vocab list/selection
│   │   │   │   └── [essayId]/
│   │   │   │       ├── page.tsx      # Vocab for specific essay
│   │   │   │       ├── flashcards/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── quiz/
│   │   │   │           └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx          # Essay history
│   │   │
│   │   ├── (admin)/                  # Admin routes
│   │   │   ├── layout.tsx            # Admin layout
│   │   │   └── admin/
│   │   │       └── page.tsx          # Admin dashboard
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/    # Auth endpoints
│   │   │   ├── essays/
│   │   │   │   ├── submit/
│   │   │   │   │   └── route.ts      # Submit essay for scoring
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts      # Get essay by ID
│   │   │   │   └── list/
│   │   │   │       └── route.ts      # Get user's essays
│   │   │   ├── vocabulary/
│   │   │   │   ├── paraphrase/
│   │   │   │   │   └── route.ts      # Generate paraphrase vocab
│   │   │   │   └── topic/
│   │   │   │       └── route.ts      # Generate topic vocab
│   │   │   ├── flashcards/
│   │   │   │   ├── create/
│   │   │   │   │   └── route.ts
│   │   │   │   └── update/
│   │   │   │       └── route.ts      # Update SRS data
│   │   │   ├── quiz/
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts      # Generate quiz questions
│   │   │   │   └── submit/
│   │   │   │       └── route.ts      # Submit quiz results
│   │   │   ├── summary/
│   │   │   │   └── route.ts          # Summarize recent errors
│   │   │   └── admin/
│   │   │       └── stats/
│   │   │           └── route.ts      # Admin statistics
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage/landing page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── accordion.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── essay/                    # Essay-related components
│   │   │   ├── EssayForm.tsx
│   │   │   ├── EssayResults.tsx
│   │   │   ├── OverallScoreCard.tsx
│   │   │   ├── CriteriaCard.tsx
│   │   │   ├── ErrorList.tsx
│   │   │   └── CommentSection.tsx
│   │   │
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── ScoreChart.tsx
│   │   │   ├── RecentEssays.tsx
│   │   │   ├── ErrorHistory.tsx
│   │   │   ├── SummarizeButton.tsx
│   │   │   └── StatsCard.tsx
│   │   │
│   │   ├── vocabulary/               # Vocabulary components
│   │   │   ├── VocabCard.tsx
│   │   │   ├── VocabList.tsx
│   │   │   ├── Flashcard.tsx
│   │   │   ├── QuizMultipleChoice.tsx
│   │   │   ├── QuizFillIn.tsx
│   │   │   └── QuizResults.tsx
│   │   │
│   │   ├── admin/                    # Admin components
│   │   │   ├── TokenUsageChart.tsx
│   │   │   ├── UserStatsTable.tsx
│   │   │   ├── ScoreDistribution.tsx
│   │   │   └── RefreshButton.tsx
│   │   │
│   │   └── common/                   # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Pagination.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── lib/                          # Utilities and configs
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase client
│   │   │   ├── server.ts             # Server-side Supabase
│   │   │   └── middleware.ts         # Auth middleware
│   │   │
│   │   ├── openai/
│   │   │   ├── client.ts             # OpenAI client
│   │   │   ├── prompts.ts            # Prompt templates
│   │   │   └── schema.ts             # Response schemas
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                 # Class name utility
│   │   │   ├── date.ts               # Date formatting
│   │   │   ├── score.ts              # Score calculations
│   │   │   └── validation.ts         # Input validation
│   │   │
│   │   └── constants.ts              # App constants
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useUser.ts                # Get current user
│   │   ├── useEssays.ts              # Fetch essays
│   │   ├── useVocabulary.ts          # Fetch vocabulary
│   │   ├── useFlashcards.ts          # Flashcard logic with SRS
│   │   ├── useDebounce.ts            # Debounce hook
│   │   └── useLocalStorage.ts        # Local storage hook
│   │
│   ├── types/                        # TypeScript types
│   │   ├── database.ts               # Supabase generated types
│   │   ├── essay.ts                  # Essay types
│   │   ├── vocabulary.ts             # Vocabulary types
│   │   ├── user.ts                   # User types
│   │   └── api.ts                    # API response types
│   │
│   └── store/                        # Global state (Zustand)
│       ├── authStore.ts              # Auth state
│       └── uiStore.ts                # UI state (modals, toasts)
│
├── supabase/
│   ├── migrations/                   # Database migrations
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_essays_table.sql
│   │   ├── 003_create_vocabulary_table.sql
│   │   ├── 004_create_flashcards_table.sql
│   │   ├── 005_create_quiz_results_table.sql
│   │   ├── 006_create_token_usage_table.sql
│   │   └── 007_create_indexes.sql
│   │
│   └── seed.sql                      # Seed data (optional)
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── docs/                             # Documentation
│   ├── 01_core_features.md
│   ├── 02_design_system.md
│   ├── 03_project_structure.md
│   └── 04_api_documentation.md       # (to be created)
│
├── .env.local                        # Environment variables
├── .env.example                      # Example env file
├── .gitignore
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json
├── components.json                   # shadcn/ui config
└── README.md
```

---

## Database Schema (Supabase Migrations)

### Migration Files Breakdown

**001_create_users_table.sql**
```sql
-- Extends Supabase auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
```

**002_create_essays_table.sql**
```sql
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

alter table public.essays enable row level security;

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
```

**003_create_vocabulary_table.sql**
```sql
create type vocab_type as enum ('paraphrase', 'topic');

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

alter table public.vocabulary enable row level security;

create policy "Users can view own vocabulary"
  on vocabulary for select using (auth.uid() = user_id);

create policy "Users can insert own vocabulary"
  on vocabulary for insert with check (auth.uid() = user_id);
```

**004_create_flashcards_table.sql**
```sql
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vocab_id uuid references public.vocabulary(id) on delete cascade not null,
  next_review_date timestamp with time zone not null default now(),
  repetition_count integer default 0,
  ease_factor numeric(3,2) default 2.5,
  interval_days integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.flashcards enable row level security;

create policy "Users can manage own flashcards"
  on flashcards for all using (auth.uid() = user_id);
```

**005_create_quiz_results_table.sql**
```sql
create type quiz_type as enum ('multiple_choice', 'fill_in');

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

alter table public.quiz_results enable row level security;

create policy "Users can view own quiz results"
  on quiz_results for select using (auth.uid() = user_id);

create policy "Users can insert own quiz results"
  on quiz_results for insert with check (auth.uid() = user_id);
```

**006_create_token_usage_table.sql**
```sql
create type request_type as enum ('scoring', 'vocab_paraphrase', 'vocab_topic', 'summary');

create table public.token_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  request_type request_type not null,
  input_tokens integer not null,
  output_tokens integer not null,
  model text not null,
  created_at timestamp with time zone default now()
);

alter table public.token_usage enable row level security;

create policy "Admins can view all token usage"
  on token_usage for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "System can insert token usage"
  on token_usage for insert with check (true);
```

**007_create_indexes.sql**
```sql
-- Performance indexes
create index idx_essays_user_id on public.essays(user_id);
create index idx_essays_created_at on public.essays(created_at desc);
create index idx_vocabulary_user_id on public.vocabulary(user_id);
create index idx_vocabulary_essay_id on public.vocabulary(essay_id);
create index idx_flashcards_user_id on public.flashcards(user_id);
create index idx_flashcards_next_review on public.flashcards(next_review_date);
create index idx_quiz_results_user_id on public.quiz_results(user_id);
create index idx_token_usage_created_at on public.token_usage(created_at desc);
```

---

## Environment Variables

**.env.local**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Libraries & Versions

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "openai": "^4.20.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tabs": "^1.0.4",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.52.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Development Workflow

### Setup Steps
1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values
4. Run Supabase migrations (via Supabase dashboard SQL editor)
5. Initialize shadcn/ui: `npx shadcn-ui@latest init`
6. Run dev server: `npm run dev`

### Build Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## API Route Structure

All API routes follow RESTful conventions:

**Pattern**: `/api/[resource]/[action]`

**Example**:
- POST `/api/essays/submit` - Submit essay for scoring
- GET `/api/essays/list` - Get user's essays
- GET `/api/essays/[id]` - Get specific essay
- POST `/api/vocabulary/paraphrase` - Generate paraphrase vocab
- POST `/api/vocabulary/topic` - Generate topic vocab

**Standard Response Format**:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

---

## Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Supabase creates user in `auth.users`
3. Trigger creates profile in `public.profiles`
4. JWT token stored in cookie
5. Middleware checks auth on protected routes
6. RLS policies enforce data access

---

## Deployment Recommendations

**Platform**: Vercel (optimal for Next.js)

**Steps**:
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy (automatic on git push)

**Supabase**: Already hosted, just ensure production keys are used

---

## Testing Strategy (Future Consideration)

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright or Cypress
- **API Tests**: Supertest or Postman
- **E2E Tests**: Playwright for critical user flows
