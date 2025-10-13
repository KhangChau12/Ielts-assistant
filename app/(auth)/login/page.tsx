'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, Waves, CheckCircle2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (signInData.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ocean-600 via-ocean-700 to-cyan-700 px-16 py-20 flex-col justify-start relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-ocean-500 rounded-full blur-3xl opacity-20" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">IELTS4Life</span>
          </div>

          {/* Main heading */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Welcome back
            </h1>
            <p className="text-xl text-ocean-100 leading-relaxed">
              Continue your journey to IELTS success with AI-powered feedback and expert guidance.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-lg text-white/90">Instant detailed feedback on your essays</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-lg text-white/90">Accurate IELTS band score predictions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-lg text-white/90">Track your progress over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-8 py-20 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-ocean-600 rounded-xl mb-4">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ocean-800">IELTS4Life</h1>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-ocean-800 mb-2">Sign in</h2>
              <p className="text-ocean-600">Continue your IELTS journey</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-ocean-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ocean-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 h-11 border-ocean-200 focus:border-ocean-400"
                    disabled={isLoading}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-ocean-700 font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-ocean-600 hover:text-ocean-700"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ocean-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-11 border-ocean-200 focus:border-ocean-400"
                    disabled={isLoading}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white font-medium shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-ocean-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-ocean-500">or</span>
                </div>
              </div>

              <Link href="/write">
                <Button
                  variant="outline"
                  className="w-full h-11 border-ocean-200 hover:bg-ocean-50 text-ocean-700"
                >
                  Try as Guest (1 Free Essay)
                </Button>
              </Link>

              <p className="text-center text-sm text-ocean-600">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-ocean-700 hover:text-ocean-800"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}