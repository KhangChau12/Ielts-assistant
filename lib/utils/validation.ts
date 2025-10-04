import { z } from 'zod'

export const essaySubmissionSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  essay_content: z.string().min(150, 'Essay must be at least 150 words'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
