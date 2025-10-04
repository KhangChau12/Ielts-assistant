import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, TrendingUp, BookOpen, Target, Sparkles, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl">
              Master IELTS Writing with{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Feedback
            </h1>
            <p className="mb-8 text-xl text-ocean-100">
              Get instant, expert-level feedback on your IELTS Writing Task 2 essays. Track your progress, enhance your vocabulary, and achieve your target band score.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-ocean-900">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center animate-fadeInUp">
            <h2 className="mb-4 text-4xl font-bold text-gradient-bold">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive tools designed to improve every aspect of your IELTS writing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="card-premium hover-lift hover-glow group animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">AI-Powered Essay Scoring</CardTitle>
                <CardDescription className="text-base">
                  Get detailed band scores for all 4 criteria: Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Accuracy
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="card-premium hover-lift hover-glow group animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Detailed Feedback & Error Analysis</CardTitle>
                <CardDescription className="text-base">
                  Receive specific error identification and actionable comments for each criterion to understand exactly where to improve
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="card-premium hover-lift hover-glow group animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Progress Tracking Dashboard</CardTitle>
                <CardDescription className="text-base">
                  Visualize your improvement over time with charts, track recurring errors, and get AI-powered insights on your writing patterns
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="card-premium hover-lift hover-glow group animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Vocabulary Enhancement</CardTitle>
                <CardDescription className="text-base">
                  Generate paraphrase suggestions for low-level vocabulary and discover high-level topic-specific words and collocations
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="card-premium hover-lift hover-glow group animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Flashcards</CardTitle>
                <CardDescription className="text-base">
                  Learn vocabulary with spaced repetition flashcards automatically created from your essays for maximum retention
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="card-premium hover-lift hover-glow group animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Interactive Vocabulary Quizzes</CardTitle>
                <CardDescription className="text-base">
                  Test your vocabulary knowledge with multiple-choice and fill-in quizzes to reinforce learning
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-ocean-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center animate-fadeInUp">
            <h2 className="mb-4 text-4xl font-bold text-gradient-bold">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to improve your writing</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              <div className="flex items-start gap-6 group animate-slideInRight" style={{ animationDelay: '0.1s' }}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  1
                </div>
                <div className="flex-1 p-6 card-premium hover-lift">
                  <h3 className="mb-2 text-2xl font-semibold text-slate-900">Submit Your Essay</h3>
                  <p className="text-slate-600 text-lg">
                    Enter the essay prompt and paste your writing. Our AI examiner will analyze it based on official IELTS band descriptors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group animate-slideInRight" style={{ animationDelay: '0.2s' }}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  2
                </div>
                <div className="flex-1 p-6 card-premium hover-lift">
                  <h3 className="mb-2 text-2xl font-semibold text-slate-900">Get Instant Feedback</h3>
                  <p className="text-slate-600 text-lg">
                    Receive detailed scores for all 4 criteria, specific error identification, and expert comments on how to improve each aspect of your writing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group animate-slideInRight" style={{ animationDelay: '0.3s' }}>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)' }}>
                  3
                </div>
                <div className="flex-1 p-6 card-premium hover-lift">
                  <h3 className="mb-2 text-2xl font-semibold text-slate-900">Learn & Improve</h3>
                  <p className="text-slate-600 text-lg">
                    Track your progress, enhance vocabulary with AI-generated suggestions, and use flashcards and quizzes to reinforce learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-ocean-600 to-cyan-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fadeInUp">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ready to Achieve Your Target Band Score?</h2>
            <p className="mb-8 text-xl text-ocean-50">
              Join students worldwide who are improving their IELTS writing with AI-powered feedback
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-ocean-700 hover:bg-ocean-50 hover:scale-105 transition-all duration-300 shadow-float hover:shadow-colored-strong px-8 py-6 text-lg font-bold rounded-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative animated elements */}
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl animate-float" />
        <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </section>
    </div>
  )
}
