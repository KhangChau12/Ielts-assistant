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
 * Free: 6 essays base (+ invite bonuses)
 */
export function getTotalQuota(email: string): number | null {
  if (email.endsWith('@ptnk.edu.vn')) {
    return null // Unlimited for Pro
  }
  return 6 // Free tier limit (can earn more via invites)
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
    // Free user hit DAILY limit (can still use more tomorrow if have quota left)
    return {
      message: "You've reached your daily limit of 3 essays. Come back tomorrow to continue! Upgrade to Pro for 5 essays per day.",
      showUpgradeButton: true
    }
  }

  // Free user hit TOTAL limit (completely out of essays)
  return {
    message: "You've used all your free essays! To continue, invite friends to earn +6 essays per successful signup (they get +3 bonus too). Or upgrade to Pro for unlimited essays.",
    showUpgradeButton: true
  }
}
