'use client'

import { useRouter } from 'next/navigation'
import { Chatbot } from '@/components/Chatbot'
import { AdvisorProfile } from '@/components/advisor-profile'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

export default function ChatPage() {
  const router = useRouter()
  const advisor = {
    name: "Sarah Johnson",
    title: "Senior Financial Advisor",
    avatarSrc: "/lib/images/profile1.png",
    initials: "SJ",
    description: "Experienced financial advisor specializing in retirement planning and investment strategies.",
    // ... other advisor details
  }

  const handleBackToHomepage = () => {
    router.push('/homepage')
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBackToHomepage}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Chat with {advisor.name}</h1>
      </div>
      <div className="flex flex-row gap-8">
        <div className="w-[60%]">
          <AdvisorProfile />
        </div>
        <div className="w-[40%] sticky top-8">
          <Chatbot advisor={advisor} />
        </div>
      </div>
    </main>
  )
}