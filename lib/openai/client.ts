import OpenAI from 'openai'

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable')
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

// Groq client for fast, free tasks (essay scoring, improvement)
export const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

// OpenAI client for vocabulary (better quality, with caching)
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Model configuration for different tasks
export const MODELS = {
  // Use Groq for scoring/improvement (fast, free)
  ESSAY_SCORING: 'llama-3.3-70b-versatile',
  ESSAY_IMPROVEMENT: 'llama-3.3-70b-versatile',
  ERROR_SUMMARY: 'llama-3.3-70b-versatile',

  // Use OpenAI GPT-4o for vocabulary (best quality, with caching)
  VOCABULARY: 'gpt-4o',
}

// Backward compatibility
export const openai = groqClient
export const DEFAULT_MODEL = 'llama-3.3-70b-versatile'
