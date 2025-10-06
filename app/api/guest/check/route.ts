import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { fingerprint } = await request.json()

    if (!fingerprint || fingerprint === 'server-side') {
      return NextResponse.json({ hasUsed: false })
    }

    const supabase = createServerClient()

    // Check if this fingerprint has been used before
    const { data, error } = await supabase
      .from('guest_fingerprints')
      .select('essay_id, created_at')
      .eq('fingerprint', fingerprint)
      .single()

    if (error || !data) {
      return NextResponse.json({ hasUsed: false })
    }

    return NextResponse.json({
      hasUsed: true,
      essayId: data.essay_id,
      usedAt: data.created_at
    })
  } catch (error) {
    console.error('Guest check error:', error)
    return NextResponse.json({ hasUsed: false })
  }
}
