import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: essay, error } = await supabase
      .from('essays')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !essay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
    }

    // Check if user owns this essay or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (essay.user_id !== session.user.id && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ essay })
  } catch (error) {
    console.error('Error fetching essay:', error)
    return NextResponse.json(
      { error: 'Failed to fetch essay' },
      { status: 500 }
    )
  }
}
