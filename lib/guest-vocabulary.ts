// Guest vocabulary storage using localStorage
// Since guests don't have database access, we store quiz results locally

export interface GuestQuizResult {
  essay_id: string
  vocab_type: 'paraphrase' | 'topic'
  score: number
  total_questions: number
  correct_answers: number[]
  incorrect_answers: number[]
  completed_at: string
}

const STORAGE_KEY = 'guest_vocabulary_quiz_results'

export function saveGuestQuizResult(result: GuestQuizResult): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getGuestQuizResults()
    const updated = [...existing, result]

    // Keep only last 10 results to avoid filling up localStorage
    const trimmed = updated.slice(-10)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Failed to save guest quiz result:', error)
  }
}

export function getGuestQuizResults(): GuestQuizResult[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load guest quiz results:', error)
    return []
  }
}

export function getGuestQuizResultsForEssay(essayId: string): GuestQuizResult[] {
  return getGuestQuizResults().filter(r => r.essay_id === essayId)
}

export function clearGuestQuizResults(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear guest quiz results:', error)
  }
}
