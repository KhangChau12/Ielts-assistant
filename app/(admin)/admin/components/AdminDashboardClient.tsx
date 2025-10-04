'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, Zap, RefreshCw } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

  // Prepare score distribution data
  const scoreDistributionData = [5, 6, 7, 8, 9].map((score) => ({
    score: `Band ${score}`,
    count: stats.scoreDistribution[score] || 0,
  }))

  // Prepare essays over time data
  const essaysOverTimeData = stats.essaysOverTime
    .reduce((acc: any[], essay) => {
      const date = format(new Date(essay.created_at), 'MMM dd')
      const existing = acc.find((item) => item.date === date)
      if (existing) {
        existing.essays += 1
      } else {
        acc.push({ date, essays: 1 })
      }
      return acc
    }, [])
    .slice(-14)

  return (
    <>
      {/* Refresh Button and Last Update */}
      <div className="flex justify-between items-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <p className="text-sm text-ocean-600">
          Last updated: {format(lastUpdate, 'MMM dd, yyyy HH:mm:ss')}
        </p>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 transition-all"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-ocean-700">
              Total Users
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-ocean-500 to-cyan-600 p-2 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">
              {formatNumber(stats.totalUsers)}
            </div>
            <p className="text-xs text-ocean-600 mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
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

        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Input Tokens
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              {formatNumber(stats.totalInputTokens)}
            </div>
            <p className="text-xs text-blue-600 mt-1">Total consumed</p>
          </CardContent>
        </Card>

        <Card className="card-premium shadow-card hover:shadow-hover hover-lift transition-all animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">
              Output Tokens
            </CardTitle>
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              {formatNumber(stats.totalOutputTokens)}
            </div>
            <p className="text-xs text-indigo-600 mt-1">Total generated</p>
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
                    fill="#0891b2"
                    name="Essays"
                    radius={[8, 8, 0, 0]}
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
                    fill="#06b6d4"
                    name="Essays"
                    radius={[8, 8, 0, 0]}
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
          <CardDescription>Essay submission trends over the last 14 days</CardDescription>
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
                  stroke="#0891b2"
                  strokeWidth={3}
                  dot={{ fill: '#0891b2', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Essays Submitted"
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

      {/* Recent Users Table */}
      <Card className="card-premium shadow-colored hover-glow transition-all animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-ocean-800 to-cyan-700 bg-clip-text text-transparent">Recent Users</CardTitle>
          <CardDescription>Last 10 registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ocean-200">
                    <th className="text-left py-3 px-4 text-ocean-700 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-ocean-700 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-ocean-700 font-semibold">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-ocean-100 hover:bg-ocean-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-ocean-800">{user.email}</td>
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
                      <td className="py-3 px-4 text-ocean-600">
                        {format(new Date(user.created_at), 'MMM dd, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
