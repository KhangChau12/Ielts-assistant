import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { essayId: string } }
) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // Get the essay first
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .select('*')
      .eq('id', params.essayId)
      .single()

    if (essayError || !essay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
    }

    // Check access: allow if guest essay OR user owns it
    const isGuest = essay.is_guest === true
    if (!isGuest && essay.user_id !== user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'paraphrase', 'topic', 'both', or 'mixed'

    // Build query
    let query = supabase
      .from('vocabulary')
      .select('*')
      .eq('essay_id', params.essayId)

    // Filter by user_id only if not guest
    if (!isGuest && user) {
      query = query.eq('user_id', user.id)
    }

    // Filter by type if specified and not 'both' or 'mixed'
    if (type && type !== 'both' && type !== 'mixed') {
      query = query.eq('vocab_type', type)
    }

    const { data: vocabulary, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vocabulary:', error)
      return NextResponse.json(
        { error: 'Failed to fetch vocabulary' },
        { status: 500 }
      )
    }

    // Track views if type is specified (only for authenticated users, not guests)
    if (type && user && !isGuest) {
      const viewsToInsert = []
      const paraphraseVocab = vocabulary?.filter(v => v.vocab_type === 'paraphrase') || []
      const topicVocab = vocabulary?.filter(v => v.vocab_type === 'topic') || []

      if (type === 'paraphrase' && paraphraseVocab.length > 0) {
        viewsToInsert.push({
          user_id: user.id,
          essay_id: params.essayId,
          vocab_type: 'paraphrase'
        })
      } else if (type === 'topic' && topicVocab.length > 0) {
        viewsToInsert.push({
          user_id: user.id,
          essay_id: params.essayId,
          vocab_type: 'topic'
        })
      } else if ((type === 'both' || type === 'mixed')) {
        if (paraphraseVocab.length > 0) {
          viewsToInsert.push({
            user_id: user.id,
            essay_id: params.essayId,
            vocab_type: 'paraphrase'
          })
        }
        if (topicVocab.length > 0) {
          viewsToInsert.push({
            user_id: user.id,
            essay_id: params.essayId,
            vocab_type: 'topic'
          })
        }
      }

      if (viewsToInsert.length > 0) {
        await supabase
          .from('vocabulary_views')
          .upsert(viewsToInsert, {
            onConflict: 'user_id,essay_id,vocab_type',
            ignoreDuplicates: true
          })
      }
    }

    return NextResponse.json({ essay, vocabulary: vocabulary || [] })
  } catch (error) {
    console.error('Error fetching vocabulary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary' },
      { status: 500 }
    )
  }
}
