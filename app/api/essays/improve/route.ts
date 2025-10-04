import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai, DEFAULT_MODEL } from '@/lib/openai/client'
import { ESSAY_IMPROVEMENT_PROMPT } from '@/lib/openai/prompts'

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Check authentication
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

    // Fetch the essay
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .select('*')
      .eq('id', essay_id)
      .eq('user_id', session.user.id)
      .single()

    if (essayError || !essay) {
      return NextResponse.json(
        { error: 'Essay not found' },
        { status: 404 }
      )
    }

    // Check if already improved
    if (essay.improved_essay) {
      return NextResponse.json({
        success: true,
        improved_essay: essay.improved_essay,
        changes: essay.improvement_changes || [], // Return stored changes or empty array for old essays
      })
    }

    // Call OpenAI to improve the essay
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: ESSAY_IMPROVEMENT_PROMPT,
        },
        {
          role: 'user',
          content: `Essay Prompt: ${essay.prompt}\n\nStudent's Essay (Band ${essay.overall_score || 'N/A'}):\n${essay.essay_content}\n\nPlease provide an improved Band 8-9 version.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(
      completion.choices[0].message.content || '{}'
    )

    console.log('=== IMPROVEMENT API DEBUG ===')
    console.log('OpenAI Response keys:', Object.keys(result))
    console.log('Has improved_essay:', !!result.improved_essay)
    console.log('Has changes:', !!result.changes)
    console.log('Changes type:', typeof result.changes)
    console.log('Changes is array:', Array.isArray(result.changes))

    const improved_essay = result.improved_essay
    const changes = result.changes || []

    console.log('Parsed changes count:', changes.length)
    console.log('Changes sample:', JSON.stringify(changes.slice(0, 3), null, 2))

    // Validate changes is an array
    if (!Array.isArray(changes)) {
      console.error('WARNING: changes is not an array!', typeof changes)
    }

    // Save improved essay and changes to database
    const { data: updateData, error: updateError } = await supabase
      .from('essays')
      .update({
        improved_essay,
        improvement_changes: changes
      })
      .eq('id', essay_id)
      .select('id, improved_essay, improvement_changes')

    if (updateError) {
      console.error('Error saving improved essay:', updateError)
      console.error('Update error details:', JSON.stringify(updateError, null, 2))
      return NextResponse.json(
        { error: 'Failed to save improved essay' },
        { status: 500 }
      )
    }

    console.log('Database update successful:', !!updateData)
    console.log('Update data:', updateData)
    if (updateData && updateData[0]) {
      console.log('Has improvement_changes in DB:', !!updateData[0].improvement_changes)
      console.log('Changes count in DB:', updateData[0].improvement_changes?.length || 0)
      console.log('Saved changes to DB: YES')
    } else {
      console.log('Saved changes to DB: NO - updateData is empty')
    }
    console.log('=============================')

    // Log token usage
    await supabase.from('token_usage').insert({
      user_id: session.user.id,
      request_type: 'improvement',
      input_tokens: completion.usage?.prompt_tokens || 0,
      output_tokens: completion.usage?.completion_tokens || 0,
      model: DEFAULT_MODEL,
    })

    return NextResponse.json({
      success: true,
      improved_essay,
      changes,
    })
  } catch (error) {
    console.error('Error improving essay:', error)
    return NextResponse.json(
      { error: 'Failed to improve essay' },
      { status: 500 }
    )
  }
}
