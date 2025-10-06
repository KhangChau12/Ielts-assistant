import { getDeviceFingerprint } from './fingerprint'
import type { GuestCheck } from '@/types/guest'

// Development override: set to true to bypass fingerprint check
const DEV_BYPASS_FINGERPRINT = process.env.NEXT_PUBLIC_DEV_BYPASS_GUEST === 'true'

/**
 * Check if the current device has already used the guest trial
 */
export async function checkGuestUsage(): Promise<GuestCheck> {
  // Development bypass
  if (DEV_BYPASS_FINGERPRINT) {
    console.log('[DEV] Bypassing guest fingerprint check')
    return { hasUsed: false }
  }

  try {
    const fingerprint = await getDeviceFingerprint()

    const response = await fetch('/api/guest/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint })
    })

    if (!response.ok) {
      return { hasUsed: false }
    }

    return response.json()
  } catch (error) {
    console.error('Failed to check guest usage:', error)
    return { hasUsed: false }
  }
}

/**
 * Mark the current device as having used the guest trial
 */
export async function markGuestUsed(essayId: string): Promise<void> {
  try {
    const fingerprint = await getDeviceFingerprint()

    await fetch('/api/guest/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint, essayId })
    })
  } catch (error) {
    console.error('Failed to mark guest as used:', error)
  }
}
