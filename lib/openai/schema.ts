import { z } from 'zod'

// Schema for essay scoring response
export const essayScoringSchema = z.object({
  errors: z.object({
    task_response: z.array(z.string()),
    coherence_cohesion: z.array(z.string()),
    lexical_resource: z.array(z.string()),
    grammatical_accuracy: z.array(z.string()),
  }),
  comments: z.object({
    task_response: z.string(),
    coherence_cohesion: z.string(),
    lexical_resource: z.string(),
    grammatical_accuracy: z.string(),
  }),
  scores: z.object({
    task_response: z.number().int().min(0).max(9),
    coherence_cohesion: z.number().int().min(0).max(9),
    lexical_resource: z.number().int().min(0).max(9),
    grammatical_accuracy: z.number().int().min(0).max(9),
  }),
  overall_score: z.number().min(0).max(9),
})

// Schema for paraphrase vocabulary response
export const paraphraseVocabSchema = z.object({
  vocabulary: z.array(
    z.object({
      original: z.string(),
      suggested: z.string(),
      definition: z.string(),
    })
  ),
})

// Schema for topic vocabulary response
export const topicVocabSchema = z.object({
  vocabulary: z.array(
    z.object({
      word: z.string(),
      definition: z.string(),
    })
  ),
})

// Schema for error summary response
export const errorSummarySchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
})
