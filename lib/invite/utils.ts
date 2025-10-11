/**
 * Invite system utilities
 */

/**
 * Generate a unique invite code for a new user
 * Format: 8 characters, uppercase letters and numbers
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return code
}

/**
 * Format invite code for display (add spacing for readability)
 * e.g., "ABCD1234" -> "ABCD 1234"
 */
export function formatInviteCode(code: string): string {
  if (!code || code.length !== 8) return code
  return `${code.slice(0, 4)} ${code.slice(4)}`
}

/**
 * Validate invite code format
 */
export function isValidInviteCodeFormat(code: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanCode = code.replace(/\s/g, '').toUpperCase()

  // Check if 8 characters and only alphanumeric
  return /^[A-Z0-9]{8}$/.test(cleanCode)
}

/**
 * Clean invite code for database lookup
 */
export function cleanInviteCode(code: string): string {
  return code.replace(/\s/g, '').toUpperCase()
}

/**
 * Calculate total available essays including bonuses
 */
export function calculateTotalQuota(baseQuota: number, bonusEssays: number): number {
  return baseQuota + bonusEssays
}

/**
 * Invite bonus amounts
 */
export const INVITE_BONUSES = {
  INVITER: 6,  // Person who shares the code gets 6 essays
  INVITED: 3,  // Person who uses the code gets 3 essays
} as const