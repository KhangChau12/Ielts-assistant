import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createGroqClient, MODELS } from '@/lib/openai/client'
import { ESSAY_SCORING_SYSTEM_PROMPT } from '@/lib/openai/prompts'
import type { EssayScoringResponse } from '@/types/essay'
import { getDailyQuota, getUserTier, getTotalQuota, getQuotaExhaustedMessage } from '@/lib/user/quota'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Check authentication (allow guest mode)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const isGuest = !user

    // GUEST MODE HANDLING
    if (isGuest) {
      const body = await request.json()
      const { prompt, essay_content, fingerprint } = body

      if (!fingerprint || fingerprint === 'server-side') {
        return NextResponse.json(
          { error: 'Device fingerprint required for guest mode' },
          { status: 400 }
        )
      }

      // Check if guest already used their trial
      const { data: existingGuest } = await supabase
        .from('guest_fingerprints')
        .select('essay_id')
        .eq('fingerprint', fingerprint)
        .single()

      if (existingGuest) {
        return NextResponse.json(
          {
            error: 'You\'ve already tried 1 free essay! Sign up to get 3 essays per day.',
            isGuestLimit: true,
            existingEssayId: existingGuest.essay_id
          },
          { status: 429 }
        )
      }

      if (!prompt || !essay_content) {
        return NextResponse.json(
          { error: 'Prompt and essay content are required' },
          { status: 400 }
        )
      }

      // Process guest essay (scoring logic below)
      // Continue to scoring...
      const groqClient = createGroqClient()
      const completion = await groqClient.chat.completions.create({
        model: MODELS.ESSAY_SCORING,
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

      const roundToHalfBand = (score: number): number => {
        const rounded = Math.round(score * 2) / 2
        return Math.max(0, Math.min(9, rounded))
      }

      const finalOverallScore = roundToHalfBand(scoringResult.overall_score)

      // Save guest essay to database
      const { data: essay, error: essayError } = await supabase
        .from('essays')
        .insert({
          user_id: null,
          is_guest: true,
          guest_fingerprint: fingerprint,
          prompt,
          essay_content,
          overall_score: finalOverallScore,
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
        console.error('Failed to save guest essay:', essayError)
        return NextResponse.json(
          { error: 'Failed to save essay', details: essayError.message },
          { status: 500 }
        )
      }

      // Mark guest fingerprint as used
      await supabase.from('guest_fingerprints').insert({
        fingerprint,
        essay_id: essay.id
      })

      return NextResponse.json({ success: true, essay, isGuest: true })
    }

    // AUTHENTICATED USER FLOW
    // Ensure profile exists and get quota info
    const { data: profile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, email, daily_essays_count, last_reset_date, total_essays_count')
      .eq('id', user.id)
      .single()

    if (!profile && !profileCheckError) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email || '',
        role: 'student'
      })

      if (insertError) {
        console.error('Failed to create profile:', insertError)
      }
    }

    // Check quotas before processing
    const today = new Date().toISOString().split('T')[0]
    let dailyCount = profile?.daily_essays_count || 0
    const totalCount = profile?.total_essays_count || 0

    // Reset counter if it's a new day
    if (profile && profile.last_reset_date !== today) {
      dailyCount = 0
      await supabase
        .from('profiles')
        .update({
          daily_essays_count: 0,
          last_reset_date: today
        })
        .eq('id', user.id)
    }

    const userEmail = profile?.email || user.email || ''
    const dailyQuota = getDailyQuota(userEmail)
    const totalQuota = getTotalQuota(userEmail)
    const tier = getUserTier(userEmail)

    // Check total quota for free users (9 essays max)
    if (tier === 'free' && totalQuota !== null && totalCount >= totalQuota) {
      const quotaInfo = getQuotaExhaustedMessage(tier, false) // Total limit hit
      return NextResponse.json(
        {
          error: quotaInfo.message,
          showUpgradeButton: quotaInfo.showUpgradeButton
        },
        { status: 429 }
      )
    }

    // Check daily quota
    if (dailyCount >= dailyQuota) {
      const quotaInfo = getQuotaExhaustedMessage(tier, true) // Daily limit hit
      return NextResponse.json(
        {
          error: quotaInfo.message,
          showUpgradeButton: quotaInfo.showUpgradeButton
        },
        { status: 429 }
      )
    }

    const { prompt, essay_content } = await request.json()

    if (!prompt || !essay_content) {
      return NextResponse.json(
        { error: 'Prompt and essay content are required' },
        { status: 400 }
      )
    }

    // Call Groq to score the essay (with key rotation)
    const groqClient = createGroqClient()
    const completion = await groqClient.chat.completions.create({
      model: MODELS.ESSAY_SCORING,
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

    // Ensure proper rounding of overall score (round to nearest 0.5)
    // Formula: .25 → .5, .75 → next whole number
    const roundToHalfBand = (score: number): number => {
      const rounded = Math.round(score * 2) / 2
      return Math.max(0, Math.min(9, rounded)) // Clamp between 0-9
    }

    const finalOverallScore = roundToHalfBand(scoringResult.overall_score)

    // Save essay and scores to database
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        prompt,
        essay_content,
        overall_score: finalOverallScore,
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
      user_id: user.id,
      request_type: 'scoring',
      input_tokens: completion.usage?.prompt_tokens || 0,
      output_tokens: completion.usage?.completion_tokens || 0,
      model: MODELS.ESSAY_SCORING,
    })

    // Increment daily and total essay counts
    await supabase
      .from('profiles')
      .update({
        daily_essays_count: dailyCount + 1,
        total_essays_count: totalCount + 1
      })
      .eq('id', user.id)

    return NextResponse.json({ success: true, essay })
  } catch (error) {
    console.error('Error scoring essay:', error)
    return NextResponse.json(
      { error: 'Failed to score essay' },
      { status: 500 }
    )
  }
}
