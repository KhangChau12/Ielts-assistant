import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const { essay_id, vocab_type, score, total_questions, correct_answers, incorrect_answers } =
      await request.json()

    if (!essay_id || !vocab_type) {
      return NextResponse.json(
        { error: 'Essay ID and vocab type are required' },
        { status: 400 }
      )
    }

    // For guests, return success and let client save to localStorage
    if (!user) {
      return NextResponse.json({
        success: true,
        isGuest: true,
        message: 'Guest quiz completed - save to localStorage',
      })
    }

    // Insert quiz attempt into database for authenticated users
    const { data, error } = await supabase
      .from('vocabulary_quiz_attempts')
      .insert({
        user_id: user.id,
        essay_id,
        vocab_type,
        score,
        total_questions,
        correct_answers,
        incorrect_answers,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving quiz results:', error)
      return NextResponse.json(
        { error: 'Failed to save quiz results' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      attempt: data,
    })
  } catch (error) {
    console.error('Error in quiz-results API:', error)
    return NextResponse.json(
      { error: 'Failed to save quiz results' },
      { status: 500 }
    )
  }
}
