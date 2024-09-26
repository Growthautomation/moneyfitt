'use client'

import { useEffect } from 'react'

export function LocalStorageCleaner() {
  useEffect(() => {
    // Clear onboarding responses on app start
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingResponses');
      console.log('Cleared onboarding responses');
    }
  }, [])

  return null
}