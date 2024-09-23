'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Briefcase, GraduationCap, Languages, MapPin, Star, User, ChevronLeft, ChevronRight, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export function AdvisorProfile() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3)
  }

  return (
    <div className="h-full">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 h-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-shrink-0">
            <Image
              src="/lib/images/profile1.png"
              alt="John Doe"
              width={150}
              height={150}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button size="icon" variant="outline" className="rounded-full bg-white">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn profile</span>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-white">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter profile</span>
              </Button>
            </div>
          </div>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-2xl font-bold break-words">John Doe, CFP, ChFC</CardTitle>
            <p className="text-sm text-muted-foreground break-words">Certified Financial Planner & Chartered Financial Consultant</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 overflow-hidden">
          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <User className="mr-2 flex-shrink-0" /> Professional Summary
            </h2>
            <p className="text-muted-foreground break-words">
              With over 15 years of experience in the financial industry, John specializes in comprehensive financial
              planning, investment management, and retirement strategies. His holistic approach ensures that clients
              receive tailored solutions to achieve their financial goals. John is committed to empowering individuals
              and families to make informed decisions and secure their financial future.
            </p>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Star className="mr-2 flex-shrink-0" /> Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Retirement Planning", "Investment Strategies", "Tax Optimization", "Estate Planning", "Risk Management & Insurance Solutions", "Wealth Management for High-Net-Worth Individuals"].map((spec) => (
                <Badge key={spec} variant="secondary">{spec}</Badge>
              ))}
            </div>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Languages className="mr-2" /> Languages Spoken
            </h2>
            <div className="flex gap-2">
              {["English", "Spanish", "Mandarin"].map((lang) => (
                <Badge key={lang} variant="outline">{lang}</Badge>
              ))}
            </div>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <GraduationCap className="mr-2" /> Education
            </h2>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Bachelor&apos;s in Finance from Harvard University</li>
              <li>Master&apos;s in Business Administration from Stanford University</li>
              <li>Certified Financial Planner (CFP) designation</li>
            </ul>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Briefcase className="mr-2" /> Professional Experience
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong>Senior Financial Advisor at ABC Wealth Management (2010-2023):</strong> Managed over $200 million
                in client assets, specializing in personalized investment strategies and comprehensive financial
                planning.
              </li>
              <li>
                <strong>Investment Analyst at XYZ Investments (2005-2010):</strong> Conducted in-depth market research
                and analysis to support portfolio management decisions.
              </li>
            </ul>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">Approach & Philosophy</h2>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-muted-foreground">
              &ldquo;I believe in creating personalized, long-term strategies that align with my clients&apos; values and goals. By
              taking a holistic approach, I help clients navigate life&apos;s financial complexities and ensure they are
              well-prepared for the future.&rdquo;
            </blockquote>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Award className="mr-2" /> Awards & Recognition
            </h2>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>&ldquo;Top Financial Advisor in Singapore 2022&rdquo; by Financial Times</li>
              <li>&ldquo;Best Client Service Award&rdquo; by Wealth Management Asia</li>
            </ul>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <MapPin className="mr-2" /> Office Location
            </h2>
            <p className="text-muted-foreground">123 Raffles Place, #01-01, Singapore 048616</p>
          </section>

          <section className="overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">Personal Interests & Hobbies</h2>
            <p className="text-muted-foreground mb-4 break-words">
              &ldquo;When I&apos;m not helping clients achieve their financial goals, I enjoy traveling, hiking, and spending time
              with my family. I&apos;m also an avid runner and have completed several marathons.&rdquo;
            </p>
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <Image
                  src="/lib/images/Pacific-Beach-Half-Marathon-Start-Line-3200x2133.jpg"
                  alt="John Doe hiking"
                  width={384}
                  height={256}
                  className="flex-shrink-0 object-cover"
                />
                <Image
                  src="/lib/images/images (3).jpg"
                  alt="John Doe running a marathon" 
                  width={384}
                  height={256}
                  className="flex-shrink-0 object-cover"
                />
                <Image
                  src="/lib/images/happy-three-generation-asian-family-600nw-2226442045.webp"
                  alt="John Doe with family"
                  width={384}
                  height={256}
                  className="flex-shrink-0 object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-white" : "bg-gray-400"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}