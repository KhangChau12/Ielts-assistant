import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
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
      .eq('id', user.id)
      .single()

    if (essay.user_id !== user.id && profile?.role !== 'admin') {
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
