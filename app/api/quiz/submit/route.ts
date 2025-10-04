import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { essay_id, quiz_type, score, total_questions, correct_answers, incorrect_answers } =
      await request.json()

    if (!essay_id || !quiz_type || score === undefined || !total_questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save quiz result to database
    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: session.user.id,
        essay_id,
        quiz_type,
        score,
        total_questions,
        correct_answers,
        incorrect_answers,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving quiz result:', error)
      return NextResponse.json(
        { error: 'Failed to save quiz result' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}
