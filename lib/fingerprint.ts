import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fpPromise: Promise<any> | null = null

/**
 * Get a unique device fingerprint for the current browser
 * Uses FingerprintJS to generate a stable identifier
 */
export async function getDeviceFingerprint(): Promise<string> {
  // Server-side fallback
  if (typeof window === 'undefined') {
    return 'server-side'
  }

  // Initialize FingerprintJS once
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }

  try {
    const fp = await fpPromise
    const result = await fp.get()
    return result.visitorId
  } catch (error) {
    console.error('Fingerprint generation error:', error)

    // Fallback to simple browser signature
    const fallback = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset()
    ].join('|')

    // Simple hash function
    let hash = 0
    for (let i = 0; i < fallback.length; i++) {
      const char = fallback.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }

    return `fallback-${Math.abs(hash).toString(36)}`
  }
}
