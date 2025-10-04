import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { Essay } from '@/types/essay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, TrendingUp, Award, FileText, AlertCircle } from 'lucide-react'
import { ScoreChart } from './components/ScoreChart'
import { RecentEssaysTable } from './components/RecentEssaysTable'
import { ErrorHistory } from './components/ErrorHistory'
import { AISummaryButton } from './components/AISummaryButton'

interface DashboardStats {
  totalEssays: number
  averageScore: number | null
  latestScore: number | null
}

async function getDashboardData(userId: string) {
  const supabase = createServerClient()

  // Fetch all user essays
  const { data: essays, error } = await supabase
    .from('essays')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching essays:', error)
    return {
      essays: [],
      stats: {
        totalEssays: 0,
        averageScore: null,
        latestScore: null,
      },
    }
  }

  const typedEssays = (essays || []) as Essay[]

  // Calculate stats
  const totalEssays = typedEssays.length
  const essaysWithScores = typedEssays.filter((e) => e.overall_score !== null)
  const averageScore =
    essaysWithScores.length > 0
      ? essaysWithScores.reduce((acc, e) => acc + (e.overall_score || 0), 0) /
        essaysWithScores.length
      : null
  const latestScore = essaysWithScores.length > 0 ? essaysWithScores[0].overall_score : null

  const stats: DashboardStats = {
    totalEssays,
    averageScore,
    latestScore,
  }

  return { essays: typedEssays, stats }
}

export default async function DashboardPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session.user.id)
    .single()

  const userName = profile?.full_name || session.user.email?.split('@')[0] || 'Student'

  // Get dashboard data
  const { essays, stats } = await getDashboardData(session.user.id)

  // Prepare data for charts
  const recentEssays = essays.slice(0, 5)
  const chartData = essays
    .filter((e) => e.overall_score !== null)
    .reverse()
    .map((e, index) => ({
      essayNumber: index + 1,
      score: e.overall_score,
      date: e.created_at,
    }))

  // Collect errors from all essays for error history
  interface ErrorsByCriterion {
    taskResponse: string[]
    coherenceCohesion: string[]
    lexicalResource: string[]
    grammaticalAccuracy: string[]
  }

  const errorsByCriterion: ErrorsByCriterion = {
    taskResponse: [],
    coherenceCohesion: [],
    lexicalResource: [],
    grammaticalAccuracy: [],
  }

  essays.forEach((essay) => {
    if (essay.task_response_errors) {
      errorsByCriterion.taskResponse.push(...essay.task_response_errors)
    }
    if (essay.coherence_cohesion_errors) {
      errorsByCriterion.coherenceCohesion.push(...essay.coherence_cohesion_errors)
    }
    if (essay.lexical_resource_errors) {
      errorsByCriterion.lexicalResource.push(...essay.lexical_resource_errors)
    }
    if (essay.grammatical_accuracy_errors) {
      errorsByCriterion.grammaticalAccuracy.push(...essay.grammatical_accuracy_errors)
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ocean-800 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-ocean-600 text-lg">
          Track your progress and improve your IELTS writing skills
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-ocean-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-ocean-700">
              Total Essays
            </CardTitle>
            <BookOpen className="h-5 w-5 text-ocean-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-ocean-800">
              {stats.totalEssays}
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700">
              Average Score
            </CardTitle>
            <Award className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-800">
              {stats.averageScore?.toFixed(1) ?? '0.0'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Latest Score
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              {stats.latestScore?.toFixed(1) ?? '0.0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Progress Chart */}
      {chartData.length > 0 ? (
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score Progress Over Time
            </CardTitle>
            <CardDescription>
              Track your improvement across all submitted essays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreChart data={chartData} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score Progress Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="py-12">
            <div className="text-center text-ocean-600">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No scored essays yet</p>
              <p className="text-sm">Submit your first essay to see your progress!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Essays Table */}
      {recentEssays.length > 0 ? (
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Essays
            </CardTitle>
            <CardDescription>Your last 5 submitted essays</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentEssaysTable essays={recentEssays} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Essays
            </CardTitle>
          </CardHeader>
          <CardContent className="py-12">
            <div className="text-center text-ocean-600">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No essays yet</p>
              <p className="text-sm">Start writing to see your essays here!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error History Section */}
      {essays.length > 0 && (
        <Card className="border-ocean-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-ocean-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error History
                </CardTitle>
                <CardDescription>
                  Review common issues across your essays
                </CardDescription>
              </div>
              <AISummaryButton />
            </div>
          </CardHeader>
          <CardContent>
            <ErrorHistory errors={errorsByCriterion} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
