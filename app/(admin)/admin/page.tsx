import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, Zap } from 'lucide-react'
import { AdminDashboardClient } from './components/AdminDashboardClient'

interface AdminStats {
  totalUsers: number
  ptnkUsers: number
  paidProUsers: number
  totalEssays: number
  totalInputTokens: number
  totalOutputTokens: number
  scoreDistribution: { [key: string]: number }
  avgOverallScore: number
  allUsers: Array<{
    id: string
    email: string
    created_at: string
    role: string
    essay_count: number
  }>
  essaysOverTime: Array<{
    date: string
    count: number
  }>
  // Vocabulary stats
  totalVocabulary: number
  totalQuizAttempts: number
  totalCorrectAnswers: number
  totalQuestions: number
  avgQuizScore: number
  avgParaphraseScore: number
  avgTopicScore: number
  quizAttemptsOverTime: Array<{
    score: number
    total_questions: number
    vocab_type: string
    created_at: string
    percentage: number
  }>
  usersOverTime: Array<{
    date: string
    count: number
  }>
  // Referral stats
  totalInvitedUsers: number
  uniqueReferrers: number
  inviteConversionRate: number
}

async function getAdminStats(): Promise<AdminStats> {
  try {
    // Determine the base URL based on environment
    let baseUrl: string

    if (process.env.VERCEL_URL) {
      // Running on Vercel
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else if (process.env.NODE_ENV === 'development') {
      // Local development - try common ports
      baseUrl = 'http://localhost:3001' // Your dev server port
    } else {
      // Production fallback
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ielts4life.com'
    }

    const response = await fetch(`${baseUrl}/api/admin/stats`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch admin stats')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      ptnkUsers: 0,
      paidProUsers: 0,
      totalEssays: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      scoreDistribution: {},
      avgOverallScore: 0,
      allUsers: [],
      essaysOverTime: [],
      totalVocabulary: 0,
      totalQuizAttempts: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0,
      avgQuizScore: 0,
      avgParaphraseScore: 0,
      avgTopicScore: 0,
      quizAttemptsOverTime: [],
      usersOverTime: [],
      totalInvitedUsers: 0,
      uniqueReferrers: 0,
      inviteConversionRate: 0,
    }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4">
      {/* Header */}
      <div className="mb-6 md:mb-8 animate-fadeInUp">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-ocean-600 text-sm md:text-base lg:text-lg">
          Monitor system statistics and user activity
        </p>
      </div>

      {/* Pass stats to client component for interactive features */}
      <AdminDashboardClient initialStats={stats} />
    </div>
  )
}
