'use client'

import { useEffect, useState } from 'react'
import { OnboardingFormComponent } from '@/components/onboarding-form'
import { Homepage } from '@/components/homepage'
import { useRouter } from 'next/navigation'
import useSupabase from '@/lib/supabase'

export default function Home() {
  const supabase = useSupabase();
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // redirect to onboarding if user is not logged in
  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        router.push('/onboarding')
        return
      }
      if (!data) {
        router.push('/onboarding')
        return
      }
      router.push('/homepage')
    }
    init().finally(() => setLoading(false))
  }, [supabase, router])

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>
  }

  return null // This component will not render anything after onboarding is complete
}