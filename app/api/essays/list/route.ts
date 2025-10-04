import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: essays, error } = await supabase
      .from('essays')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching essays:', error)
      return NextResponse.json(
        { error: 'Failed to fetch essays' },
        { status: 500 }
      )
    }

    return NextResponse.json({ essays })
  } catch (error) {
    console.error('Error fetching essays:', error)
    return NextResponse.json(
      { error: 'Failed to fetch essays' },
      { status: 500 }
    )
  }
}
