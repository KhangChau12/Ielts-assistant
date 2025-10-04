# Design System & UI Guidelines

## Color Palette

### Primary Colors (Ocean-Tech Theme)

**Ocean Blue Scale:**
```css
--ocean-50:  #f0f9ff   /* Lightest - backgrounds, cards */
--ocean-100: #e0f2fe   /* Very light - hover backgrounds */
--ocean-200: #bae6fd   /* Light - disabled states */
--ocean-300: #7dd3fc   /* Soft - borders, dividers */
--ocean-400: #38bdf8   /* Medium-light - secondary elements */
--ocean-500: #0ea5e9   /* Base - highlights, links */
--ocean-600: #0284c7   /* Medium - primary buttons, active states */
--ocean-700: #0369a1   /* Deep - headings, important elements */
--ocean-800: #075985   /* Dark - navigation, text */
--ocean-900: #0c4a6e   /* Darkest - footers, emphasis */
```

**Cyan/Neon Accent Scale:**
```css
--cyan-300: #67e8f9    /* Electric - badges, notifications */
--cyan-400: #22d3ee    /* Bright - active states, progress */
--cyan-500: #06b6d4    /* Base - success, completion */
--cyan-600: #0891b2    /* Deep - hover on cyan elements */
```

**Neutral/Supporting Colors:**
```css
--slate-50:  #f8fafc   /* Backgrounds */
--slate-100: #f1f5f9   /* Card backgrounds */
--slate-200: #e2e8f0   /* Borders */
--slate-300: #cbd5e1   /* Disabled */
--slate-400: #94a3b8   /* Placeholder text */
--slate-500: #64748b   /* Secondary text */
--slate-600: #475569   /* Body text */
--slate-700: #334155   /* Headings */
--slate-800: #1e293b   /* Dark headings */
--slate-900: #0f172a   /* Maximum contrast */
```

**Semantic Colors:**
```css
/* Success */
--success-light: #d1fae5
--success-base:  #10b981
--success-dark:  #059669

/* Warning */
--warning-light: #fef3c7
--warning-base:  #f59e0b
--warning-dark:  #d97706

/* Error */
--error-light: #fee2e2
--error-base:  #ef4444
--error-dark:  #dc2626

/* Info */
--info-light: #dbeafe
--info-base:  #3b82f6
--info-dark:  #2563eb
```

---

## Typography

### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Manrope', 'Inter', sans-serif; /* For hero/large headings */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* For code/scores */
```

### Font Sizes
```css
--text-xs:   0.75rem;   /* 12px - captions, labels */
--text-sm:   0.875rem;  /* 14px - small text, metadata */
--text-base: 1rem;      /* 16px - body text */
--text-lg:   1.125rem;  /* 18px - emphasized text */
--text-xl:   1.25rem;   /* 20px - small headings */
--text-2xl:  1.5rem;    /* 24px - section headings */
--text-3xl:  1.875rem;  /* 30px - page titles */
--text-4xl:  2.25rem;   /* 36px - hero headings */
--text-5xl:  3rem;      /* 48px - landing page hero */
```

### Font Weights
```css
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight:  1.25;  /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

---

## Spacing Scale

```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## Border Radius

```css
--radius-sm:   0.25rem;  /* 4px - small elements */
--radius-base: 0.5rem;   /* 8px - buttons, inputs */
--radius-md:   0.75rem;  /* 12px - cards */
--radius-lg:   1rem;     /* 16px - large cards */
--radius-xl:   1.5rem;   /* 24px - modals */
--radius-full: 9999px;   /* Pills, avatars */
```

---

## Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**Colored Shadows (for emphasis):**
```css
--shadow-ocean: 0 10px 15px -3px rgba(14, 165, 233, 0.2);
--shadow-cyan: 0 10px 15px -3px rgba(6, 182, 212, 0.3);
```

---

## Component Guidelines

### Buttons

**Primary Button:**
- Background: `--ocean-600`
- Hover: `--ocean-700`
- Active: `--ocean-800`
- Text: White
- Padding: `--space-3` `--space-6`
- Border radius: `--radius-base`
- Shadow: `--shadow-sm`, hover `--shadow-ocean`

**Secondary Button:**
- Background: `--ocean-100`
- Hover: `--ocean-200`
- Text: `--ocean-700`
- Border: 1px solid `--ocean-300`

**Success Button (for "Submit Essay"):**
- Background: `--cyan-500`
- Hover: `--cyan-600`
- Text: White
- Glow effect on hover: `--shadow-cyan`

**Ghost Button:**
- Background: Transparent
- Hover: `--ocean-50`
- Text: `--ocean-600`
- Border: 1px solid `--ocean-300`

### Cards

**Standard Card:**
- Background: White
- Border: 1px solid `--slate-200`
- Border radius: `--radius-md`
- Padding: `--space-6`
- Shadow: `--shadow-sm`
- Hover: `--shadow-md` (if interactive)

**Score Card (for criteria display):**
- Background: Gradient from `--ocean-50` to white
- Border: 2px solid `--ocean-200`
- Border radius: `--radius-lg`
- Padding: `--space-6`
- Score number: `--text-4xl`, `--font-bold`, `--ocean-700`

**Overall Score Card:**
- Background: `--ocean-600`
- Text: White
- Border radius: `--radius-xl`
- Padding: `--space-8`
- Shadow: `--shadow-ocean`
- Score: `--text-5xl`, `--font-extrabold`

### Inputs & Textareas

**Text Input:**
- Background: White
- Border: 2px solid `--slate-300`
- Focus border: `--ocean-500`
- Border radius: `--radius-base`
- Padding: `--space-3` `--space-4`
- Font size: `--text-base`
- Placeholder: `--slate-400`

**Textarea (Essay Input):**
- Min height: 300px
- Font: `--font-primary`
- Line height: `--leading-relaxed`
- Resize: vertical

### Navigation

**Top Navigation Bar:**
- Background: `--ocean-900`
- Text: White
- Active link: `--cyan-400`
- Hover: `--ocean-800`
- Height: 64px
- Shadow: `--shadow-md`

**Sidebar (if used):**
- Background: `--slate-50`
- Border right: 1px solid `--slate-200`
- Active item background: `--ocean-100`
- Active item text: `--ocean-700`

### Badges & Tags

**Score Badge:**
- Background: `--cyan-500`
- Text: White
- Padding: `--space-1` `--space-3`
- Border radius: `--radius-full`
- Font weight: `--font-semibold`
- Font size: `--text-sm`

**Status Badge:**
- Success: `--success-base` background
- Warning: `--warning-base` background
- Error: `--error-base` background
- Info: `--info-base` background

### Charts & Data Visualization

**Chart Colors (for score trends):**
```css
--chart-line: --ocean-600
--chart-fill: linear-gradient(to bottom, rgba(14, 165, 233, 0.2), transparent)
--chart-grid: --slate-200
--chart-axis: --slate-400
```

**Multi-series Chart (for 4 criteria):**
- Task Response: `--ocean-600`
- Coherence & Cohesion: `--cyan-500`
- Lexical Resource: `--ocean-400`
- Grammatical Accuracy: `--slate-600`

### Loading States

**Spinner:**
- Color: `--ocean-600`
- Size: 40px for page load, 20px for inline

**Skeleton Loader:**
- Background: `--slate-100`
- Shimmer: `--slate-200` to `--slate-100` animation

**Progress Bar:**
- Background: `--slate-200`
- Fill: Gradient from `--cyan-400` to `--ocean-500`
- Height: 8px
- Border radius: `--radius-full`

### Modals & Overlays

**Modal:**
- Background: White
- Border radius: `--radius-xl`
- Padding: `--space-8`
- Max width: 600px
- Shadow: `--shadow-xl`

**Backdrop:**
- Background: `rgba(15, 23, 42, 0.75)` (--slate-900 with opacity)
- Backdrop blur: 4px

---

## Layout Guidelines

### Container Widths
```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
```

### Page Padding
- Mobile: `--space-4`
- Tablet: `--space-6`
- Desktop: `--space-8`

### Content Sections
- Spacing between sections: `--space-16` (desktop), `--space-12` (mobile)

---

## Responsive Breakpoints

```css
--screen-sm: 640px   /* Mobile landscape */
--screen-md: 768px   /* Tablet */
--screen-lg: 1024px  /* Desktop */
--screen-xl: 1280px  /* Large desktop */
--screen-2xl: 1536px /* Extra large */
```

---

## Animation & Transitions

```css
--transition-fast: 150ms ease-in-out
--transition-base: 250ms ease-in-out
--transition-slow: 350ms ease-in-out
```

**Common Animations:**
- Button hover: transform scale(1.02) + shadow change
- Card hover: subtle lift (translateY(-2px)) + shadow
- Page transitions: fade-in 300ms
- Loading spinner: rotate 360deg, 1s linear infinite

---

## Accessibility

### Contrast Ratios
- Body text: Minimum 4.5:1 against background
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1

### Focus States
- Outline: 2px solid `--ocean-500`
- Outline offset: 2px
- Never remove focus outlines completely

### Interactive Elements
- Minimum tap target: 44x44px (mobile)
- Minimum click target: 40x40px (desktop)

---

## Icon Library

**Recommended:** Lucide Icons or Heroicons (outline for UI, solid for emphasis)

**Common Icons Needed:**
- Navigation: Home, Dashboard, FileText, BookOpen, User, Settings
- Actions: Edit, Trash2, Download, RefreshCw, Plus, Check
- Feedback: AlertCircle, CheckCircle, XCircle, Info
- Essay: PenTool, FileText, Target, TrendingUp
- Vocabulary: BookMarked, Sparkles, Layers

---

## Design Principles

1. **Clarity First**: Academic context requires excellent readability
2. **Hierarchy**: Clear visual hierarchy for scores, feedback, and content
3. **Consistency**: Maintain spacing, colors, and patterns throughout
4. **Breathing Room**: Generous white space prevents overwhelming users
5. **Feedback**: Always provide visual feedback for actions (loading, success, error)
6. **Progressive Disclosure**: Use accordions/tabs for dense content (errors, comments)
7. **Mobile-First**: Design for mobile, enhance for desktop

---

## Page-Specific Guidelines

### Homepage/Landing
- Hero section: Full-width, `--ocean-900` background with gradient
- Feature cards: 3-column grid (desktop), stack on mobile
- CTA buttons: Large, prominent, `--cyan-500` with glow effect

### Dashboard
- Grid layout: 2-3 columns (desktop), single column (mobile)
- Score chart: Prominent, top of page
- Quick stats: Small cards with icons and numbers
- Recent essays: Table or card list with "View Details" actions

### Essay Submission Page
- Two-column layout: Prompt (left), Essay (right) on desktop
- Stack vertically on mobile
- Character/word counter: Bottom right of textarea
- Submit button: Fixed at bottom or floating

### Results Page
- Overall score: Hero card at top, centered
- 4 criteria: 2x2 grid (desktop), stack (mobile)
- Errors: Collapsible sections per criterion
- Comments: Expandable cards with subtle background

### Vocabulary Page
- Flashcard view: Centered, large card with flip animation
- List view: Table with alternating row colors
- Quiz mode: Full-screen, minimal distractions
- Progress indicator: Top of screen during quiz

### Admin Dashboard
- Metrics: Cards with large numbers and trend indicators
- Charts: Full-width sections with filters
- User list: Sortable table with pagination
- Refresh button: Top-right corner, with timestamp of last update
