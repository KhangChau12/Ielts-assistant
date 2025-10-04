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

    const { essay_id } = await request.json()

    if (!essay_id) {
      return NextResponse.json(
        { error: 'Essay ID is required' },
        { status: 400 }
      )
    }

    // Get vocabulary for this essay
    const { data: vocabulary, error: vocabError } = await supabase
      .from('vocabulary')
      .select('id')
      .eq('essay_id', essay_id)
      .eq('user_id', session.user.id)

    if (vocabError || !vocabulary || vocabulary.length === 0) {
      return NextResponse.json(
        { error: 'No vocabulary found for this essay' },
        { status: 404 }
      )
    }

    // Create flashcards for each vocabulary item
    const flashcards = vocabulary.map((vocab) => ({
      user_id: session.user.id,
      vocab_id: vocab.id,
      next_review_date: new Date().toISOString(),
      repetition_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
    }))

    // Insert flashcards (ignore duplicates)
    const { data: created, error } = await supabase
      .from('flashcards')
      .upsert(flashcards, { onConflict: 'vocab_id' })
      .select()

    if (error) {
      console.error('Error creating flashcards:', error)
      return NextResponse.json(
        { error: 'Failed to create flashcards' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, flashcards: created })
  } catch (error) {
    console.error('Error creating flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to create flashcards' },
      { status: 500 }
    )
  }
}
