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
import { Loader2, Mail, Lock, User, Gift, Waves, CheckCircle, CheckCircle2 } from 'lucide-react'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  inviteCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Sign up the user with email confirmation
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            invite_code: data.inviteCode || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        // Email confirmation required
        setUserEmail(data.email)
        setEmailSent(true)
      } else if (authData.user && authData.session) {
        // No email confirmation needed (auto-confirmed)
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // If email sent, show verification message
  if (emailSent) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Hero section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ocean-600 via-ocean-700 to-cyan-700 px-16 py-20 flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400 rounded-full blur-3xl opacity-20" />
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-ocean-500 rounded-full blur-3xl opacity-20" />
            </div>
          </div>

          <div className="relative z-10 text-center max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">Check Your Email</h2>
            <p className="text-xl text-ocean-100 leading-relaxed">
              We've sent a verification link to activate your account and start your IELTS journey.
            </p>
          </div>
        </div>

        {/* Right side - Verification message */}
        <div className="w-full lg:w-1/2 flex items-start justify-center px-8 py-20 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-ocean-600" />
                </div>
                <h2 className="text-2xl font-bold text-ocean-800 mb-2">Verify Your Email</h2>
                <p className="text-ocean-600 mb-2">We've sent a verification link to</p>
                <p className="text-lg font-semibold text-ocean-700">{userEmail}</p>
              </div>

              <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4 mt-6 mb-6">
                <div className="flex items-center justify-center gap-2 text-ocean-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Important: Click link in THIS browser</span>
                </div>
                <p className="text-sm text-ocean-600 text-center">
                  For security reasons, please click the link in the same browser window where you registered.
                </p>
              </div>

              <div className="space-y-2 text-sm text-ocean-600 mb-6">
                <p className="font-medium text-center">Didn't receive the email?</p>
                <ul className="list-disc list-inside space-y-1 text-ocean-500 pl-4">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few minutes and refresh your inbox</li>
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 border-ocean-200 hover:bg-ocean-50 text-ocean-700 mb-4"
                onClick={() => setEmailSent(false)}
              >
                Back to Registration
              </Button>

              <p className="text-center text-sm text-ocean-600">
                Already verified?{' '}
                <Link href="/login" className="font-semibold text-ocean-700 hover:text-ocean-800">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ocean-600 via-ocean-700 to-cyan-700 px-16 py-20 flex-col justify-start relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-400 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-ocean-500 rounded-full blur-3xl opacity-20" />
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">IELTS Assistant</span>
          </div>

          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Start your journey
            </h1>
            <p className="text-xl text-ocean-100 leading-relaxed">
              Join thousands of students achieving their IELTS goals with personalized AI feedback.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-lg text-white/90">Get 6 free essays to start your practice</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-lg text-white/90">Receive instant AI-powered feedback</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-lg text-white/90">Invite friends to earn more essays</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-8 py-20 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-ocean-600 rounded-xl mb-4">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ocean-800">IELTS Assistant</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-ocean-800 mb-2">Create account</h2>
              <p className="text-ocean-600">Start improving your IELTS writing today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-ocean-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ocean-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-11 border-ocean-200 focus:border-ocean-400"
                    disabled={isLoading}
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-ocean-700">Email Address</Label>
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

              <div className="bg-ocean-50/50 border border-ocean-200 rounded-lg p-3">
                <Label htmlFor="inviteCode" className="text-ocean-700 text-sm flex items-center gap-2">
                  <Gift className="w-4 h-4 text-ocean-600" />
                  Invite Code (Optional)
                </Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter code for 3 bonus essays"
                  className="mt-2 h-10 border-ocean-200 focus:border-ocean-400 uppercase"
                  disabled={isLoading}
                  {...register('inviteCode')}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase()
                  }}
                />
                <p className="text-xs text-ocean-500 mt-1">Your friend will get +6 essays, you get +3</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-ocean-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ocean-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    className="pl-10 h-11 border-ocean-200 focus:border-ocean-400"
                    disabled={isLoading}
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-ocean-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ocean-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    className="pl-10 h-11 border-ocean-200 focus:border-ocean-400"
                    disabled={isLoading}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
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
                <Button variant="outline" className="w-full h-11 border-ocean-200 hover:bg-ocean-50 text-ocean-700">
                  Try as Guest (1 Free Essay)
                </Button>
              </Link>

              <p className="text-center text-sm text-ocean-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-ocean-700 hover:text-ocean-800">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
