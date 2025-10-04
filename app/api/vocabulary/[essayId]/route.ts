import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { essayId: string } }
) {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch vocabulary for the essay
    const { data: vocabulary, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('essay_id', params.essayId)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vocabulary:', error)
      return NextResponse.json(
        { error: 'Failed to fetch vocabulary' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vocabulary: vocabulary || [] })
  } catch (error) {
    console.error('Error fetching vocabulary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary' },
      { status: 500 }
    )
  }
}
