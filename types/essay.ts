export interface EssayScores {
  task_response: number
  coherence_cohesion: number
  lexical_resource: number
  grammatical_accuracy: number
}

export interface EssayComments {
  task_response: string
  coherence_cohesion: string
  lexical_resource: string
  grammatical_accuracy: string
}

export interface EssayErrors {
  task_response: string[]
  coherence_cohesion: string[]
  lexical_resource: string[]
  grammatical_accuracy: string[]
}

export interface EssayStrengths {
  task_response: string[]
  coherence_cohesion: string[]
  lexical_resource: string[]
  grammatical_accuracy: string[]
}

export interface EssayScoringResponse {
  errors: EssayErrors
  strengths: EssayStrengths
  comments: EssayComments
  scores: EssayScores
  overall_score: number
}

export interface Essay {
  id: string
  user_id: string
  prompt: string
  essay_content: string
  overall_score: number | null
  task_response_score: number | null
  coherence_cohesion_score: number | null
  lexical_resource_score: number | null
  grammatical_accuracy_score: number | null
  task_response_comment: string | null
  coherence_cohesion_comment: string | null
  lexical_resource_comment: string | null
  grammatical_accuracy_comment: string | null
  task_response_errors: string[] | null
  coherence_cohesion_errors: string[] | null
  lexical_resource_errors: string[] | null
  grammatical_accuracy_errors: string[] | null
  task_response_strengths: string[] | null
  coherence_cohesion_strengths: string[] | null
  lexical_resource_strengths: string[] | null
  grammatical_accuracy_strengths: string[] | null
  created_at: string
}
