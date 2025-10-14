import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, Calendar, Award } from 'lucide-react'

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const truncateText = (text: string, maxLength: number = 120): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default async function HistoryPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch all essays
  const { data: essays, error } = await supabase
    .from('essays')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching essays:', error)
  }

  return (
    <div className="container mx-auto py-6 md:py-8 px-4">
      <div className="mb-6 md:mb-8 animate-fadeInUp">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-ocean-700 to-cyan-700 bg-clip-text text-transparent">Essay History</h1>
        <p className="mt-2 text-sm md:text-base text-slate-600">
          View all your submitted essays and review your progress
        </p>
      </div>

      {!essays || essays.length === 0 ? (
        <Card className="border-ocean-200 shadow-lg animate-fadeInUp">
          <CardContent className="py-8 md:py-12 text-center px-4">
            <FileText className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-ocean-400 opacity-50" />
            <h3 className="text-lg md:text-xl font-semibold text-ocean-800 mb-2">No Essays Yet</h3>
            <p className="text-sm md:text-base text-ocean-600 mb-4 px-4">You haven't submitted any essays yet. Start writing to see your progress!</p>
            <Link href="/write">
              <Button className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white text-sm md:text-base">
                <FileText className="mr-2 h-4 w-4" />
                Write Your First Essay
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {essays.map((essay) => (
            <Card
              key={essay.id}
              className="border-ocean-100 card-premium shadow-colored hover-lift animate-fadeInUp"
            >
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base md:text-lg bg-gradient-to-r from-slate-800 to-ocean-700 bg-clip-text text-transparent mb-2">
                      {truncateText(essay.prompt, 100)}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        {formatDate(essay.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 md:h-4 md:w-4" />
                        {essay.essay_content.split(/\s+/).length} words
                      </div>
                    </div>
                  </div>
                  {essay.overall_score && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-ocean-500 to-cyan-500 text-xl md:text-2xl font-bold text-white shadow-lg">
                        {essay.overall_score.toFixed(1)}
                      </div>
                      <span className="text-xs text-slate-500">Overall</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  {/* Criteria Scores */}
                  {essay.overall_score && (
                    <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-4">
                      <div className="rounded-lg bg-slate-50 p-2 md:p-3 text-center">
                        <div className="text-xs text-slate-600 mb-1">Task Response</div>
                        <Badge
                          variant={
                            essay.task_response_score >= 7
                              ? 'default'
                              : essay.task_response_score >= 5.5
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-sm"
                        >
                          {essay.task_response_score}
                        </Badge>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 md:p-3 text-center">
                        <div className="text-xs text-slate-600 mb-1">Coherence</div>
                        <Badge
                          variant={
                            essay.coherence_cohesion_score >= 7
                              ? 'default'
                              : essay.coherence_cohesion_score >= 5.5
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-sm"
                        >
                          {essay.coherence_cohesion_score}
                        </Badge>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 md:p-3 text-center">
                        <div className="text-xs text-slate-600 mb-1">Lexical</div>
                        <Badge
                          variant={
                            essay.lexical_resource_score >= 7
                              ? 'default'
                              : essay.lexical_resource_score >= 5.5
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-sm"
                        >
                          {essay.lexical_resource_score}
                        </Badge>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 md:p-3 text-center">
                        <div className="text-xs text-slate-600 mb-1">Grammar</div>
                        <Badge
                          variant={
                            essay.grammatical_accuracy_score >= 7
                              ? 'default'
                              : essay.grammatical_accuracy_score >= 5.5
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-sm"
                        >
                          {essay.grammatical_accuracy_score}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Essay Preview */}
                  <div className="rounded-lg bg-slate-50 p-3 md:p-4">
                    <p className="text-xs md:text-sm text-slate-700 line-clamp-3">
                      {essay.essay_content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/write/${essay.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all text-sm md:text-base">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/vocabulary?essay=${essay.id}`} className="sm:w-auto">
                      <Button variant="outline" className="w-full border-ocean-300 text-ocean-600 hover:bg-ocean-50 hover:border-ocean-400 shadow-sm hover:shadow-md transition-all text-sm md:text-base">
                        Vocabulary
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Write New Essay Button */}
      <div className="mt-6 md:mt-8 text-center">
        <Link href="/write">
          <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
            <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Write New Essay
          </Button>
        </Link>
      </div>
    </div>
  )
}
