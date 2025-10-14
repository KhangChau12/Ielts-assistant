'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types/user'

/**
 * Custom hook for managing user authentication state with debouncing.
 *
 * This hook:
 * - Uses the singleton Supabase client (prevents multiple instances)
 * - Debounces auth state changes to prevent rapid successive updates
 * - Reduces unnecessary re-renders and profile fetches
 *
 * @returns {{ user: User | null, loading: boolean }}
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient() // Now returns singleton instance
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced function to fetch user profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        setUser(profile as User)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [supabase])

  // Debounced auth state change handler (500ms delay)
  const handleAuthChange = useCallback((userId: string | null) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      if (userId) {
        fetchUserProfile(userId)
      } else {
        setUser(null)
      }
    }, 500) // 500ms debounce - prevents rapid successive updates
  }, [fetchUserProfile])

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (!authError && authUser) {
        await fetchUserProfile(authUser.id)
      }

      setLoading(false)
    }

    fetchUser()

    // Subscribe to auth changes (with debouncing)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      handleAuthChange(session?.user?.id || null)
    })

    return () => {
      subscription.unsubscribe()
      // Clear debounce timer on cleanup
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [supabase, fetchUserProfile, handleAuthChange])

  return { user, loading }
}
