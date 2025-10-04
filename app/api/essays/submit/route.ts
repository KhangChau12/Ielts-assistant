import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai, DEFAULT_MODEL } from '@/lib/openai/client'
import { ESSAY_SCORING_SYSTEM_PROMPT } from '@/lib/openai/prompts'
import type { EssayScoringResponse } from '@/types/essay'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure profile exists for user
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!existingProfile && !profileCheckError) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase.from('profiles').insert({
        id: session.user.id,
        email: session.user.email || '',
        role: 'student'
      })

      if (insertError) {
        console.error('Failed to create profile:', insertError)
      }
    }

    const { prompt, essay_content } = await request.json()

    if (!prompt || !essay_content) {
      return NextResponse.json(
        { error: 'Prompt and essay content are required' },
        { status: 400 }
      )
    }

    // Call OpenAI to score the essay
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: ESSAY_SCORING_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Essay Prompt: ${prompt}\n\nStudent's Essay:\n${essay_content}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const scoringResult: EssayScoringResponse = JSON.parse(
      completion.choices[0].message.content || '{}'
    )

    console.log('AI Response:', JSON.stringify(scoringResult, null, 2))

    // Save essay and scores to database
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .insert({
        user_id: session.user.id,
        prompt,
        essay_content,
        overall_score: scoringResult.overall_score,
        task_response_score: scoringResult.scores.task_response,
        coherence_cohesion_score: scoringResult.scores.coherence_cohesion,
        lexical_resource_score: scoringResult.scores.lexical_resource,
        grammatical_accuracy_score: scoringResult.scores.grammatical_accuracy,
        task_response_comment: scoringResult.comments.task_response,
        coherence_cohesion_comment: scoringResult.comments.coherence_cohesion,
        lexical_resource_comment: scoringResult.comments.lexical_resource,
        grammatical_accuracy_comment: scoringResult.comments.grammatical_accuracy,
        task_response_errors: scoringResult.errors.task_response,
        coherence_cohesion_errors: scoringResult.errors.coherence_cohesion,
        lexical_resource_errors: scoringResult.errors.lexical_resource,
        grammatical_accuracy_errors: scoringResult.errors.grammatical_accuracy,
        task_response_strengths: scoringResult.strengths?.task_response || [],
        coherence_cohesion_strengths: scoringResult.strengths?.coherence_cohesion || [],
        lexical_resource_strengths: scoringResult.strengths?.lexical_resource || [],
        grammatical_accuracy_strengths: scoringResult.strengths?.grammatical_accuracy || [],
      })
      .select()
      .single()

    if (essayError) {
      console.error('=== ERROR SAVING ESSAY ===')
      console.error('Error code:', essayError.code)
      console.error('Error message:', essayError.message)
      console.error('Error details:', essayError.details)
      console.error('Error hint:', essayError.hint)
      console.error('Full error:', essayError)
      return NextResponse.json(
        { error: 'Failed to save essay', details: essayError.message },
        { status: 500 }
      )
    }

    // Log token usage
    await supabase.from('token_usage').insert({
      user_id: session.user.id,
      request_type: 'scoring',
      input_tokens: completion.usage?.prompt_tokens || 0,
      output_tokens: completion.usage?.completion_tokens || 0,
      model: DEFAULT_MODEL,
    })

    return NextResponse.json({ success: true, essay })
  } catch (error) {
    console.error('Error scoring essay:', error)
    return NextResponse.json(
      { error: 'Failed to score essay' },
      { status: 500 }
    )
  }
}
