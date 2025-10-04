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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, Waves, Mail } from 'lucide-react'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
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
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            role: 'student',
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

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
      <Card className="border-cyan-200 shadow-colored hover-lift card-premium animate-fadeInUp">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-base">
            We've sent a verification link to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg font-semibold text-ocean-600">{userEmail}</p>
          <div className="bg-gradient-to-br from-ocean-50 to-cyan-50 border border-ocean-200 rounded-lg p-4 shadow-sm text-sm text-slate-700 space-y-2">
            <div className="flex items-center justify-center gap-2 font-medium text-ocean-700">
              <Mail className="w-4 h-4" />
              <span>Please verify your email to continue</span>
            </div>
            <p>Click the link in the email to activate your IELTS Assistant account and start improving your writing!</p>
          </div>
          <div className="pt-4 space-y-2 text-sm text-slate-600">
            <p className="font-medium">Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1 text-left max-w-sm mx-auto">
              <li>Check your spam/junk folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes and refresh your inbox</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            variant="outline"
            className="w-full border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 transition-all"
            onClick={() => setEmailSent(false)}
          >
            Back to Registration
          </Button>
          <p className="text-center text-sm text-slate-600">
            Already verified?{' '}
            <Link
              href="/login"
              className="font-medium text-cyan-600 hover:text-cyan-700 underline underline-offset-4 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-cyan-200 shadow-colored hover-lift card-premium animate-fadeInUp">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
          <Waves className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-base">
          Start your IELTS writing journey today
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              disabled={isLoading}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
              disabled={isLoading}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
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

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-cyan-600 hover:text-cyan-700 underline underline-offset-4 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
