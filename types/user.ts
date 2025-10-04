export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'student' | 'admin'
  created_at: string
  updated_at: string
}

export interface ErrorSummary {
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}
