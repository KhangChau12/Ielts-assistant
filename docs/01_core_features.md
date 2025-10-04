# IELTS Writing Assistant - Core Features

## Project Overview
A web-based AI-powered IELTS Writing Task 2 assistant to help students improve their writing skills through automated scoring, feedback, and vocabulary enhancement.

**Tech Stack:**
- Database: Supabase
- AI: OpenAI API
- Language: English (UI/UX)

---

## 1. Authentication System

### User Roles
- **Students**: Regular users who can submit essays, view history, track progress, and use vocab tools
- **Admin**: Single admin account for monitoring system statistics

---

## 2. Writing Assessment Section

### Submission Flow
1. Student inputs the essay prompt in one text box
2. Student inputs their essay in another text box
3. Submit to AI agent for scoring

### AI Scoring Process

**Generation Order** (to ensure accurate scoring):
1. **Error Analysis First**: Identify specific errors across all 4 criteria
2. **Comments per Criteria**: Based on errors found, provide detailed feedback
3. **Criteria Scores**: Integer scores (no decimals) for each criterion based on errors and comments
4. **Overall Score**: Average of 4 criteria, rounded to nearest 0.5

**Scoring Criteria** (Task 2):
- Task Response (TR)
- Coherence and Cohesion (CC)
- Lexical Resource (LR)
- Grammatical Range and Accuracy (GRA)

**Important Notes:**
- Individual criteria scores: **integers only** (5, 6, 7, etc.)
- Overall score: **rounded to 0.5** (5.5, 6.0, 6.5, etc.)
- Prompt must include complete band descriptors for accurate assessment

### Output Structure (JSON Format)

```json
{
  "essay_id": "uuid",
  "errors": {
    "task_response": ["error 1", "error 2", ...],
    "coherence_cohesion": ["error 1", "error 2", ...],
    "lexical_resource": ["error 1", "error 2", ...],
    "grammatical_accuracy": ["error 1", "error 2", ...]
  },
  "comments": {
    "task_response": "Detailed feedback...",
    "coherence_cohesion": "Detailed feedback...",
    "lexical_resource": "Detailed feedback...",
    "grammatical_accuracy": "Detailed feedback..."
  },
  "scores": {
    "task_response": 6,
    "coherence_cohesion": 7,
    "lexical_resource": 6,
    "grammatical_accuracy": 6
  },
  "overall_score": 6.5
}
```

### UI Display Requirements
Separate sections for:
- Overall score (prominent display)
- 4 criteria scores (individual cards/sections)
- Comments for each criterion (collapsible/expandable)
- Specific error lists for each criterion (grouped and formatted)

---

## 3. Student Dashboard

### Progress Tracking
- **Score Chart**: Line/bar graph showing overall scores across all submitted essays
- **Error History**: List view of all errors from all 4 criteria across submissions
  - Grouped by criterion
  - "Show More" pagination (don't display all at once)
  - Latest errors shown first

### AI Summary Feature
- **"Summarize Recent Errors" Button**
- Analyzes up to 15 most recent errors
- Provides:
  - Pattern recognition across errors
  - Strengths and weaknesses summary
  - Actionable improvement recommendations

---

## 4. Vocabulary Enhancement Section

### Access
- Available only after submitting at least one essay
- Shows list of essays with vocab generated
- Option to select which essay to generate vocab from

### Feature 1: Paraphrase Vocabulary Suggestions
**Button**: "Generate Paraphrase Vocabulary"

**Process**:
1. AI reads the student's essay
2. Identifies ~7 low-level vocabulary words or phrases that weaken the writing
3. Suggests higher-level alternatives or collocations

**Output Format**:
```
Low-level: "very important"
→ High-level: "crucial", "of paramount importance"
```

### Feature 2: High-Level Topic Vocabulary
**Button**: "Find Topic Vocabulary"

**Process**:
1. AI reads the essay prompt
2. Generates ~10 C1-C2 level words/collocations relevant to the topic
3. Contextualizes vocabulary specifically for the prompt

**Output Format**:
```
Word/Collocation: "socioeconomic disparity"
Definition: "The unequal distribution of wealth and resources across different social classes"
```

### Vocabulary Display
- Pairs of vocabulary + definition
- Clean, card-based layout
- Saved to user's personal vocabulary database

---

## 5. Vocabulary Practice Tools

### Flashcard System
- **"Create Flashcards"** button for each essay's vocabulary
- Spaced repetition algorithm (e.g., SM-2 or Leitner system)
- Front: Definition or example sentence
- Back: Vocabulary word/collocation

### Vocabulary Quiz
**"Test Vocabulary Knowledge"** button

**Quiz Type 1: Multiple Choice (Easy)**
- Display: Definition
- Options: 4 vocabulary words from database (1 correct, 3 distractors)

**Quiz Type 2: Fill-in (Hard)**
- Display: Definition + first letter of the word
- Input: Student types the complete word

**Quiz Settings**:
- Randomly select from user's saved vocabulary
- Track correct/incorrect answers
- Show results with explanations

---

## 6. Admin Dashboard

### Statistics to Display
All data pulled from Supabase (real-time, not hardcoded):

**Token Usage**:
- Total input tokens
- Total output tokens
- Token usage over time (chart)
- Cost estimation (optional)

**User Statistics**:
- Total number of users
- Active users (last 7/30 days)
- User list with registration dates

**Essay Statistics**:
- Total essays submitted
- Score distribution (histogram/bar chart)
- Average scores per criterion
- Essays submitted over time (trend line)

### Data Handling
- **Initial Load**: Auto-fetch data on first page load
- **Updates**: Manual refresh button (avoid continuous polling)
- **Empty State**: Graceful handling when no data exists (placeholders, empty state messages)

---

## 7. Homepage (Landing Page)

### Purpose
Quick overview of features for new users

### Sections
1. **Hero Section**: Main value proposition
2. **Feature Highlights**:
   - AI-Powered Essay Scoring
   - Detailed Feedback & Error Analysis
   - Progress Tracking Dashboard
   - Vocabulary Enhancement Tools
   - Interactive Practice (Flashcards & Quizzes)
3. **How It Works**: 3-4 step process
4. **CTA**: Sign Up / Get Started button

### Design
- Clean, modern, professional
- Responsive layout
- Screenshots/mockups of key features (optional)

---

## 8. Database Structure (Supabase)

### Required Tables
1. **users**
   - id (uuid, primary key)
   - email (unique)
   - role (student/admin)
   - created_at

2. **essays**
   - id (uuid, primary key)
   - user_id (foreign key → users)
   - prompt (text)
   - essay_content (text)
   - scores (jsonb) - stores all 4 scores + overall
   - comments (jsonb)
   - errors (jsonb)
   - created_at

3. **vocabulary**
   - id (uuid, primary key)
   - user_id (foreign key → users)
   - essay_id (foreign key → essays)
   - vocab_type (paraphrase/topic)
   - original_word (text, nullable for topic vocab)
   - suggested_word (text)
   - definition (text)
   - created_at

4. **flashcards**
   - id (uuid, primary key)
   - user_id (foreign key → users)
   - vocab_id (foreign key → vocabulary)
   - next_review_date (timestamp)
   - repetition_count (integer)
   - ease_factor (float)

5. **quiz_results**
   - id (uuid, primary key)
   - user_id (foreign key → users)
   - essay_id (foreign key → essays)
   - quiz_type (multiple_choice/fill_in)
   - score (integer)
   - total_questions (integer)
   - created_at

6. **token_usage**
   - id (uuid, primary key)
   - user_id (foreign key → users)
   - request_type (scoring/vocab_paraphrase/vocab_topic/summary)
   - input_tokens (integer)
   - output_tokens (integer)
   - created_at

---

## 9. Key Implementation Notes

### AI Prompt Engineering
- Include complete IELTS Task 2 band descriptors in system prompt
- Enforce structured JSON output
- Ensure error analysis happens before scoring
- Validate that criteria scores are integers and overall is rounded to 0.5

### UI/UX Priorities
- Mobile responsive
- Loading states for all AI operations
- Error handling and retry mechanisms
- Clear data visualization
- Intuitive navigation

### Performance Considerations
- Lazy loading for error lists (pagination)
- Efficient database queries (indexes on foreign keys, created_at)
- Caching for admin dashboard statistics (manual refresh)
