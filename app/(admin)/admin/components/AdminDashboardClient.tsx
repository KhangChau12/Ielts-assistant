'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, Zap, RefreshCw, BookOpen, Award, Brain } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface AdminStats {
  totalUsers: number
  ptnkUsers: number
  paidProUsers: number
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
}

interface AdminDashboardClientProps {
  initialStats: AdminStats
}

export function AdminDashboardClient({ initialStats }: AdminDashboardClientProps) {
  const [stats, setStats] = useState<AdminStats>(initialStats)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/stats', {
        cache: 'no-store',
      })
      if (response.ok) {
        const newStats = await response.json()
        setStats(newStats)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Prepare token usage over time data
  const tokenUsageData = stats.essaysOverTime
    .reduce((acc: any[], essay) => {
      const date = format(new Date(essay.created_at), 'MMM dd')
      const existing = acc.find((item) => item.date === date)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ date, count: 1 })
      }
      return acc
    }, [])
    .slice(-10)

  // Prepare score distribution data (Band 8-9 merged)
  const scoreDistributionData = [5, 6, 7, 8].map((score) => ({
    score: score === 8 ? 'Band 8-9' : `Band ${score}`,
    count: stats.scoreDistribution[score] || 0,
  }))

  // Prepare essays over time data (CUMULATIVE - always increasing!)
  const essaysOverTimeData = (() => {
    // Group essays by date and count
    const dailyCounts: { [key: string]: number } = {}

    stats.essaysOverTime.forEach(essay => {
      const date = format(new Date(essay.created_at), 'MMM dd')
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    // Get last 14 days
    const allDates = Object.keys(dailyCounts).sort()
    const last14Dates = allDates.slice(-14)

    // Calculate cumulative total for each date
    let cumulativeTotal = 0
    return last14Dates.map(date => {
      cumulativeTotal += dailyCounts[date]
      return {
        date,
        essays: cumulativeTotal
      }
    })
  })()

  // Prepare quiz performance data
  const quizPerformanceData = stats.quizAttemptsOverTime
    ?.reduce((acc: any[], quiz) => {
      const date = format(new Date(quiz.created_at), 'MMM dd')
      const existing = acc.find((item) => item.date === date)
      if (existing) {
        existing.attempts += 1
        existing.totalPercentage += quiz.percentage
        existing.avgPercentage = existing.totalPercentage / existing.attempts
      } else {
        acc.push({
          date,
          attempts: 1,
          totalPercentage: quiz.percentage,
          avgPercentage: quiz.percentage,
        })
      }
      return acc
    }, [])
    .slice(-14) || []

  // Token usage pie chart data - Lighter, more vibrant colors
  const tokenPieData = [
    { name: 'Input Tokens', value: stats.totalInputTokens, color: '#22d3ee' }, // Light cyan
    { name: 'Output Tokens', value: stats.totalOutputTokens, color: '#a78bfa' }, // Light purple
  ]

  // User type distribution pie chart data - Lighter, more vibrant colors
  const userTypeData = [
    { name: 'Free Users', value: stats.totalUsers - stats.ptnkUsers - stats.paidProUsers, color: '#67e8f9' }, // Light cyan
    { name: 'PTNK Students', value: stats.ptnkUsers, color: '#6ee7b7' }, // Light green
    { name: 'Paid Pro', value: stats.paidProUsers, color: '#fbbf24' }, // Light amber
  ]

  const COLORS = {
    ocean: ['#22d3ee', '#67e8f9', '#86efac', '#a78bfa'],
    users: ['#67e8f9', '#6ee7b7', '#fbbf24'],
    tokens: ['#22d3ee', '#a78bfa'],
  }

  return (
    <>
      {/* Refresh Button and Last Update */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs md:text-sm text-ocean-600">
          Last updated: {format(lastUpdate, 'MMM dd, yyyy HH:mm:ss')}
        </p>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 transition-all text-sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Stats Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* User Type Distribution Pie Chart */}
        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">
                  User Distribution
                </CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">Total: {formatNumber(stats.totalUsers)} users</CardDescription>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-ocean-500 to-cyan-600 p-2 shadow-md">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <defs>
                  <filter id="glow-user">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))' }}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatNumber(value)}
                  contentStyle={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 md:gap-4 mt-4 justify-center text-xs md:text-sm">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#67e8f9' }}></div>
                <span className="text-ocean-700">Free: <strong>{stats.totalUsers - stats.ptnkUsers - stats.paidProUsers}</strong></span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#6ee7b7' }}></div>
                <span className="text-ocean-700">PTNK: <strong>{stats.ptnkUsers}</strong></span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#fbbf24' }}></div>
                <span className="text-ocean-700">Paid Pro: <strong>{stats.paidProUsers}</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Usage Pie Chart */}
        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">
                  Token Usage
                </CardTitle>
                <CardDescription className="mt-1 text-xs md:text-sm">Total: {formatNumber(stats.totalInputTokens + stats.totalOutputTokens)} tokens</CardDescription>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-2 shadow-md">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <defs>
                  <filter id="glow-token">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={tokenPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))' }}
                >
                  {tokenPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatNumber(value)}
                  contentStyle={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 md:gap-4 mt-4 justify-center text-xs md:text-sm">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#22d3ee' }}></div>
                <span className="text-ocean-700">Input: <strong>{formatNumber(stats.totalInputTokens)}</strong></span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#a78bfa' }}></div>
                <span className="text-ocean-700">Output: <strong>{formatNumber(stats.totalOutputTokens)}</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700">
              Total Essays
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2 shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
              {formatNumber(stats.totalEssays)}
            </div>
            <p className="text-xs text-cyan-600 mt-1">Essays submitted</p>
          </CardContent>
        </Card>

        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-ocean-700">
              Avg Essay Score
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-ocean-500 to-cyan-600 p-2 shadow-md">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent">
              {stats.avgOverallScore.toFixed(1)}
            </div>
            <p className="text-xs text-ocean-600 mt-1">Band score average</p>
          </CardContent>
        </Card>

        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">
              Total Vocabulary
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 p-2 shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
              {formatNumber(stats.totalVocabulary)}
            </div>
            <p className="text-xs text-teal-600 mt-1">Words generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Quiz Performance
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 p-2 shadow-md">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
              {stats.avgQuizScore}%
            </div>
            <div className="flex gap-3 mt-2">
              <p className="text-xs text-green-600">
                Paraphrase: <span className="font-semibold">{stats.avgParaphraseScore}%</span>
              </p>
              <p className="text-xs text-teal-600">
                Topic: <span className="font-semibold">{stats.avgTopicScore}%</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Quiz Attempts
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-green-500 to-lime-600 p-2 shadow-md">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text text-transparent">
              {formatNumber(stats.totalQuizAttempts)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {formatNumber(stats.totalCorrectAnswers)} correct / {formatNumber(stats.totalQuestions)} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Usage Over Time */}
        <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">Token Usage Over Time</CardTitle>
            <CardDescription>Daily activity based on essay submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {tokenUsageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tokenUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis
                    dataKey="date"
                    stroke="#0c4a6e"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#0c4a6e"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#22d3ee"
                    name="Essays"
                    radius={[8, 8, 0, 0]}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(34, 211, 238, 0.3))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-ocean-600">
                <p>No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">Score Distribution</CardTitle>
            <CardDescription>Essays by band score</CardDescription>
          </CardHeader>
          <CardContent>
            {scoreDistributionData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis
                    dataKey="score"
                    stroke="#0c4a6e"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#0c4a6e"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#67e8f9"
                    name="Essays"
                    radius={[8, 8, 0, 0]}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(103, 232, 249, 0.3))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-ocean-600">
                <p>No scored essays yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Essays Over Time Chart */}
      <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">Essays Over Time</CardTitle>
          <CardDescription>Cumulative essay count - always growing! 📈</CardDescription>
        </CardHeader>
        <CardContent>
          {essaysOverTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={essaysOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis
                  dataKey="date"
                  stroke="#0c4a6e"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#0c4a6e"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="essays"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ fill: '#22d3ee', r: 5, filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.5))' }}
                  activeDot={{ r: 7, fill: '#22d3ee', filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))' }}
                  name="Total Essays"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.3))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-ocean-600">
              <p>No essay data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Performance Over Time Chart */}
      <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '1.0s' }}>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">Quiz Performance Over Time</CardTitle>
          <CardDescription>Average quiz accuracy trends over the last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          {quizPerformanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={quizPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis
                  dataKey="date"
                  stroke="#0c4a6e"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#0c4a6e"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => `${Math.round(value)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgPercentage"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ fill: '#34d399', r: 5, filter: 'drop-shadow(0 0 4px rgba(52, 211, 153, 0.5))' }}
                  activeDot={{ r: 7, fill: '#34d399', filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))' }}
                  name="Average Score"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(52, 211, 153, 0.3))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-ocean-600">
              <p>No quiz data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Growth Over Time Chart */}
      <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '1.1s' }}>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">User Growth</CardTitle>
          <CardDescription>Total user count over the last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.usersOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={stats.usersOverTime.map(item => ({
                ...item,
                displayDate: format(new Date(item.date), 'MMM dd')
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis
                  dataKey="displayDate"
                  stroke="#0c4a6e"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#0c4a6e"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [`${formatNumber(value)} users`, 'Total Users']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 5, filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' }}
                  activeDot={{ r: 7, fill: '#06b6d4', filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' }}
                  name="Total Users"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(6, 182, 212, 0.3))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-ocean-600">
              <p>No user growth data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Users Table */}
      <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">Recent Users</CardTitle>
          <CardDescription className="text-xs md:text-sm">Last 10 registered users</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {stats.recentUsers.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="border border-ocean-200 rounded-lg p-3 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-ocean-800 font-medium break-all flex-1 pr-2">{user.email}</p>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={`text-xs whitespace-nowrap ${
                          user.role === 'admin'
                            ? 'bg-cyan-600 hover:bg-cyan-700'
                            : 'bg-ocean-200 text-ocean-800 hover:bg-ocean-300'
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-ocean-600">
                      {format(new Date(user.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ocean-200">
                      <th className="text-left py-3 px-4 text-ocean-700 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-ocean-700 font-semibold text-sm">Role</th>
                      <th className="text-left py-3 px-4 text-ocean-700 font-semibold text-sm">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-ocean-100 hover:bg-ocean-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-ocean-800 text-sm">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={
                              user.role === 'admin'
                                ? 'bg-cyan-600 hover:bg-cyan-700'
                                : 'bg-ocean-200 text-ocean-800 hover:bg-ocean-300'
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-ocean-600 text-sm">
                          {format(new Date(user.created_at), 'MMM dd, yyyy HH:mm')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-ocean-600">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
