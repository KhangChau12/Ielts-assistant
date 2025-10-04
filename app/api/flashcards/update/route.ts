import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { flashcard_id, quality } = await request.json()

    if (!flashcard_id || quality === undefined) {
      return NextResponse.json(
        { error: 'Flashcard ID and quality are required' },
        { status: 400 }
      )
    }

    // Get current flashcard
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcard_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !flashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      )
    }

    // SM-2 algorithm for spaced repetition
    let { ease_factor, interval_days, repetition_count } = flashcard

    // Quality: 0-5 (0 = complete blackout, 5 = perfect response)
    if (quality >= 3) {
      // Correct response
      if (repetition_count === 0) {
        interval_days = 1
      } else if (repetition_count === 1) {
        interval_days = 6
      } else {
        interval_days = Math.round(interval_days * ease_factor)
      }
      repetition_count += 1
    } else {
      // Incorrect response - reset
      repetition_count = 0
      interval_days = 1
    }

    // Update ease factor
    ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (ease_factor < 1.3) ease_factor = 1.3

    // Calculate next review date
    const next_review_date = new Date()
    next_review_date.setDate(next_review_date.getDate() + interval_days)

    // Update flashcard
    const { data: updated, error: updateError } = await supabase
      .from('flashcards')
      .update({
        ease_factor,
        interval_days,
        repetition_count,
        next_review_date: next_review_date.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', flashcard_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating flashcard:', updateError)
      return NextResponse.json(
        { error: 'Failed to update flashcard' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, flashcard: updated })
  } catch (error) {
    console.error('Error updating flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    )
  }
}
