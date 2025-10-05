export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'student' | 'admin'
  daily_essays_count: number
  total_essays_count: number
  last_reset_date: string
  created_at: string
  updated_at: string
}

export interface ErrorSummary {
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}
