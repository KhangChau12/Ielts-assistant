# IELTS Assistant - AI-Powered Writing Coach

A comprehensive web application that helps students improve their IELTS Writing Task 2 skills through AI-powered scoring, detailed feedback, vocabulary enhancement, and interactive learning tools.

## Features

### For Students
- **AI Essay Scoring**: Get instant band scores (0-9) for all 4 IELTS criteria
  - Task Response
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy
- **Detailed Feedback**: Specific error identification and actionable comments
- **Progress Tracking**: Visual dashboard with score trends over time
- **Vocabulary Enhancement**:
  - Paraphrase suggestions for low-level vocabulary
  - Topic-specific C1-C2 level vocabulary
- **Interactive Learning**:
  - Spaced repetition flashcards
  - Multiple-choice and fill-in vocabulary quizzes
- **AI-Powered Insights**: Summary of your writing patterns and improvement recommendations

### For Administrators
- **User Statistics**: Total users, essays, and activity metrics
- **Token Usage Monitoring**: Track OpenAI API usage and costs
- **Score Analytics**: Distribution charts and average scores
- **Data Visualization**: Charts and graphs for all key metrics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI API (GPT-4 Turbo)
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- An OpenAI API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

Run the migration files in your Supabase SQL Editor in order:

1. `supabase/migrations/001_create_profiles_table.sql`
2. `supabase/migrations/002_create_essays_table.sql`
3. `supabase/migrations/003_create_vocabulary_table.sql`
4. `supabase/migrations/004_create_flashcards_table.sql`
5. `supabase/migrations/005_create_quiz_results_table.sql`
6. `supabase/migrations/006_create_token_usage_table.sql`
7. `supabase/migrations/007_create_indexes.sql`

**Important**: Copy and paste the contents of each file into the Supabase SQL Editor and execute them one by one.

### 4. Configure Email Authentication (Important!)

Enable email confirmation and customize email templates for a professional experience:

1. **Enable Email Confirmation:**
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Email confirmations"

2. **Add Redirect URLs:**
   - Go to Authentication → URL Configuration
   - Add these URLs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-domain.com/auth/callback` (production)

3. **Customize Email Templates:**
   - See detailed instructions in `docs/04_supabase_email_setup.md`
   - Templates include branded emails for IELTS Assistant

**Note**: For development, you can disable email confirmation, but **enable it for production**!

### 5. Create Admin User (Optional)

After signing up through the app, you can manually update a user to admin:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your_email@example.com';
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ielts-assistant/
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (dashboard)/         # Protected student pages
│   │   ├── dashboard/       # Student dashboard
│   │   ├── write/           # Essay submission and results
│   │   └── vocabulary/      # Vocabulary, flashcards, quizzes
│   ├── (admin)/             # Admin-only pages
│   ├── api/                 # API routes
│   │   ├── essays/          # Essay scoring and retrieval
│   │   ├── vocabulary/      # Vocabulary generation
│   │   ├── summary/         # Error summary
│   │   └── admin/           # Admin statistics
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components (Header, Footer)
│   ├── essay/               # Essay-related components
│   ├── dashboard/           # Dashboard components
│   ├── vocabulary/          # Vocabulary components
│   ├── admin/               # Admin components
│   └── common/              # Shared components
├── lib/
│   ├── supabase/            # Supabase client utilities
│   ├── openai/              # OpenAI client and prompts
│   └── utils/               # Utility functions
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
├── supabase/migrations/     # Database migration files
└── docs/                    # Documentation
```

## Usage Guide

### For Students

1. **Sign Up/Login**: Create an account or sign in
2. **Write an Essay**: Go to "Write Essay" and submit your IELTS Task 2 essay
3. **Review Feedback**: View detailed scores, comments, and errors
4. **Track Progress**: Check your dashboard for score trends
5. **Build Vocabulary**: Generate paraphrase or topic vocabulary from your essays
6. **Practice**: Use flashcards and quizzes to reinforce learning

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (only accessible with admin role)
2. **View Statistics**: See user counts, essay submissions, token usage
3. **Monitor Usage**: Track OpenAI API costs and usage patterns
4. **Refresh Data**: Click the refresh button to get the latest statistics

## Key Features Explained

### AI Essay Scoring

The application uses OpenAI's GPT-4 with carefully crafted prompts that include:
- Complete IELTS band descriptors (bands 5-9)
- Structured output format (errors → comments → scores)
- Integer scores for criteria, 0.5 rounding for overall

### Vocabulary Generation

- **Paraphrase**: Analyzes your essay to find ~7 low-level words and suggests C1-C2 alternatives
- **Topic**: Generates ~10 high-level words/collocations specific to the essay prompt

### Spaced Repetition Flashcards

Flashcards use a simple spaced repetition algorithm to help you remember vocabulary more effectively.

### Error Summary

AI analyzes up to 15 of your most recent errors to identify patterns, strengths, weaknesses, and provide actionable recommendations.

## Design System

The app uses an **Ocean Theme** with a professional, academic aesthetic:

- **Primary Colors**: Ocean blues (#0284c7, #0369a1, #075985)
- **Accent Colors**: Cyan (#06b6d4, #22d3ee)
- **Typography**: Inter font family
- **Components**: shadcn/ui for consistent, accessible UI

See `docs/02_design_system.md` for complete design guidelines.

## API Routes

### Essays
- `POST /api/essays/submit` - Submit essay for AI scoring
- `GET /api/essays/list` - Get user's essays
- `GET /api/essays/[id]` - Get specific essay

### Vocabulary
- `POST /api/vocabulary/paraphrase` - Generate paraphrase vocabulary
- `POST /api/vocabulary/topic` - Generate topic vocabulary
- `GET /api/vocabulary/[essayId]` - Get vocabulary for specific essay

### Flashcards
- `POST /api/flashcards/create` - Create flashcards from vocabulary
- `POST /api/flashcards/update` - Update flashcard with SRS algorithm

### Quiz
- `POST /api/quiz/submit` - Submit quiz results

### Other
- `POST /api/summary` - Generate AI error summary
- `GET /api/admin/stats` - Get admin statistics (admin only)

## Database Schema

See `docs/03_project_structure.md` for detailed database schema.

Key tables:
- `profiles` - User profiles (extends Supabase auth.users)
- `essays` - Essay submissions and scores
- `vocabulary` - Generated vocabulary items
- `flashcards` - Spaced repetition data
- `quiz_results` - Quiz performance tracking
- `token_usage` - OpenAI API usage logging

## Development

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Deployment

### Recommended Platform: Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel is optimized for Next.js and provides:
- Automatic deployments on push
- Environment variable management
- Edge network CDN
- Serverless functions

### Environment Variables for Production

Make sure to set all variables from `.env.example` in your Vercel dashboard, using your production Supabase credentials.

## Contributing

This is a workshop project. Feel free to extend it with:
- Writing Task 1 support
- More quiz types
- Advanced analytics
- Export functionality (PDF reports)
- Email notifications

## License

ISC

## Support

For questions or issues, please refer to the documentation in the `docs/` folder:
- `01_core_features.md` - Complete feature specification
- `02_design_system.md` - Design guidelines and color palette
- `03_project_structure.md` - Technical architecture

---

Built with ❤️ for IELTS students worldwide
