'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2 } from "lucide-react"
import { useRouter } from 'next/navigation'

export function AdvisorProfileCard({ advisor }) {
  const router = useRouter()

  const handleStartChat = () => {
    router.push('/chat') // Assuming '/chat' is the route for the chatbot
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={advisor.avatarSrc} alt={advisor.name} />
          <AvatarFallback>{advisor.initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">{advisor.name}</CardTitle>
        <CardDescription className="text-base">{advisor.title}</CardDescription>
        <CardDescription className="mt-2 text-sm">
          {advisor.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Retirement Planning</Badge>
            <Badge variant="secondary">Investment Strategies</Badge>
            <Badge variant="secondary">Tax Optimization</Badge>
            <Badge variant="secondary">Insurance Solutions</Badge>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Matching Criteria</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">Similar age group to you</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">Matched with your preferred gender</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">Shares interests in Health & Wellness and Family-Oriented Planning</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Languages Spoken</h3>
          <p className="text-sm">English, Spanish, Mandarin</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleStartChat}>View Profile</Button>
      </CardFooter>
    </Card>
  )
}