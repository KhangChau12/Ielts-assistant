# IELTS4Life - AI-Powered Writing Coach

A comprehensive web application that helps students improve their IELTS Writing Task 2 skills through AI-powered scoring, detailed feedback, vocabulary enhancement, and interactive learning tools.

## Features

### For Students
- **AI Essay Scoring**: Get instant band scores (0-9) for all 4 IELTS criteria
  - Task Response
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy
- **Detailed Feedback**:
  - Specific error identification with quoted examples
  - Strengths analysis highlighting sophisticated language use
  - Balanced, actionable comments for each criterion
- **Progress Tracking**:
  - Visual dashboard with score trends over time
  - Recent essays overview with quick access
  - Score distribution charts (Y-axis starts at Band 4 for realistic scale)
- **Vocabulary Enhancement**:
  - Paraphrase suggestions (10 low-level words → C1-C2 alternatives)
  - Topic-specific C1-C2 level vocabulary (10 items)
  - Vocabulary tracking: view status and quiz scores
- **Interactive Learning**:
  - Spaced repetition flashcards
  - Multiple-choice and fill-in vocabulary quizzes
  - Quiz results tracked with best scores displayed
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

# Groq API Keys (supports multiple keys for rate limit rotation)
GROQ_API_KEY_1=your_first_groq_api_key
GROQ_API_KEY_2=your_second_groq_api_key
GROQ_API_KEY_3=your_third_groq_api_key

# Upstash Redis (optional for development, required for production)
# Sign up at https://upstash.com/ and create a Redis database
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note on Rate Limiting:**
- Upstash Redis is **optional** in development (requests will be allowed if not configured)
- **Highly recommended** for production to prevent API abuse
- Free tier available at [upstash.com](https://upstash.com/)

### 3. Set Up Database

Run the migration files in your Supabase SQL Editor in order:

1. `supabase/migrations/001_create_profiles_table.sql` - User profiles with auto-creation trigger
2. `supabase/migrations/002_create_essays_table.sql` - Essay submissions and scores
3. `supabase/migrations/003_create_vocabulary_table.sql` - Vocabulary items
4. `supabase/migrations/004_create_flashcards_table.sql` - Flashcard SRS data
5. `supabase/migrations/005_create_quiz_results_table.sql` - Quiz performance tracking
6. `supabase/migrations/006_create_token_usage_table.sql` - OpenAI API usage logging
7. `supabase/migrations/007_create_indexes.sql` - Performance indexes
8. `supabase/migrations/008_add_strengths_columns.sql` - Essay strengths tracking
9. `supabase/migrations/009_add_vocabulary_tracking.sql` - Vocabulary view/quiz tracking
10. `supabase/migrations/010_insert_missing_profiles.sql` - Fix missing profiles (run this if you get foreign key errors)

**Important**: Copy and paste the contents of each file into the Supabase SQL Editor and execute them one by one.

### 4. Configure Email Authentication (Important!)

Enable email confirmation and customize email templates for a professional experience:

1. **Enable Email Confirmation:**
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Confirm email" under Email Auth Providers

2. **Add Redirect URLs:**
   - Go to Authentication → URL Configuration
   - Add these URLs to "Site URL" and "Redirect URLs":
     - `http://localhost:3000` (development)
     - `http://localhost:3001` (development - alternative port)
     - `http://localhost:3002` (development - alternative port)
     - `http://localhost:3003` (development - alternative port)
     - `https://your-domain.com` (production)

3. **Customize Email Templates (Recommended):**
   - Go to Authentication → Email Templates
   - Select "Confirm signup"
   - Replace with the professional template from `supabase/templates/confirmation.html`
   - Features: Branded design, gradient buttons, clear CTAs, mobile-responsive

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

The application uses OpenAI's GPT-4 with carefully crafted prompts that focus on:
- **Realistic Assessment**: Authentic IELTS examiner perspective (Band 6-7 typical, Band 8-9 rare)
- **Holistic Evaluation**: AI evaluates essays as a whole, not mechanically counting errors
- **Complete Band Descriptors**: Bands 5-9 with detailed criteria for each level
- **Detailed Feedback Format**:
  - Strengths: Quoted examples of sophisticated language/structure
  - Errors: Individual errors listed separately (never grouped with "such as")
  - Comments: Balanced feedback acknowledging strengths first, then improvements
  - Scores: Integer scores (5-9) for each criterion, overall score rounded to 0.5

### Vocabulary Generation

- **Paraphrase**: Analyzes your essay to find 10 low-level words and suggests C1-C2 alternatives
- **Topic**: Generates 10 high-level words/collocations specific to the essay prompt
- **Tracking**: View status (not viewed/viewed/quiz score) for each vocabulary set

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
- `profiles` - User profiles (extends Supabase auth.users) with auto-creation trigger
- `essays` - Essay submissions, scores, errors, strengths, and comments
- `vocabulary` - Generated vocabulary items (paraphrase and topic-specific)
- `vocabulary_views` - Tracks when users view vocabulary sets
- `vocabulary_quiz_attempts` - Tracks quiz scores and attempts
- `flashcards` - Spaced repetition data with difficulty levels
- `quiz_results` - Quiz performance tracking with scores
- `token_usage` - OpenAI API usage logging for cost monitoring

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

## Known Issues & Troubleshooting

### "Foreign key constraint violation" when submitting essays
**Problem**: User exists in auth.users but not in profiles table.
**Solution**: Run migration `010_insert_missing_profiles.sql` to create missing profiles.

### Email confirmation not working
**Problem**: Emails not being sent or going to spam.
**Solution**:
1. Check Supabase Auth settings - ensure "Confirm email" is enabled
2. Add redirect URLs in Supabase dashboard
3. For production, use custom SMTP (Supabase free tier has email limits)

### Progress bar stuck or not showing
**Problem**: Progress indicator doesn't update during essay scoring.
**Solution**: This is normal - scoring takes ~15 seconds for essays, ~10 seconds for vocabulary generation.

## Contributing

This is a workshop project. Feel free to extend it with:
- Writing Task 1 support (graphs, charts, process diagrams)
- More quiz types (matching, ordering, speaking practice)
- Advanced analytics (word cloud, complexity metrics)
- Export functionality (PDF reports, essay history)
- Email notifications (weekly progress, achievement badges)
- Collaborative features (peer review, teacher feedback)

## License

ISC

## Support

For questions or issues, please refer to the documentation in the `docs/` folder:
- `01_core_features.md` - Complete feature specification
- `02_design_system.md` - Design guidelines and color palette
- `03_project_structure.md` - Technical architecture

---

Built with ❤️ for IELTS students worldwide
