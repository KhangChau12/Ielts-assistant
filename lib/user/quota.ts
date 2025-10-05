/**
 * User quota utilities
 * Determines daily essay submission limits based on email domain
 */

export type UserTier = 'pro' | 'free'

/**
 * Get daily essay quota based on email domain
 * Pro (@ptnk.edu.vn): 5 essays/day, unlimited total
 * Free: 3 essays/day, 9 essays total max
 */
export function getDailyQuota(email: string): number {
  if (email.endsWith('@ptnk.edu.vn')) {
    return 5 // Pro tier (PTNK students/staff)
  }
  return 3 // Free tier
}

/**
 * Get total essay limit (lifetime)
 * Pro: unlimited
 * Free: 9 essays max
 */
export function getTotalQuota(email: string): number | null {
  if (email.endsWith('@ptnk.edu.vn')) {
    return null // Unlimited for Pro
  }
  return 9 // Free tier limit
}

/**
 * Get user tier based on email domain
 */
export function getUserTier(email: string): UserTier {
  return email.endsWith('@ptnk.edu.vn') ? 'pro' : 'free'
}

/**
 * Get tier display name
 */
export function getTierName(tier: UserTier): string {
  return tier === 'pro' ? 'Pro' : 'Free'
}

/**
 * Get tier color for UI
 */
export function getTierColor(tier: UserTier): string {
  return tier === 'pro' ? 'bg-green-600' : 'bg-ocean-600'
}

/**
 * Get quota exhausted message based on tier
 */
export function getQuotaExhaustedMessage(tier: UserTier, isDaily: boolean): {
  message: string
  showUpgradeButton: boolean
} {
  if (tier === 'pro') {
    // Pro user hit daily limit
    return {
      message: "You've written 5 essays today - that's impressive dedication! Take some time to review your new vocabulary and strengthen what you've learned. Come back tomorrow refreshed and ready to continue improving!",
      showUpgradeButton: false
    }
  }

  if (isDaily) {
    // Free user hit daily limit (but not total limit yet)
    return {
      message: "You've reached your daily limit of 3 essays. Upgrade to Pro for 5 essays per day and unlimited total essays!",
      showUpgradeButton: true
    }
  }

  // Free user hit total limit (9 essays)
  return {
    message: "You've completed all 9 free essays! Upgrade to Pro to unlock unlimited essays (5 per day) and continue your IELTS journey.",
    showUpgradeButton: true
  }
}
