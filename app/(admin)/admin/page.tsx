import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, Zap } from 'lucide-react'
import { AdminDashboardClient } from './components/AdminDashboardClient'

interface AdminStats {
  totalUsers: number
  totalEssays: number
  totalInputTokens: number
  totalOutputTokens: number
  scoreDistribution: { [key: string]: number }
  avgOverallScore: number
  recentUsers: Array<{
    id: string
    email: string
    created_at: string
    role: string
  }>
  essaysOverTime: Array<{
    overall_score: number | null
    created_at: string
  }>
}

async function getAdminStats(): Promise<AdminStats> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
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
      totalEssays: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      scoreDistribution: {},
      avgOverallScore: 0,
      recentUsers: [],
      essaysOverTime: [],
    }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-ocean-600 text-lg">
          Monitor system statistics and user activity
        </p>
      </div>

      {/* Pass stats to client component for interactive features */}
      <AdminDashboardClient initialStats={stats} />
    </div>
  )
}
