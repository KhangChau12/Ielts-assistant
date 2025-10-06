import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: essay, error } = await supabase
      .from('essays')
      .select('improved_essay, user_id')
      .eq('id', params.id)
      .single()

    if (error || !essay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
    }

    // Check if user owns this essay
    if (essay.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({
      has_improved_essay: !!essay.improved_essay,
    })
  } catch (error) {
    console.error('Error checking essay status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
