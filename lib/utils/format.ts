export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Estimate cost based on token usage (OpenAI pricing)
export function estimateTokenCost(
  inputTokens: number,
  outputTokens: number,
  model: string = 'gpt-4-turbo-preview'
): number {
  // Pricing per 1K tokens (as of 2024)
  const pricing: { [key: string]: { input: number; output: number } } = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  }

  const rates = pricing[model] || pricing['gpt-4-turbo-preview']

  const inputCost = (inputTokens / 1000) * rates.input
  const outputCost = (outputTokens / 1000) * rates.output

  return inputCost + outputCost
}
