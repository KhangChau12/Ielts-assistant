# Premium UI Components

Professional, reusable UI components for the IELTS Assistant application using ocean/cyan color scheme.

## Components

### 1. SkeletonLoader
Loading placeholders with shimmer animation.

**Usage:**
```tsx
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from '@/components/common'

// Basic skeleton
<Skeleton className="h-4 w-full" />

// Pre-built card skeleton
<SkeletonCard />

// List skeleton (default 3 items)
<SkeletonList count={5} />

// Text skeleton (default 3 lines)
<SkeletonText lines={4} />
```

### 2. AnimatedNumber
Smooth number counter with easing animation.

**Props:**
- `value: number` - Target number to animate to
- `decimals?: number` - Decimal places (default: 0)
- `duration?: number` - Animation duration in ms (default: 1000)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { AnimatedNumber } from '@/components/common'

<AnimatedNumber value={85.5} decimals={1} duration={1500} />
```

### 3. GradientCard
Premium card with gradient background and optional hover effects.

**Props:**
- `children: ReactNode` - Card content
- `className?: string` - Additional CSS classes
- `interactive?: boolean` - Enable hover lift effect (default: false)

**Usage:**
```tsx
import { GradientCard } from '@/components/common'

<GradientCard interactive>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</GradientCard>
```

### 4. StatCard
Dashboard statistics card with icon, animated value, and optional trend indicator.

**Props:**
- `icon: LucideIcon` - Icon component from lucide-react
- `label: string` - Stat label/description
- `value: number` - Numeric value to display
- `trend?: 'up' | 'down'` - Trend direction (optional)
- `trendValue?: number` - Trend percentage value (optional)
- `decimals?: number` - Decimal places (default: 0)
- `suffix?: string` - Value suffix like '%' or 'pts' (optional)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { StatCard } from '@/components/common'
import { Award, TrendingUp } from 'lucide-react'

<StatCard
  icon={Award}
  label="Average Score"
  value={7.5}
  decimals={1}
  trend="up"
  trendValue={12.5}
/>
```

### 5. ProgressRing
Circular progress indicator with animated stroke and percentage display.

**Props:**
- `percentage: number` - Progress percentage (0-100)
- `size?: number` - Ring diameter in pixels (default: 120)
- `strokeWidth?: number` - Ring thickness (default: 8)
- `className?: string` - Additional CSS classes
- `showPercentage?: boolean` - Show percentage text (default: true)
- `label?: string` - Optional label below percentage

**Usage:**
```tsx
import { ProgressRing } from '@/components/common'

<ProgressRing
  percentage={75}
  size={100}
  label="Complete"
/>
```

**Color Coding:**
- 80-100%: Cyan (excellent)
- 60-79%: Ocean blue (good)
- 40-59%: Darker ocean (moderate)
- 0-39%: Slate (needs improvement)

## Design System

All components follow the ocean/cyan color scheme:
- Primary: Ocean blue (`#0ea5e9`)
- Accent: Cyan (`#06b6d4`)
- Gradients: Ocean to cyan
- Shadows: Colored shadows with ocean/cyan tints

## Styling Classes

These components use the following CSS classes from `globals.css`:
- `.skeleton` - Shimmer animation
- `.card-premium` - Premium card styling
- `.card-interactive` - Interactive hover effect
- `.gradient-ocean-bold` - Ocean gradient background
- `.shadow-colored` - Colored shadow effect

## Best Practices

1. **Skeleton Loaders**: Use while data is loading to improve perceived performance
2. **Animated Numbers**: Perfect for dashboard metrics and statistics
3. **Gradient Cards**: Use for important content sections and feature highlights
4. **Stat Cards**: Ideal for KPI dashboards and analytics views
5. **Progress Rings**: Great for completion rates, scores, and progress tracking

## Examples

### Dashboard Stats Row
```tsx
import { StatCard } from '@/components/common'
import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react'

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    icon={Award}
    label="Average Score"
    value={7.5}
    decimals={1}
    trend="up"
    trendValue={12.5}
  />
  <StatCard
    icon={BookOpen}
    label="Tests Completed"
    value={24}
  />
  <StatCard
    icon={Clock}
    label="Study Hours"
    value={48.5}
    decimals={1}
  />
  <StatCard
    icon={TrendingUp}
    label="Improvement"
    value={15}
    suffix="%"
    trend="up"
    trendValue={8.3}
  />
</div>
```

### Loading State
```tsx
import { SkeletonCard } from '@/components/common'

{isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SkeletonCard />
    <SkeletonCard />
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map(item => <Card key={item.id} {...item} />)}
  </div>
)}
```

### Progress Dashboard
```tsx
import { ProgressRing, GradientCard } from '@/components/common'

<GradientCard className="p-8">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold mb-2">Overall Progress</h3>
      <p className="text-slate-600">Keep up the great work!</p>
    </div>
    <ProgressRing
      percentage={75}
      size={120}
      label="Complete"
    />
  </div>
</GradientCard>
```
