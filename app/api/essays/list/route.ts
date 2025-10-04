import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: essays, error } = await supabase
      .from('essays')
      .select('*')
      .eq('user_id', session.user.id)
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
