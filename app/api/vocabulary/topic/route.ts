import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai, DEFAULT_MODEL } from '@/lib/openai/client'
import { TOPIC_VOCAB_PROMPT } from '@/lib/openai/prompts'
import type { TopicVocabResponse } from '@/types/vocabulary'

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

    // Fetch the essay prompt
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .select('prompt')
      .eq('id', essay_id)
      .eq('user_id', session.user.id)
      .single()

    if (essayError || !essay) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 })
    }

    // Call OpenAI to generate topic vocabulary
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: TOPIC_VOCAB_PROMPT,
        },
        {
          role: 'user',
          content: `Essay Prompt: ${essay.prompt}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    })

    const result: TopicVocabResponse = JSON.parse(
      completion.choices[0].message.content || '{"vocabulary":[]}'
    )

    // Save vocabulary to database
    const vocabItems = result.vocabulary.map((item) => ({
      user_id: session.user.id,
      essay_id,
      vocab_type: 'topic' as const,
      original_word: null,
      suggested_word: item.word,
      definition: item.definition,
    }))

    const { data: savedVocab, error: vocabError } = await supabase
      .from('vocabulary')
      .insert(vocabItems)
      .select()

    if (vocabError) {
      console.error('Error saving vocabulary:', vocabError)
      return NextResponse.json(
        { error: 'Failed to save vocabulary' },
        { status: 500 }
      )
    }

    // Log token usage
    await supabase.from('token_usage').insert({
      user_id: session.user.id,
      request_type: 'vocab_topic',
      input_tokens: completion.usage?.prompt_tokens || 0,
      output_tokens: completion.usage?.completion_tokens || 0,
      model: DEFAULT_MODEL,
    })

    return NextResponse.json({ success: true, vocabulary: savedVocab })
  } catch (error) {
    console.error('Error generating topic vocabulary:', error)
    return NextResponse.json(
      { error: 'Failed to generate vocabulary' },
      { status: 500 }
    )
  }
}
